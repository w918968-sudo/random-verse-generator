// Unit tests for the minimal USFM parser (scripts/usfm.mjs).
// Fixtures mirror the shape of real eBible.org WEBP source.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBook, extractRange } from '../scripts/usfm.mjs';

test('parses chapters and verses with no inline markup', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 First verse.\n\\v 2 Second verse.');
  assert.deepEqual(Object.keys(out), ['1']);
  assert.equal(out[1].length, 2);
  assert.equal(out[1][0].number, 1);
  assert.equal(out[1][0].text, 'First verse.');
  assert.equal(out[1][1].text, 'Second verse.');
});

test('removes footnotes (\\f ... \\f*) before parsing', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 Hello \\f + \\fr 1:1 \\ft a note\\f* world.');
  assert.equal(out[1][0].text, 'Hello world.');
});

test('removes cross-references (\\x ... \\x*) before parsing', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 See \\x - \\xo 1:1 \\xt ref text\\x* the passage.');
  assert.equal(out[1][0].text, 'See the passage.');
});

test('strips Strong’s / lemma attributes', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 In the beginning |strong="H07225" was the Word.');
  assert.equal(out[1][0].text, 'In the beginning was the Word.');
});

test('strips character-level markers like \\w ... \\w*', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 Jesus said \\w truly\\w* I say.');
  assert.equal(out[1][0].text, 'Jesus said truly I say.');
});

test('preserves poetry/paragraph line breaks as "\\n"', () => {
  const out = parseBook('\\c 1\n\\q\n\\v 1 The Lord is my shepherd;\n\\q I shall not want.');
  assert.equal(out[1][0].text, 'The Lord is my shepherd;\nI shall not want.');
});

test('continues a verse across a markerless line', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 The beginning of the verse\nand its continuation.');
  assert.equal(out[1][0].text, 'The beginning of the verse\nand its continuation.');
});

test('keeps trailing text on an unknown block marker (defensive)', () => {
  const out = parseBook('\\c 1\n\\p\n\\v 1 Text one.\n\\zzz something else');
  assert.equal(out[1][0].text, 'Text one.\nsomething else');
});

test('skips headings and titles (SKIP markers)', () => {
  const out = parseBook('\\id GEN\n\\h Genesis\n\\c 1\n\\p\n\\v 1 In the beginning.');
  assert.deepEqual(Object.keys(out), ['1']);
  assert.equal(out[1][0].text, 'In the beginning.');
});

test('ignores non-positive chapter numbers', () => {
  const out = parseBook('\\c 0\n\\v 1 Not a real chapter.\n\\c 1\n\\v 1 Real chapter.');
  assert.deepEqual(Object.keys(out), ['1']);
});

test('extractRange joins verses with a single space', () => {
  const chapter = [
    { number: 1, text: 'One.' },
    { number: 2, text: 'Two.' },
    { number: 3, text: 'Three.' },
  ];
  assert.equal(extractRange(chapter, 1, 3), 'One. Two. Three.');
  assert.equal(extractRange(chapter, 2, 2), 'Two.');
});

test('extractRange throws on a missing verse', () => {
  const chapter = [{ number: 1, text: 'One.' }];
  assert.throws(() => extractRange(chapter, 1, 2), /missing verse 2/);
});
