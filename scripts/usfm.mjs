// usfm.mjs — minimal USFM extractor for eBible.org WEBP source files.
// Produces { chapter: [ { number, text } ] } with inline markup stripped and
// poetry/paragraph line breaks preserved as "\n".

const LINE_BREAK = new Set([
  'p', 'pc', 'pr', 'pi', 'pi1', 'pi2', 'pi3', 'pm', 'pmc', 'pmr', 'po',
  'q', 'q1', 'q2', 'q3', 'q4', 'qc', 'qr', 'qm', 'qm1', 'qm2', 'qm3',
  'm', 'm1', 'm2', 'm3', 'mi', 'nb', 'b',
  'li', 'li1', 'li2', 'li3', 'li4', 'lim', 'lim1',
  'ph', 'ph1', 'ph2', 'ph3', 'cls', 'lit', 'sp',
]);

const SKIP = new Set([
  'id', 'ide', 'usfm', 'h', 'h1', 'h2', 'h3',
  'toc1', 'toc2', 'toc3', 'toca1', 'toca2', 'toca3',
  'mt', 'mt1', 'mt2', 'mt3', 'mt4', 'mt5', 'imt', 'imt1', 'imt2', 'imt3', 'imte', 'imte1', 'imte2',
  'is', 'is1', 'is2', 'ip', 'ipi', 'im', 'imi', 'ipq', 'imq', 'iq', 'iq1', 'iq2', 'ib', 'ili', 'ili1', 'ili2', 'ie',
  'd', 'sd', 'sd1', 'sd2', 's', 's1', 's2', 's3', 's4', 'sr', 'r', 'rq',
  'ms', 'ms1', 'ms2', 'ms3', 'mr',
  'rem', 'sts', 'restore', 'pb', 'esb', 'cat', 'fig', 'ndx', 'periph',
  'cp', 'ca', 'cl', 'cd', 'va', 'vp', 'k', 'k1', 'ord',
]);

function removeNotes(text) {
  return text
    .replace(/^﻿/, '')
    .replace(/\\f[ +].*?\\f\*/gs, '')
    .replace(/\\x[ -].*?\\x\*/gs, '');
}

function cleanSegment(seg) {
  return seg
    .replace(/\|[a-z0-9-]+="[^"]*"/g, '')   // Strong's / lemma attributes
    .replace(/\\\+?[a-z0-9]+\*/g, '')        // close markers: \w* \add* \nd* \qs* ...
    .replace(/\\\+?[a-z0-9]+ /g, '')         // open markers + their trailing space: \w \add ...
    .replace(/\\\+?[a-z0-9]+/g, '')          // any leftover bare marker
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function leadingMarker(line) {
  const m = line.match(/^\s*\\([a-z0-9]+)/i);
  return m ? m[1].toLowerCase() : null;
}

export function parseBook(text) {
  text = removeNotes(text);
  const chapters = new Map();
  let curChapter = null;
  let curVerse = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    const marker = leadingMarker(line);

    if (marker === 'c') {
      const n = Number(line.match(/\\c\s+(\d+)/)?.[1]);
      if (Number.isInteger(n) && n > 0) {
        curChapter = n;
        curVerse = null;
        if (!chapters.has(n)) chapters.set(n, []);
      }
      continue;
    }

    if (marker === 'v') {
      const m = line.match(/^\s*\\v\s+(\d+)\s*(.*)$/);
      if (!m || !curChapter) continue;
      curVerse = { number: Number(m[1]), text: cleanSegment(m[2]) };
      chapters.get(curChapter).push(curVerse);
      continue;
    }

    if (marker === null) {
      const seg = cleanSegment(line);
      if (seg && curVerse) curVerse.text = curVerse.text ? curVerse.text + '\n' + seg : seg;
      continue;
    }

    if (LINE_BREAK.has(marker)) {
      const rest = line.replace(/^\s*\\[a-z0-9]+/, '').trim();
      const seg = cleanSegment(rest);
      if (seg && curVerse) curVerse.text = curVerse.text ? curVerse.text + '\n' + seg : seg;
      continue;
    }

    if (SKIP.has(marker)) continue;

    // Unknown block marker: keep any trailing text as a continuation (defensive).
    const rest = line.replace(/^\s*\\[a-z0-9]+\*?/, '').trim();
    const seg = cleanSegment(rest);
    if (seg && curVerse) curVerse.text = curVerse.text ? curVerse.text + '\n' + seg : seg;
  }

  const out = {};
  for (const [chapter, verses] of chapters) {
    if (verses.length) out[chapter] = verses;
  }
  return out;
}

export function extractRange(chapterVerses, startVerse, endVerse) {
  const texts = [];
  for (let v = startVerse; v <= endVerse; v++) {
    const found = chapterVerses.find((x) => x.number === v);
    if (!found) throw new Error(`missing verse ${v}`);
    texts.push(found.text);
  }
  return texts.join(' ');
}
