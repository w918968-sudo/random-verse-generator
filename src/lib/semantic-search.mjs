// Pure, environment-agnostic semantic-search helpers. Shared by the Find a Verse
// page (browser), the offline evaluation script (Node), and the index build
// (text normalization MUST be identical at index time and query time).
// No DOM, no Node-only imports — safe to import from either runtime.

export const EMBEDDING_DIM = 384;

// Text normalization applied identically to index text and runtime queries.
export function normalizeText(text) {
  return String(text ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Common English stopwords, dropped from the keyword signal so they don't dilute
// it (e.g. "peace in the midst of trouble" should match on "peace"/"midst"/
// "trouble", not on "in"/"the"/"of", which appear in thousands of verses).
// Negations ("no", "not", "nor") are deliberately kept: they carry meaning in
// verse search ("fear no evil", "do not worry").
const STOPWORDS = new Set(
  (
    'a an the and or but if because as until while of at by for with about against ' +
    'between into through during before after above below to from up down in out on off ' +
    'over under again further then once here there when where why how all any both each ' +
    'few more most other some such only own same so than too very can will just should ' +
    'now i me my myself we our ours ourselves you your yours yourself yourselves he him ' +
    'his himself she her hers herself it its itself they them their theirs themselves ' +
    'what which who whom this that these those am is are was were be been being have has ' +
    'had having do does did doing'
  ).split(' ')
);

// Word tokens (lowercased, stopword-filtered) used for the keyword-match signal.
export function tokenize(text) {
  const out = [];
  for (const m of normalizeText(text).matchAll(/[a-z0-9']+/g)) {
    if (!STOPWORDS.has(m[0])) out.push(m[0]);
  }
  return out;
}

// Symmetric INT8 quantization: q = clamp(round(x / scale)), scale = maxAbs / 127.
// Used at index build time (and tested here so build + test share the math).
export function quantizeSymmetric(values) {
  let maxAbs = 0;
  for (let i = 0; i < values.length; i++) {
    const a = Math.abs(values[i]);
    if (a > maxAbs) maxAbs = a;
  }
  const scale = maxAbs === 0 ? 1 : maxAbs / 127;
  const int8 = new Int8Array(values.length);
  for (let i = 0; i < values.length; i++) {
    int8[i] = Math.max(-127, Math.min(127, Math.round(values[i] / scale)));
  }
  return { scale, int8 };
}

export function cosine(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Fraction of query tokens present in a normalized verse text, in [0, 1].
export function keywordOverlap(queryTokens, normalizedText) {
  if (queryTokens.length === 0) return 0;
  let hits = 0;
  for (const t of queryTokens) if (normalizedText.includes(t)) hits++;
  return hits / queryTokens.length;
}

// Hybrid ranking over an INT8 vector store.
//   vectors: Int8Array of passageCount * dim (row-major, aligned with `texts`)
//   texts:   string[] of normalized verse texts (same order as vectors)
//   queryVec: Float32Array (L2-normalized, dim)
// Returns [{ index, score, semantic, keyword }] sorted by score desc, index asc.
export function rankPassages({
  queryVec,
  vectors,
  scale,
  zeroPoint = 0,
  dim = EMBEDDING_DIM,
  texts,
  queryTokens,
  semanticWeight = 1,
  keywordWeight = 0.4,
  threshold = 0.12,
  exclude = new Set(),
}) {
  const results = [];
  const count = vectors.length / dim;
  const row = new Float32Array(dim);
  for (let i = 0; i < count; i++) {
    if (exclude.has(i)) continue;
    const start = i * dim;
    let dot = 0;
    let nr = 0;
    for (let j = 0; j < dim; j++) {
      const v = (vectors[start + j] - zeroPoint) * scale;
      row[j] = v;
      dot += queryVec[j] * v;
      nr += v * v;
    }
    const semantic = nr > 0 ? dot / Math.sqrt(nr) : 0;
    const keyword = keywordOverlap(queryTokens, texts[i]);
    const score = semanticWeight * semantic + keywordWeight * keyword;
    if (score < threshold) continue;
    results.push({ index: i, score, semantic, keyword });
  }
  results.sort((a, b) => b.score - a.score || a.index - b.index);
  return results;
}

// Rule-based keyword fallback (no vectors/model): rank by the fraction of query
// tokens present in each verse. Returns the same shape as rankPassages so
// callers can switch between them transparently. Used when the embedding model
// or WASM runtime fails to load.
export function rankKeywordOnly({ texts, queryTokens, threshold = 0.5, exclude = new Set() }) {
  const results = [];
  for (let i = 0; i < texts.length; i++) {
    if (exclude.has(i)) continue;
    const keyword = keywordOverlap(queryTokens, texts[i]);
    if (keyword < threshold) continue;
    results.push({ index: i, score: keyword, semantic: 0, keyword });
  }
  results.sort((a, b) => b.score - a.score || a.index - b.index);
  return results;
}

// Classifies a match for the template-based relevance explanation (never an
// AI-generated sentence, never a percentage). Returns 'mixed' | 'keywords' |
// 'theme', mapped to a UI string by the caller.
export function explainMatch({ semantic = 0, keyword = 0 }) {
  if (keyword > 0 && semantic > 0.15) return 'mixed';
  if (keyword > 0) return 'keywords';
  return 'theme';
}
