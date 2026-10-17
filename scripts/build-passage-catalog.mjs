// Builds the Find a Verse passage catalog from the whole-Bible payloads.
// Each catalog entry is a single verse (1-verse passages never cross chapters
// and map 1:1 to the source, guaranteeing reference accuracy). Verse text is
// NOT duplicated here — it is read from bible.json by reference at load time.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  OUT_DATA, FIND_A_VERSE_DIR, SCHEMA_VERSION, TRANSLATIONS, semanticSubdir,
} from './semantic.mjs';

for (const tr of TRANSLATIONS) {
  const bible = JSON.parse(readFileSync(join(OUT_DATA, tr.bibleFile), 'utf8'));
  const books = {};
  const passages = [];

  for (const bookId of Object.keys(bible.books)) {
    books[bookId] = bible.books[bookId];
    const prefix = `${bookId}.`;
    const keys = Object.keys(bible.chapters)
      .filter((k) => k.startsWith(prefix))
      .sort((a, b) => Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)));
    for (const key of keys) {
      const chapter = Number(key.slice(prefix.length));
      const verses = bible.chapters[key];
      for (let i = 0; i < verses.length; i++) {
        if (!verses[i].trim()) continue; // omit empty verses (no text to embed)
        passages.push([bookId, chapter, i + 1]);
      }
    }
  }

  const catalog = { schemaVersion: SCHEMA_VERSION, translationId: tr.id, books, passages };
  const dir = join(OUT_DATA, FIND_A_VERSE_DIR, semanticSubdir(tr.id));
  mkdirSync(dir, { recursive: true });
  const outFile = join(dir, 'catalog.json');
  writeFileSync(outFile, JSON.stringify(catalog) + '\n');
  console.log(`[${tr.id}] ${passages.length} passages → ${outFile}`);
}
