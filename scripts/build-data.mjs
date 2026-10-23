// build-data.mjs — parse WEBP + KJV USFM source -> public/data
// (verses library, per-chapter files, and search/browse indexes for each translation).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from './books.mjs';
import { parseBook, extractRange } from './usfm.mjs';
import { VERSE_SELECTIONS } from './verse-selections.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DATA = join(ROOT, 'public', 'data');

const TRANSLATIONS = [
  { id: 'WEBP', dir: 'usfm', suffix: 'engwebp.usfm', versesFile: 'verses.json', chaptersDir: 'chapters', searchFile: 'search-index.json', bibleFile: 'bible.json' },
  { id: 'KJV', dir: 'kjv', suffix: 'eng-kjv2006.usfm', versesFile: 'verses-kjv.json', chaptersDir: 'chapters-kjv', searchFile: 'search-index-kjv.json', bibleFile: 'bible-kjv.json' },
];

const makeId = (bookId, chapter, startVerse, endVerse) =>
  `${bookId.toLowerCase()}-${String(chapter).padStart(3, '0')}-${String(startVerse).padStart(3, '0')}-${String(endVerse).padStart(3, '0')}`;

const bookIdFromFile = (f, suffix) =>
  f.replace(/^\d{2,3}-/, '').replace(new RegExp(suffix.replace(/\./g, '\\.') + '$'), '');

// Parse every canonical book for one translation.
function parseTranslation(dir, suffix) {
  const data = new Map();
  for (const f of readdirSync(join(ROOT, 'data', 'raw', dir))) {
    if (!f.endsWith(suffix)) continue;
    const id = bookIdFromFile(f, suffix);
    if (!BOOKS[id]) continue;
    data.set(id, parseBook(readFileSync(join(ROOT, 'data', 'raw', dir, f), 'utf8')));
  }
  return data;
}

// The chapter set is derived from the verse selections and shared by every translation.
const needed = new Map(); // "bookId/chapter" -> { bookId, chapter }
for (const sel of VERSE_SELECTIONS) {
  needed.set(`${sel.bookId}/${sel.chapter}`, { bookId: sel.bookId, chapter: sel.chapter });
}

// Browse index (translation-agnostic: bookId -> chapters, canonical order).
const chaptersByBook = new Map(); // bookId -> Set<chapter>
for (const { bookId, chapter } of needed.values()) {
  if (!chaptersByBook.has(bookId)) chaptersByBook.set(bookId, new Set());
  chaptersByBook.get(bookId).add(chapter);
}
const browseIndex = [];
for (const bookId of Object.keys(BOOKS)) {
  const chapters = chaptersByBook.get(bookId);
  if (!chapters) continue;
  browseIndex.push({ bookId, bookName: BOOKS[bookId], chapters: [...chapters].sort((a, b) => a - b) });
}

mkdirSync(OUT_DATA, { recursive: true });
writeFileSync(join(OUT_DATA, 'browse-index.json'), JSON.stringify(browseIndex) + '\n');

for (const tr of TRANSLATIONS) {
  const fullData = parseTranslation(tr.dir, tr.suffix);

  const verses = VERSE_SELECTIONS.map((sel) => {
    const book = fullData.get(sel.bookId);
    if (!book) throw new Error(`unknown book ${sel.bookId} (${tr.id})`);
    const chapterVerses = book[sel.chapter];
    if (!chapterVerses) throw new Error(`missing chapter ${sel.bookId} ${sel.chapter} (${tr.id})`);
    return {
      id: makeId(sel.bookId, sel.chapter, sel.startVerse, sel.endVerse),
      bookId: sel.bookId,
      bookName: BOOKS[sel.bookId],
      chapter: sel.chapter,
      startVerse: sel.startVerse,
      endVerse: sel.endVerse,
      text: extractRange(chapterVerses, sel.startVerse, sel.endVerse),
      themes: [...sel.themes].sort(),
      occasions: [...(sel.occasions || [])].sort(),
      translationId: tr.id,
    };
  });
  writeFileSync(join(OUT_DATA, tr.versesFile), JSON.stringify(verses, null, 2) + '\n');

  const searchVerses = [];
  const searchBooks = {};
  // Clear stale chapter files left over from earlier selections before writing.
  rmSync(join(OUT_DATA, tr.chaptersDir), { recursive: true, force: true });
  for (const { bookId, chapter } of needed.values()) {
    const obj = {
      translationId: tr.id,
      bookId,
      bookName: BOOKS[bookId],
      chapter,
      verses: fullData.get(bookId)[chapter].map((v) => ({ number: v.number, text: v.text })),
    };
    const dir = join(OUT_DATA, tr.chaptersDir, bookId);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${chapter}.json`), JSON.stringify(obj, null, 2) + '\n');
  }
  for (const bookId of Object.keys(BOOKS)) {
    const chapters = chaptersByBook.get(bookId);
    if (!chapters) continue;
    searchBooks[bookId] = BOOKS[bookId];
    for (const chapter of [...chapters].sort((a, b) => a - b)) {
      for (const v of fullData.get(bookId)[chapter]) {
        searchVerses.push([bookId, chapter, v.number, v.text]);
      }
    }
  }
  writeFileSync(join(OUT_DATA, tr.searchFile), JSON.stringify({ books: searchBooks, verses: searchVerses }) + '\n');

  // Full-Bible payload — all 66 books, all chapters — for the "Whole Bible"
  // verse source. Compact: chapter texts are arrays (index 0 = verse 1). This
  // is lazy-loaded client-side, so it is written compact (no pretty-print).
  const bibleBooks = {};
  const bibleChapters = {};
  for (const bookId of Object.keys(BOOKS)) {
    const book = fullData.get(bookId);
    if (!book) throw new Error(`missing book ${bookId} (${tr.id})`);
    bibleBooks[bookId] = BOOKS[bookId];
    for (const chapter of Object.keys(book).map(Number).sort((a, b) => a - b)) {
      bibleChapters[`${bookId}.${chapter}`] = book[chapter].map((v) => v.text);
    }
  }
  const bibleTotal = Object.values(bibleChapters).reduce((n, arr) => n + arr.length, 0);
  writeFileSync(join(OUT_DATA, tr.bibleFile), JSON.stringify({ translationId: tr.id, books: bibleBooks, chapters: bibleChapters }) + '\n');

  console.log(`[${tr.id}] ${verses.length} verses, ${needed.size} chapter files, ${searchVerses.length} searchable verses, ${bibleTotal} whole-Bible verses.`);
}

console.log(`Browse index: ${browseIndex.length} books.`);
