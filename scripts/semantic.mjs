// Shared config for the Find a Verse semantic index — model pin + output paths.
// The model is locked by id + revision + per-file SHA-256 so builds are
// reproducible and the runtime can verify it loaded the exact same weights.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EMBEDDING_DIM } from '../src/lib/semantic-search.mjs';

export { EMBEDDING_DIM };

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const OUT_DATA = join(ROOT, 'public', 'data');
export const FIND_A_VERSE_DIR = 'find-a-verse';

export const SCHEMA_VERSION = 1;

export const MODEL = {
  id: 'Xenova/all-MiniLM-L6-v2',
  revision: '751bff37182d3f1213fa05d7196b954e230abad9',
  // Model weight quantization (q8 ≈ 23 MB). This is distinct from the INT8
  // quantization applied to the generated index vectors below.
  dtype: 'q8',
  dim: EMBEDDING_DIM,
  pooling: 'mean',
  normalize: true,
  files: {
    'config.json': '7135149f7cffa1a573466c6e4d8423ed73b62fd2332c575bf738a0d033f70df7',
    'tokenizer.json': 'da0e79933b9ed51798a3ae27893d3c5fa4a201126cef75586296df9b4d2c62a0',
    'tokenizer_config.json': '9261e7d79b44c8195c1cada2b453e55b00aeb81e907a6664974b4d7776172ab3',
    'onnx/model_quantized.onnx': 'afdb6f1a0e45b715d0bb9b11772f032c399babd23bfc31fed1c170afc848bdb1',
  },
};

// Transformers.js resolves a local model as `localModelPath/<model-id>/<file>`,
// so the committed model files live nested under the model id.
export const MODEL_SUBDIR = MODEL.id; // 'Xenova/all-MiniLM-L6-v2'

// ONNX Runtime WASM backend files, served same-origin so inference runs fully
// offline (no jsDelivr CDN dependency at runtime). Copied from
// node_modules/onnxruntime-web/dist/ by build-embeddings.mjs; hashes pin them.
export const WASM = {
  dir: 'wasm',
  files: {
    'ort-wasm-simd-threaded.wasm': '06ba057753da3847e4c24f02d91ab133455b0817c69a44993a9a53a2146df9e3',
    'ort-wasm-simd-threaded.mjs': 'c57ca56328877353a575e51bbca6f18450027d6c9bf2307a2cb2c41363b4de9f',
  },
};

// Translations with their whole-Bible source file (the same files build-data.mjs emits).
export const TRANSLATIONS = [
  { id: 'WEBP', bibleFile: 'bible.json' },
  { id: 'KJV', bibleFile: 'bible-kjv.json' },
];

export const semanticSubdir = (id) => id.toLowerCase(); // 'webp' | 'kjv'

export function sha256OfFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}
