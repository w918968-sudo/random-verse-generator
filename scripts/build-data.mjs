// build-data.mjs — parse WEBP USFM source -> public/data (verses.json + chapter files).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from './books.mjs';
import { parseBook, extractRange } from './usfm.mjs';
import { VERSE_SELECTIONS } from './verse-selections.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const USFM_DIR = join(ROOT, 'data', 'raw', 'usfm');
const OUT_DATA = join(ROOT, 'public', 'data');

const makeId = (bookId, chapter, startVerse, endVerse) =>
  `${bookId.toLowerCase()}-${String(chapter).padStart(3, '0')}-${String(startVerse).padStart(3, '0')}-${String(endVerse).padStart(3, '0')}`;

const bookIdFromFile = (f) => f.replace(/^\d{2,3}-/, '').replace(/engwebp\.usfm$/, '');

// Parse every canonical book once.
const fullData = new Map(); // bookId -> { chapter -> verses }
for (const f of readdirSync(USFM_DIR)) {
  if (!f.endsWith('engwebp.usfm')) continue;
  const id = bookIdFromFile(f);
  if (!BOOKS[id]) continue; // skip FRT / GLO
  fullData.set(id, parseBook(readFileSync(join(USFM_DIR, f), 'utf8')));
}

// Build the verse library (text pulled from source).
const verses = VERSE_SELECTIONS.map((sel) => {
  const book = fullData.get(sel.bookId);
  if (!book) throw new Error(`unknown book ${sel.bookId}`);
  const chapterVerses = book[sel.chapter];
  if (!chapterVerses) throw new Error(`missing chapter ${sel.bookId} ${sel.chapter}`);
  return {
    id: makeId(sel.bookId, sel.chapter, sel.startVerse, sel.endVerse),
    bookId: sel.bookId,
    bookName: BOOKS[sel.bookId],
    chapter: sel.chapter,
    startVerse: sel.startVerse,
    endVerse: sel.endVerse,
    text: extractRange(chapterVerses, sel.startVerse, sel.endVerse),
    themes: [...sel.themes].sort(),
    translationId: 'WEBP',
  };
});

mkdirSync(OUT_DATA, { recursive: true });
writeFileSync(join(OUT_DATA, 'verses.json'), JSON.stringify(verses, null, 2) + '\n');

// Write chapter files only for chapters referenced by the library (lazy-loaded).
const needed = new Map(); // key -> {bookId, chapter}
for (const sel of VERSE_SELECTIONS) {
  needed.set(`${sel.bookId}/${sel.chapter}`, { bookId: sel.bookId, chapter: sel.chapter });
}
for (const { bookId, chapter } of needed.values()) {
  const obj = {
    translationId: 'WEBP',
    bookId,
    bookName: BOOKS[bookId],
    chapter,
    verses: fullData.get(bookId)[chapter].map((v) => ({ number: v.number, text: v.text })),
  };
  const dir = join(OUT_DATA, 'chapters', bookId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${chapter}.json`), JSON.stringify(obj, null, 2) + '\n');
}

// Build search + browse indexes for the /search/ page: a compact full-text index
// of every packaged chapter verse, and a book -> chapters manifest.
const browseIndex = [];
const searchVerses = [];
const searchBooks = {};
const chaptersByBook = new Map(); // bookId -> Set<chapter>
for (const { bookId, chapter } of needed.values()) {
  if (!chaptersByBook.has(bookId)) chaptersByBook.set(bookId, new Set());
  chaptersByBook.get(bookId).add(chapter);
}
for (const bookId of Object.keys(BOOKS)) {
  const chapters = chaptersByBook.get(bookId);
  if (!chapters) continue;
  searchBooks[bookId] = BOOKS[bookId];
  const chapterList = [...chapters].sort((a, b) => a - b);
  browseIndex.push({ bookId, bookName: BOOKS[bookId], chapters: chapterList });
  for (const chapter of chapterList) {
    for (const v of fullData.get(bookId)[chapter]) {
      searchVerses.push([bookId, chapter, v.number, v.text]);
    }
  }
}
writeFileSync(join(OUT_DATA, 'browse-index.json'), JSON.stringify(browseIndex) + '\n');
writeFileSync(join(OUT_DATA, 'search-index.json'), JSON.stringify({ books: searchBooks, verses: searchVerses }) + '\n');

console.log(`Built ${verses.length} verses, ${needed.size} chapter files, ${searchVerses.length} searchable verses across ${browseIndex.length} books.`);
for (const v of verses) {
  console.log(`${v.id} | ${v.bookName} ${v.chapter}:${v.startVerse}-${v.endVerse} | [${v.themes.join(', ')}] | ${v.text.slice(0, 60).replace(/\n/g, ' / ')}`);
}
