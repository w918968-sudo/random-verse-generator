// Client-side translation helpers — shared by the generator, search, and
// verse-of-the-day pages so they all read/write the same preference and fetch
// the matching data files.
export const TRANSLATION_KEY = 'versewell.translation';
export const DEFAULT_TRANSLATION = 'WEBP';

export function currentTranslation() {
  try {
    const v = localStorage.getItem(TRANSLATION_KEY);
    return v === 'KJV' ? 'KJV' : DEFAULT_TRANSLATION;
  } catch {
    return DEFAULT_TRANSLATION;
  }
}

export function dataPaths(id) {
  const kjv = id === 'KJV';
  return {
    verses: kjv ? '/data/verses-kjv.json' : '/data/verses.json',
    chaptersDir: kjv ? '/data/chapters-kjv' : '/data/chapters',
    searchIndex: kjv ? '/data/search-index-kjv.json' : '/data/search-index.json',
    bible: kjv ? '/data/bible-kjv.json' : '/data/bible.json',
    semanticDir: kjv ? '/data/find-a-verse/kjv' : '/data/find-a-verse/webp',
    modelDir: '/data/find-a-verse/model',
  };
}
