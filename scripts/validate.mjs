// validate.mjs — data quality checks for the verse libraries + chapter files
// across every translation, plus cross-translation reference parity.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from './books.mjs';
import { parseBook, extractRange } from './usfm.mjs';
import { THEMES } from './verse-selections.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'public', 'data');

const TRANSLATIONS = [
  { id: 'WEBP', dir: 'usfm', suffix: 'engwebp.usfm', versesFile: 'verses.json', chaptersDir: 'chapters' },
  { id: 'KJV', dir: 'kjv', suffix: 'eng-kjv2006.usfm', versesFile: 'verses-kjv.json', chaptersDir: 'chapters-kjv' },
];

const errors = [];
const bookIdFromFile = (f, suffix) =>
  f.replace(/^\d{2,3}-/, '').replace(new RegExp(suffix.replace(/\./g, '\\.') + '$'), '');

// Re-parse a translation's source (independent of the build output) for text
// cross-checks. The raw USFM source is gitignored; on a fresh clone (e.g. CI)
// it is absent, so we degrade to structural checks only.
function parseSource(dir, suffix) {
  const srcDir = join(ROOT, 'data', 'raw', dir);
  if (!existsSync(srcDir)) return null;
  const data = new Map();
  for (const f of readdirSync(srcDir)) {
    if (!f.endsWith(suffix)) continue;
    const id = bookIdFromFile(f, suffix);
    if (!BOOKS[id]) continue;
    data.set(id, parseBook(readFileSync(join(srcDir, f), 'utf8')));
  }
  return data;
}

const libraries = [];
const missingSources = [];

for (const tr of TRANSLATIONS) {
  const verses = JSON.parse(readFileSync(join(DATA_DIR, tr.versesFile), 'utf8'));
  libraries.push({ id: tr.id, verses });

  const source = parseSource(tr.dir, tr.suffix);
  const hasSource = source !== null;
  if (!hasSource) missingSources.push(tr.id);

  const seenIds = new Set();
  for (const v of verses) {
    const tag = `${tr.id} ${v.bookId} ${v.chapter}:${v.startVerse}-${v.endVerse}`;

    if (seenIds.has(v.id)) errors.push(`duplicate id: ${v.id} (${tr.id})`);
    seenIds.add(v.id);

    for (const f of ['id', 'bookId', 'bookName', 'chapter', 'startVerse', 'endVerse', 'text', 'themes', 'translationId']) {
      if (v[f] == null || v[f] === '') errors.push(`${tag}: missing ${f}`);
    }
    if (v.translationId !== tr.id) errors.push(`${tag}: translationId != ${tr.id}`);
    if (!BOOKS[v.bookId]) errors.push(`${tag}: unknown bookId ${v.bookId}`);
    if (v.bookName !== BOOKS[v.bookId]) errors.push(`${tag}: bookName ${v.bookName} != ${BOOKS[v.bookId]}`);
    if (!Array.isArray(v.themes) || v.themes.length === 0) errors.push(`${tag}: no themes`);
    else for (const t of v.themes) if (!THEMES.includes(t)) errors.push(`${tag}: unknown theme ${t}`);

    if (!(Number.isInteger(v.chapter) && v.chapter >= 1)) errors.push(`${tag}: bad chapter`);
    if (!(Number.isInteger(v.startVerse) && Number.isInteger(v.endVerse) && v.startVerse >= 1 && v.endVerse >= v.startVerse)) {
      errors.push(`${tag}: bad verse range`);
    }
    const span = v.endVerse - v.startVerse + 1;
    if (span < 3 || span > 5) errors.push(`${tag}: verse span ${span} out of range (3-5)`);
    if (!v.text || !v.text.trim()) errors.push(`${tag}: empty text`);

    if (hasSource) {
      const book = source.get(v.bookId);
      const chapterVerses = book && book[v.chapter];
      if (!chapterVerses) {
        errors.push(`${tag}: reference does not exist in ${tr.id} source`);
        continue;
      }
      const expected = extractRange(chapterVerses, v.startVerse, v.endVerse);
      if (expected !== v.text) errors.push(`${tag}: text does not match chapter data`);
    }
  }

  // chapter files readable + verse order + text matches source
  const chapterFiles = [];
  for (const bookId of readdirSync(join(DATA_DIR, tr.chaptersDir))) {
    for (const f of readdirSync(join(DATA_DIR, tr.chaptersDir, bookId))) {
      chapterFiles.push(join(DATA_DIR, tr.chaptersDir, bookId, f));
    }
  }
  for (const file of chapterFiles) {
    let obj;
    try {
      obj = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      errors.push(`${file}: unreadable/invalid JSON`);
      continue;
    }
    for (let i = 0; i < obj.verses.length; i++) {
      if (i > 0 && obj.verses[i].number <= obj.verses[i - 1].number) {
        errors.push(`${file}: verse numbers not strictly increasing at index ${i}`);
      }
    }
    if (!hasSource) continue;

    const src = source.get(obj.bookId)?.[obj.chapter];
    if (!src) {
      errors.push(`${file}: ${obj.bookId} ${obj.chapter} not found in ${tr.id} source`);
      continue;
    }
    if (obj.verses.length !== src.length) {
      errors.push(`${file}: verse count ${obj.verses.length} != source ${src.length}`);
      continue;
    }
    for (let i = 0; i < obj.verses.length; i++) {
      if (obj.verses[i].number !== src[i].number) {
        errors.push(`${file}: verse number mismatch at index ${i}`);
      }
      if (obj.verses[i].text !== src[i].text) {
        errors.push(`${file}: verse text mismatch at verse ${obj.verses[i].number}`);
      }
    }
  }
}

// Cross-translation parity: every translation covers the exact same references.
const [primary, ...rest] = libraries;
const primaryKeys = new Set(primary.verses.map((v) => v.id));
for (const lib of rest) {
  const keys = new Set(lib.verses.map((v) => v.id));
  for (const k of primaryKeys) if (!keys.has(k)) errors.push(`${lib.id}: missing reference ${k}`);
  for (const k of keys) if (!primaryKeys.has(k)) errors.push(`${lib.id}: extra reference ${k}`);
}

// theme minimums + library size (primary translation)
for (const theme of THEMES) {
  const n = primary.verses.filter((v) => v.themes.includes(theme)).length;
  if (n < 8) errors.push(`theme ${theme}: only ${n} entries (need >= 8)`);
}
if (primary.verses.length < 40 || primary.verses.length > 200) {
  errors.push(`library size ${primary.verses.length} outside 40-200`);
}

if (missingSources.length) {
  console.log(`Note: raw source absent for [${missingSources.join(', ')}] — text cross-checks skipped (structural checks only).`);
}
console.log(`Checked ${libraries.length} translation(s): ${libraries.map((l) => `${l.id} (${l.verses.length} verses)`).join(', ')}.`);
if (errors.length) {
  console.log(`FAIL (${errors.length} errors):`);
  for (const e of errors.slice(0, 200)) console.log('  - ' + e);
  process.exit(1);
} else {
  console.log('OK — all checks passed.');
}
