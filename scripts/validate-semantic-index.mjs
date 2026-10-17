// Validates the Find a Verse semantic index against the whole-Bible source and
// the pinned model config. Structural only — no model inference — so it runs in
// CI on a clean clone (the committed index is checked, never rebuilt here).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOOKS } from './books.mjs';
import {
  OUT_DATA, FIND_A_VERSE_DIR, SCHEMA_VERSION, EMBEDDING_DIM, MODEL, MODEL_SUBDIR, WASM, TRANSLATIONS, semanticSubdir, sha256OfFile,
} from './semantic.mjs';

const errors = [];

for (const tr of TRANSLATIONS) {
  const dir = join(OUT_DATA, FIND_A_VERSE_DIR, semanticSubdir(tr.id));
  const bible = JSON.parse(readFileSync(join(OUT_DATA, tr.bibleFile), 'utf8'));

  let catalog;
  let manifest;
  try {
    catalog = JSON.parse(readFileSync(join(dir, 'catalog.json'), 'utf8'));
  } catch {
    errors.push(`${tr.id}: catalog.json unreadable/invalid`);
    continue;
  }
  try {
    manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  } catch {
    errors.push(`${tr.id}: manifest.json unreadable/invalid`);
    continue;
  }

  if (catalog.schemaVersion !== SCHEMA_VERSION) errors.push(`${tr.id}: catalog schemaVersion ${catalog.schemaVersion} != ${SCHEMA_VERSION}`);
  if (catalog.translationId !== tr.id) errors.push(`${tr.id}: catalog translationId ${catalog.translationId}`);
  if (!Array.isArray(catalog.passages) || catalog.passages.length === 0) errors.push(`${tr.id}: no passages`);

  const seen = new Set();
  for (const p of catalog.passages || []) {
    if (!Array.isArray(p) || p.length !== 3) {
      errors.push(`${tr.id}: bad passage entry ${JSON.stringify(p)}`);
      continue;
    }
    const [bookId, chapter, verse] = p;
    const key = `${bookId}.${chapter}.${verse}`;
    if (seen.has(key)) errors.push(`${tr.id}: duplicate passage ${key}`);
    seen.add(key);
    if (!BOOKS[bookId]) errors.push(`${tr.id}: unknown book ${bookId} in ${key}`);
    if (!catalog.books || catalog.books[bookId] !== BOOKS[bookId]) errors.push(`${tr.id}: catalog.books mismatch for ${bookId}`);
    const arr = bible.chapters[`${bookId}.${chapter}`];
    if (!arr) {
      errors.push(`${tr.id}: ${key} chapter missing in bible`);
      continue;
    }
    if (!(Number.isInteger(verse) && verse >= 1 && verse <= arr.length)) {
      errors.push(`${tr.id}: ${key} verse out of range`);
      continue;
    }
    if (!arr[verse - 1] || !arr[verse - 1].trim()) errors.push(`${tr.id}: ${key} empty text in bible`);
  }

  const vectorsFile = join(dir, 'vectors.bin');
  if (!existsSync(vectorsFile)) {
    errors.push(`${tr.id}: vectors.bin missing`);
    continue;
  }
  const expected = catalog.passages.length * EMBEDDING_DIM;
  const size = readFileSync(vectorsFile).length;
  if (size !== expected) errors.push(`${tr.id}: vectors.bin ${size} bytes != ${expected} (passages × dim)`);

  if (manifest.translationId !== tr.id) errors.push(`${tr.id}: manifest translationId mismatch`);
  if (manifest.passageCount !== catalog.passages.length) errors.push(`${tr.id}: manifest passageCount ${manifest.passageCount} != ${catalog.passages.length}`);
  if (manifest.embedding?.dim !== EMBEDDING_DIM) errors.push(`${tr.id}: manifest dim mismatch`);
  if (manifest.embedding?.dtype !== 'int8') errors.push(`${tr.id}: manifest dtype != int8`);
  if (!(manifest.embedding?.scale > 0)) errors.push(`${tr.id}: manifest scale invalid`);
  if (manifest.model?.id !== MODEL.id || manifest.model?.revision !== MODEL.revision) errors.push(`${tr.id}: manifest model pin mismatch`);
  const srcHash = sha256OfFile(join(OUT_DATA, tr.bibleFile));
  if (manifest.sourceDataHash !== srcHash) errors.push(`${tr.id}: sourceDataHash mismatch (index built from different bible data)`);
  for (const [f, want] of Object.entries(manifest.fileHashes || {})) {
    if (sha256OfFile(join(dir, f)) !== want) errors.push(`${tr.id}: ${f} hash mismatch`);
  }
}

// Model files present + pinned hashes match (same-origin serving).
const modelDir = join(OUT_DATA, FIND_A_VERSE_DIR, 'model', MODEL_SUBDIR);
for (const [rel, want] of Object.entries(MODEL.files)) {
  const f = join(modelDir, rel);
  if (!existsSync(f)) {
    errors.push(`model: ${rel} missing`);
    continue;
  }
  if (sha256OfFile(f) !== want) errors.push(`model: ${rel} hash mismatch (unpinned model file)`);
}

// ONNX Runtime WASM runtime files present + pinned hashes match.
const wasmDir = join(OUT_DATA, FIND_A_VERSE_DIR, WASM.dir);
for (const [rel, want] of Object.entries(WASM.files)) {
  const f = join(wasmDir, rel);
  if (!existsSync(f)) {
    errors.push(`wasm: ${rel} missing`);
    continue;
  }
  if (sha256OfFile(f) !== want) errors.push(`wasm: ${rel} hash mismatch`);
}

if (errors.length) {
  console.log(`FAIL (${errors.length} errors):`);
  for (const e of errors.slice(0, 100)) console.log('  - ' + e);
  process.exit(1);
}
console.log('OK — semantic index passed all checks.');
