// validate.mjs — data quality checks for the v1 verse library + chapter files.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from './books.mjs';
import { parseBook, extractRange } from './usfm.mjs';
import { THEMES } from './verse-selections.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const USFM_DIR = join(ROOT, 'data', 'raw', 'usfm');
const DATA_DIR = join(ROOT, 'public', 'data');

const errors = [];

// Re-parse source (independent of the build output) for text cross-checks.
const bookIdFromFile = (f) => f.replace(/^\d{2,3}-/, '').replace(/engwebp\.usfm$/, '');
const fullData = new Map();
for (const f of readdirSync(USFM_DIR)) {
  if (!f.endsWith('engwebp.usfm')) continue;
  const id = bookIdFromFile(f);
  if (!BOOKS[id]) continue;
  fullData.set(id, parseBook(readFileSync(join(USFM_DIR, f), 'utf8')));
}

const verses = JSON.parse(readFileSync(join(DATA_DIR, 'verses.json'), 'utf8'));

// --- verse library checks ---
const seenIds = new Set();
for (const v of verses) {
  const tag = `${v.bookId} ${v.chapter}:${v.startVerse}-${v.endVerse}`;

  if (seenIds.has(v.id)) errors.push(`duplicate id: ${v.id}`);
  seenIds.add(v.id);

  for (const f of ['id', 'bookId', 'bookName', 'chapter', 'startVerse', 'endVerse', 'text', 'themes', 'translationId']) {
    if (v[f] == null || v[f] === '') errors.push(`${tag}: missing ${f}`);
  }
  if (v.translationId !== 'WEBP') errors.push(`${tag}: translationId != WEBP`);
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

  // Text must match the source exactly (reconstructed the same way).
  const book = fullData.get(v.bookId);
  const chapterVerses = book && book[v.chapter];
  if (!chapterVerses) {
    errors.push(`${tag}: reference does not exist in WEBP source`);
    continue;
  }
  const expected = extractRange(chapterVerses, v.startVerse, v.endVerse);
  if (expected !== v.text) errors.push(`${tag}: text does not match chapter data`);
}

// --- theme minimums ---
for (const theme of THEMES) {
  const n = verses.filter((v) => v.themes.includes(theme)).length;
  if (n < 8) errors.push(`theme ${theme}: only ${n} entries (need >= 8)`);
}

// --- All Verses pool: unique ids (covered above), and count in range ---
if (verses.length < 40 || verses.length > 60) {
  errors.push(`library size ${verses.length} outside 40-60`);
}

// --- chapter files readable + verse order ---
const chapterFiles = [];
for (const bookId of readdirSync(join(DATA_DIR, 'chapters'))) {
  for (const f of readdirSync(join(DATA_DIR, 'chapters', bookId))) {
    chapterFiles.push(join(DATA_DIR, 'chapters', bookId, f));
  }
}
for (const file of chapterFiles) {
  let obj;
  try {
    obj = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${file}: unreadable/invalid JSON`);
    continue;
  }
  const src = fullData.get(obj.bookId)?.[obj.chapter];
  if (!src) {
    errors.push(`${file}: ${obj.bookId} ${obj.chapter} not found in source`);
    continue;
  }
  if (obj.verses.length !== src.length) {
    errors.push(`${file}: verse count ${obj.verses.length} != source ${src.length}`);
    continue;
  }
  for (let i = 0; i < obj.verses.length; i++) {
    if (i > 0 && obj.verses[i].number <= obj.verses[i - 1].number) {
      errors.push(`${file}: verse numbers not strictly increasing at index ${i}`);
    }
    if (obj.verses[i].number !== src[i].number) {
      errors.push(`${file}: verse number mismatch at index ${i}`);
    }
    if (obj.verses[i].text !== src[i].text) {
      errors.push(`${file}: verse text mismatch at verse ${obj.verses[i].number}`);
    }
  }
}

// --- summary ---
console.log(`Checked ${verses.length} verses, ${chapterFiles.length} chapter files.`);
if (errors.length) {
  console.log(`FAIL (${errors.length} errors):`);
  for (const e of errors.slice(0, 200)) console.log('  - ' + e);
  process.exit(1);
} else {
  console.log('OK — all checks passed.');
}
