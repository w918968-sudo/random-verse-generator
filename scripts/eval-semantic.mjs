// Offline evaluation of the Find a Verse semantic index (WEBP). Loads the real
// committed index + bible.json, embeds each query from scripts/eval-set.mjs, and
// reports top-1 / top-5 relevance, 100% text/reference accuracy, and the Float32
// vs INT8 quantization fidelity (re-embedding the top passages to compare the
// exact cosine against the INT8-dequantized cosine).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pipeline, env } from '@huggingface/transformers';
import {
  rankPassages,
  normalizeText,
  tokenize,
  cosine,
  EMBEDDING_DIM,
} from '../src/lib/semantic-search.mjs';
import { MODEL, OUT_DATA, FIND_A_VERSE_DIR } from './semantic.mjs';
import { EVAL_SET } from './eval-set.mjs';

env.cacheDir = join(process.cwd(), '.hf-cache');
env.remoteHost = process.env.HF_ENDPOINT || 'https://hf-mirror.com';

const id = 'WEBP';
const dir = join(OUT_DATA, FIND_A_VERSE_DIR, id.toLowerCase());
const catalog = JSON.parse(readFileSync(join(dir, 'catalog.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
const bible = JSON.parse(readFileSync(join(OUT_DATA, 'bible.json'), 'utf8'));

const buf = readFileSync(join(dir, 'vectors.bin'));
const vectors = new Int8Array(buf.buffer, buf.byteOffset, buf.byteLength);
const texts = catalog.passages.map(([b, c, v]) => normalizeText(bible.chapters[`${b}.${c}`][v - 1]));

// Hybrid weights — overridable for calibration sweeps (defaults match the page).
const SEMANTIC_WEIGHT = Number(process.env.SEMANTIC_WEIGHT ?? 1);
const KEYWORD_WEIGHT = Number(process.env.KEYWORD_WEIGHT ?? 0.4);
// STRICT=1 scores only against the single `ref`, ignoring `also` parallels —
// useful for separating "did it find the one intended verse" from "did it find a
// relevant verse".
const STRICT = process.env.STRICT === '1';

function passageIndex([b, c, v]) {
  return catalog.passages.findIndex((p) => p[0] === b && p[1] === c && p[2] === v);
}

function toFloat32(out) {
  if (out.data && (out.data instanceof Float32Array || out.data instanceof Float64Array)) {
    return Float32Array.from(out.data);
  }
  const list = out.tolist();
  const flat = Array.isArray(list) && Array.isArray(list[0]) ? list.flat() : list;
  return Float32Array.from(flat);
}

console.log(`Loading ${MODEL.id} ...`);
const extractor = await pipeline('feature-extraction', MODEL.id, {
  dtype: MODEL.dtype,
  revision: MODEL.revision,
});

let top1 = 0;
let top5 = 0;
let textErrors = 0;
let refErrors = 0;
let fidelityMax = 0;
let fidelitySum = 0;
let fidelityN = 0;
const misses = [];

for (const { q, ref, also = [] } of EVAL_SET) {
  const out = await extractor([q], { pooling: MODEL.pooling, normalize: MODEL.normalize });
  const qvec = toFloat32(out);
  const ranked = rankPassages({
    queryVec: qvec,
    vectors,
    scale: manifest.embedding.scale,
    zeroPoint: manifest.embedding.zeroPoint,
    dim: EMBEDDING_DIM,
    texts,
    queryTokens: tokenize(q),
    semanticWeight: SEMANTIC_WEIGHT,
    keywordWeight: KEYWORD_WEIGHT,
  });

  const acceptable = new Set((STRICT ? [ref] : [ref, ...also]).map((r) => passageIndex(r)));
  const top = ranked.slice(0, 5);
  const top1Hit = top.length > 0 && acceptable.has(top[0].index);
  const top5Hit = top.some((r) => acceptable.has(r.index));
  if (top1Hit) top1++;
  if (top5Hit) top5++;
  if (!top1Hit) misses.push({ q, ref, actual: top.slice(0, 3).map((r) => r.index) });

  // Text + reference accuracy (red line: result text must equal source data).
  for (const r of top) {
    const [b, c, v] = catalog.passages[r.index];
    if (texts[r.index] !== normalizeText(bible.chapters[`${b}.${c}`][v - 1])) textErrors++;
    if (!catalog.books[b] || !Number.isInteger(c) || !Number.isInteger(v)) refErrors++;

    // Float32 vs INT8 fidelity: exact cosine of the freshly-embedded passage vs
    // the INT8-dequantized cosine the ranker used.
    const tex = await extractor([texts[r.index]], { pooling: MODEL.pooling, normalize: MODEL.normalize });
    const tvec = toFloat32(tex);
    const delta = Math.abs(cosine(qvec, tvec) - r.semantic);
    fidelityMax = Math.max(fidelityMax, delta);
    fidelitySum += delta;
    fidelityN++;
  }
}

const n = EVAL_SET.length;
const label = STRICT ? 'top-1 (strict, single intended verse)' : 'top-1 (relevant, incl. parallels)';
console.log('\n=== Find a Verse evaluation ===');
console.log(`queries:            ${n}`);
console.log(`${label}:  ${top1}/${n}  (${((top1 / n) * 100).toFixed(1)}%)${top1 / n >= 0.8 ? '  ✓' : '  ✗ (target ≥80%)'}`);
console.log(`top-5 ${STRICT ? 'strict' : 'relevant'}:       ${top5}/${n}  (${((top5 / n) * 100).toFixed(1)}%)`);
console.log(`text mismatches:    ${textErrors}  (must be 0)`);
console.log(`reference errors:   ${refErrors}  (must be 0)`);
console.log(`INT8 cosine error:  mean ${(fidelitySum / fidelityN).toFixed(5)}, max ${fidelityMax.toFixed(5)}`);

if (misses.length) {
  console.log('\nTop-1 misses (query → expected vs top-3 actual):');
  for (const m of misses) {
    const refStr = m.ref.map((x) => String(x)).join(':');
    const actual = m.actual.map((i) => catalog.passages[i].map((x) => String(x)).join(':')).join(', ');
    console.log(`  "${m.q}" → ${refStr}  |  got [${actual}]`);
  }
}
