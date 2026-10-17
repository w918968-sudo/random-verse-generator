// Generates INT8 semantic vectors for every catalog passage and copies the
// pinned model files into public/ for same-origin serving. Requires network on
// first run to download the model (honors HF_ENDPOINT, else falls back to the
// hf-mirror.com mirror — this dev machine has no direct huggingface.co route).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { pipeline, env } from '@huggingface/transformers';
import { normalizeText, quantizeSymmetric } from '../src/lib/semantic-search.mjs';
import {
  ROOT, OUT_DATA, FIND_A_VERSE_DIR, MODEL, MODEL_SUBDIR, WASM, EMBEDDING_DIM, TRANSLATIONS, semanticSubdir, sha256OfFile,
} from './semantic.mjs';

const BATCH = 64;
const CACHE_DIR = join(ROOT, '.hf-cache');
env.cacheDir = CACHE_DIR;
env.remoteHost = process.env.HF_ENDPOINT || 'https://hf-mirror.com';

function toFloat32(out) {
  if (out.data && (out.data instanceof Float32Array || out.data instanceof Float64Array)) {
    return Float32Array.from(out.data);
  }
  const list = out.tolist();
  const flat = Array.isArray(list) && Array.isArray(list[0]) ? list.flat() : list;
  return Float32Array.from(flat);
}

console.log(`Loading ${MODEL.id} (revision ${MODEL.revision}, dtype ${MODEL.dtype}) ...`);
const extractor = await pipeline('feature-extraction', MODEL.id, {
  dtype: MODEL.dtype,
  revision: MODEL.revision,
});

// Copy the pinned model files into public/ so the browser can load them
// same-origin (no runtime dependency on huggingface.co or a mirror). They are
// nested under the model id — Transformers.js resolves local files as
// `localModelPath/<model-id>/<file>`.
const modelDir = join(OUT_DATA, FIND_A_VERSE_DIR, 'model', MODEL_SUBDIR);
mkdirSync(join(modelDir, 'onnx'), { recursive: true });
for (const rel of Object.keys(MODEL.files)) {
  copyFileSync(join(CACHE_DIR, MODEL.id, MODEL.revision, rel), join(modelDir, rel));
  console.log(`  model file: ${rel}`);
}

// Copy the ONNX Runtime WASM backend same-origin so the browser never has to
// fetch it from a CDN.
const wasmDir = join(OUT_DATA, FIND_A_VERSE_DIR, WASM.dir);
mkdirSync(wasmDir, { recursive: true });
for (const rel of Object.keys(WASM.files)) {
  copyFileSync(join(ROOT, 'node_modules', 'onnxruntime-web', 'dist', rel), join(wasmDir, rel));
  console.log(`  wasm file: ${rel}`);
}

for (const tr of TRANSLATIONS) {
  const dir = join(OUT_DATA, FIND_A_VERSE_DIR, semanticSubdir(tr.id));
  const catalog = JSON.parse(readFileSync(join(dir, 'catalog.json'), 'utf8'));
  const bible = JSON.parse(readFileSync(join(OUT_DATA, tr.bibleFile), 'utf8'));
  const n = catalog.passages.length;

  const texts = catalog.passages.map(([bookId, chapter, verse]) =>
    normalizeText(bible.chapters[`${bookId}.${chapter}`][verse - 1])
  );

  const vectorsF32 = new Float32Array(n * EMBEDDING_DIM);
  console.log(`[${tr.id}] embedding ${n} passages (batch ${BATCH}) ...`);
  for (let start = 0; start < n; start += BATCH) {
    const slice = texts.slice(start, start + BATCH);
    const out = await extractor(slice, { pooling: MODEL.pooling, normalize: MODEL.normalize });
    vectorsF32.set(toFloat32(out), start * EMBEDDING_DIM);
    if ((start / BATCH) % 50 === 0) console.log(`  ${start}/${n}`);
  }
  console.log(`  ${n}/${n}`);

  // Symmetric INT8 quantization — shared with the unit tests via quantizeSymmetric.
  const { scale, int8: vectorsI8 } = quantizeSymmetric(vectorsF32);

  const vectorsFile = join(dir, 'vectors.bin');
  writeFileSync(vectorsFile, Buffer.from(vectorsI8.buffer));
  const catalogFile = join(dir, 'catalog.json');
  const manifest = {
    schemaVersion: 1,
    translationId: tr.id,
    sourceDataHash: sha256OfFile(join(OUT_DATA, tr.bibleFile)),
    passageCount: n,
    model: MODEL,
    embedding: {
      dim: EMBEDDING_DIM,
      pooling: MODEL.pooling,
      normalize: MODEL.normalize,
      dtype: 'int8',
      scale,
      zeroPoint: 0,
      textNormalization: 'lowercase, collapse whitespace',
    },
    fileHashes: {
      'catalog.json': sha256OfFile(catalogFile),
      'vectors.bin': sha256OfFile(vectorsFile),
    },
    builtAt: new Date().toISOString(),
  };
  const manifestFile = join(dir, 'manifest.json');
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `[${tr.id}] wrote vectors.bin (${(vectorsI8.length / 1048576).toFixed(1)} MB), scale=${scale.toExponential(3)}`
  );
}
