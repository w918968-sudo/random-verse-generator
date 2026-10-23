// Builds public/data/related.json — for every curated passage, the most
// semantically related curated passages — by reusing the already-built WEBP
// semantic index (vectors.bin). No model inference runs here: each verse's
// embedding is read from the index, and multi-verse passages are mean-pooled
// from their single-verse rows. Related ids are translation-independent (the
// 427 curated references are identical in WEBP and KJV), so one file serves
// both translations.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, OUT_DATA, FIND_A_VERSE_DIR, semanticSubdir, EMBEDDING_DIM } from './semantic.mjs';

const TOP = 4; // related candidates stored per passage

const verses = JSON.parse(readFileSync(join(OUT_DATA, 'verses.json'), 'utf8'));
const dir = join(OUT_DATA, FIND_A_VERSE_DIR, semanticSubdir('WEBP'));
const catalog = JSON.parse(readFileSync(join(dir, 'catalog.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
const buf = readFileSync(join(dir, 'vectors.bin'));
const vectors = new Int8Array(buf.buffer, buf.byteOffset, buf.byteLength);

const { scale, zeroPoint = 0, dim } = manifest.embedding;
if (dim !== EMBEDDING_DIM) {
  throw new Error(`unexpected embedding dim ${dim} (expected ${EMBEDDING_DIM})`);
}

// Single-verse passage index -> row offset in the vector store.
const passageIndex = new Map();
for (let i = 0; i < catalog.passages.length; i++) {
  const [b, c, v] = catalog.passages[i];
  passageIndex.set(`${b}.${c}.${v}`, i);
}

// Mean-pool the verse rows for a curated passage (startVerse..endVerse) into a
// dequantized, L2-normalized passage vector (normalized so cosine = dot).
function passageVector(v) {
  const acc = new Float32Array(dim);
  let n = 0;
  for (let verse = v.startVerse; verse <= v.endVerse; verse++) {
    const idx = passageIndex.get(`${v.bookId}.${v.chapter}.${verse}`);
    if (idx === undefined) continue; // verse omitted from the index
    const start = idx * dim;
    for (let d = 0; d < dim; d++) acc[d] += (vectors[start + d] - zeroPoint) * scale;
    n++;
  }
  if (n === 0) return null;
  for (let d = 0; d < dim; d++) acc[d] /= n;
  let norm = 0;
  for (let d = 0; d < dim; d++) norm += acc[d] * acc[d];
  norm = Math.sqrt(norm);
  for (let d = 0; d < dim; d++) acc[d] = norm > 0 ? acc[d] / norm : 0;
  return acc;
}

const vecs = verses.map(passageVector);
const sameChapter = (a, b) => a.bookId === b.bookId && a.chapter === b.chapter;

// All-pairs cosine, excluding self and same-chapter neighbors (those are
// already covered by "Read Context"), keeping the top TOP per passage.
const scores = verses.map(() => []);
let compared = 0;
for (let i = 0; i < verses.length; i++) {
  for (let j = i + 1; j < verses.length; j++) {
    if (!vecs[i] || !vecs[j]) continue;
    if (sameChapter(verses[i], verses[j])) continue;
    let dot = 0;
    for (let d = 0; d < dim; d++) dot += vecs[i][d] * vecs[j][d];
    compared++;
    scores[i].push({ id: verses[j].id, dot });
    scores[j].push({ id: verses[i].id, dot });
  }
}

const related = {};
for (let i = 0; i < verses.length; i++) {
  scores[i].sort((a, b) => b.dot - a.dot);
  related[verses[i].id] = scores[i].slice(0, TOP).map((s) => s.id);
}

// Self-checks — the same invariants validate.mjs enforces later.
const ids = new Set(verses.map((v) => v.id));
for (const v of verses) {
  const list = related[v.id];
  if (list.length !== TOP) throw new Error(`${v.id}: expected ${TOP} related, got ${list.length}`);
  if (new Set(list).size !== list.length) throw new Error(`${v.id}: duplicate related id`);
  for (const rid of list) {
    if (!ids.has(rid)) throw new Error(`${v.id}: unknown related id ${rid}`);
    if (rid === v.id) throw new Error(`${v.id}: self-related`);
    const r = verses.find((x) => x.id === rid);
    if (sameChapter(v, r)) throw new Error(`${v.id}: same-chapter related ${rid}`);
  }
}

const out = {
  schemaVersion: 1,
  translationId: 'WEBP',
  top: TOP,
  note: 'Related ids are translation-independent (the same 427 curated references exist in WEBP and KJV).',
  builtAt: new Date().toISOString(),
  related,
};
const outFile = join(OUT_DATA, 'related.json');
writeFileSync(outFile, JSON.stringify(out) + '\n');

const avgDot = scores.reduce((n, s) => n + (s[0]?.dot || 0), 0) / verses.length;
console.log(
  `wrote ${outFile} — ${verses.length} passages, ${compared} pairs, top ${TOP} each. ` +
    `Mean top cosine: ${avgDot.toFixed(3)}.`
);
