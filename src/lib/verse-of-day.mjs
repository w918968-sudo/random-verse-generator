// Deterministic "verse of the day" helpers. Shared by the page's build-time
// rendering and its client-side refresh so both always pick the same verse.

// FNV-1a 32-bit hash — stable across Node (build) and browsers (runtime).
export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// UTC calendar date (YYYY-MM-DD) so the daily verse rolls over at midnight UTC,
// the same moment for every visitor worldwide.
export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export function verseForDate(dateStr, verses) {
  if (!verses || !verses.length) return null;
  return verses[hashString(dateStr) % verses.length];
}

export function reference(v) {
  const range = v.startVerse === v.endVerse ? String(v.startVerse) : `${v.startVerse}–${v.endVerse}`;
  return `${v.bookName} ${v.chapter}:${range}`;
}
