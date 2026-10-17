// Unit tests for the pure semantic-search helpers shared by the Find a Verse
// page (browser) and the offline index/eval tooling (Node). No model, no IO.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  tokenize,
  cosine,
  keywordOverlap,
  quantizeSymmetric,
  rankPassages,
  rankKeywordOnly,
  explainMatch,
} from '../src/lib/semantic-search.mjs';

test('normalizeText lowercases, collapses whitespace, and trims', () => {
  assert.equal(normalizeText('  The   LORD\tIs\nMy Shepherd  '), 'the lord is my shepherd');
  assert.equal(normalizeText(null), '');
  assert.equal(normalizeText(undefined), '');
});

test('tokenize extracts lowercased word tokens, drops punctuation and stopwords', () => {
  assert.deepEqual(tokenize("Do not be afraid!"), ['not', 'afraid']);
  assert.deepEqual(tokenize("  God's    love  "), ['god\'s', 'love']);
  assert.deepEqual(tokenize('the lord is my shepherd'), ['lord', 'shepherd']);
  assert.deepEqual(tokenize(''), []);
});

test('cosine of identical vectors is 1, orthogonal is 0', () => {
  assert.equal(cosine([1, 0, 0], [1, 0, 0]), 1);
  assert.equal(cosine([1, 0], [0, 1]), 0);
  assert.ok(Math.abs(cosine([3, 4], [3, 4]) - 1) < 1e-12);
});

test('cosine handles zero vectors without NaN', () => {
  assert.equal(cosine([0, 0], [1, 0]), 0);
});

test('keywordOverlap is the fraction of query tokens present', () => {
  assert.equal(keywordOverlap(['peace', 'hard'], 'peace in hard times'), 1);
  assert.equal(keywordOverlap(['peace', 'joy'], 'peace in hard times'), 0.5);
  assert.equal(keywordOverlap(['love'], 'the lord is my shepherd'), 0);
  assert.equal(keywordOverlap([], 'anything'), 0);
});

test('quantizeSymmetric round-trips at max magnitude', () => {
  const { scale, int8 } = quantizeSymmetric(new Float32Array([0.5, 0, -0.5]));
  assert.equal(scale, 0.5 / 127);
  assert.deepEqual(Array.from(int8), [127, 0, -127]);
  // Dequantize back to (approximately) the original values.
  for (let i = 0; i < int8.length; i++) {
    assert.ok(Math.abs(int8[i] * scale - [0.5, 0, -0.5][i]) < 1e-9);
  }
});

test('quantizeSymmetric clamps values above/below the range', () => {
  const { scale, int8 } = quantizeSymmetric(new Float32Array([100, -100, 0]));
  assert.equal(scale, 100 / 127);
  assert.deepEqual(Array.from(int8), [127, -127, 0]);
});

test('quantizeSymmetric guards the all-zero input', () => {
  const { scale, int8 } = quantizeSymmetric(new Float32Array([0, 0, 0]));
  assert.equal(scale, 1);
  assert.deepEqual(Array.from(int8), [0, 0, 0]);
});

test('rankPassages dequantizes, scores hybrid, filters by threshold, and dedups', () => {
  // 3 passages × 2 dims, scale 1 so int8 == float (simple).
  const vectors = new Int8Array([
    1, 0, // index 0 — matches query + keyword
    0, 1, // index 1 — orthogonal, no keyword
    1, 1, // index 2 — matches query, no keyword
  ]);
  const texts = ['peace in hard times', 'love your neighbor', 'the lord is my shepherd'];
  const queryVec = new Float32Array([1, 0]);
  const queryTokens = ['peace', 'hard'];

  const ranked = rankPassages({
    queryVec,
    vectors,
    scale: 1,
    zeroPoint: 0,
    dim: 2,
    texts,
    queryTokens,
    semanticWeight: 1,
    keywordWeight: 0.4,
    threshold: 0.1,
  });

  // index0: semantic 1, keyword 1 → 1.4; index2: semantic 0.707, keyword 0 → 0.707;
  // index1: semantic 0, keyword 0 → 0 (below threshold).
  assert.equal(ranked.length, 2);
  assert.deepEqual(ranked.map((r) => r.index), [0, 2]);
  assert.ok(Math.abs(ranked[0].score - 1.4) < 1e-9);
  assert.ok(Math.abs(ranked[1].semantic - 1 / Math.SQRT2) < 1e-9);

  // Dedup: excluding index 0 leaves only index 2.
  const deduped = rankPassages({
    queryVec,
    vectors,
    scale: 1,
    zeroPoint: 0,
    dim: 2,
    texts,
    queryTokens,
    threshold: 0.1,
    exclude: new Set([0]),
  });
  assert.deepEqual(deduped.map((r) => r.index), [2]);
});

test('rankPassages breaks score ties by ascending index (stable order)', () => {
  const vectors = new Int8Array([1, 0, 1, 0]); // index 0 and 1 identical
  const texts = ['a', 'a'];
  const ranked = rankPassages({
    queryVec: new Float32Array([1, 0]),
    vectors,
    scale: 1,
    dim: 2,
    texts,
    queryTokens: [],
    threshold: 0,
  });
  assert.deepEqual(ranked.map((r) => r.index), [0, 1]);
});

test('rankKeywordOnly ranks by keyword overlap and honors exclude', () => {
  const texts = ['the lord is my shepherd', 'give thanks to the lord', 'love your neighbor'];
  const ranked = rankKeywordOnly({ texts, queryTokens: ['give', 'thanks'], threshold: 0.5 });
  assert.deepEqual(ranked.map((r) => r.index), [1]);
  assert.equal(ranked[0].keyword, 1);

  const excluded = rankKeywordOnly({
    texts,
    queryTokens: ['give', 'thanks'],
    threshold: 0.5,
    exclude: new Set([1]),
  });
  assert.deepEqual(excluded, []);
});

test('explainMatch classifies mixed / keywords / theme', () => {
  assert.equal(explainMatch({ semantic: 0.4, keyword: 0.5 }), 'mixed');
  assert.equal(explainMatch({ semantic: 0.1, keyword: 0.8 }), 'keywords');
  assert.equal(explainMatch({ semantic: 0.3, keyword: 0 }), 'theme');
  assert.equal(explainMatch({ semantic: 0, keyword: 0 }), 'theme');
});
