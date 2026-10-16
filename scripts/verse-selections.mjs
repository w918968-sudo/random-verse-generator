// Curated v1 verse library: reference + themes ONLY.
// Each entry is a 3-5 verse passage (consecutive). The verse text itself is
// extracted from the official WEBP USFM source at build time, so it can never
// drift from the source by hand-typing.

export const THEMES = ['Hope', 'Peace', 'Love', 'Strength', 'Faith', 'Comfort', 'Wisdom', 'Gratitude'];

export const VERSE_SELECTIONS = [
  // Hope
  { bookId: 'JER', chapter: 29, startVerse: 11, endVerse: 13, themes: ['Hope'] },
  { bookId: 'LAM', chapter: 3, startVerse: 22, endVerse: 24, themes: ['Hope'] },
  { bookId: 'ROM', chapter: 8, startVerse: 23, endVerse: 25, themes: ['Hope'] },
  { bookId: 'ISA', chapter: 40, startVerse: 28, endVerse: 31, themes: ['Hope', 'Strength'] },
  { bookId: 'PSA', chapter: 33, startVerse: 18, endVerse: 22, themes: ['Hope'] },
  { bookId: '1PE', chapter: 1, startVerse: 3, endVerse: 5, themes: ['Hope'] },
  { bookId: 'REV', chapter: 21, startVerse: 1, endVerse: 4, themes: ['Hope', 'Comfort'] },
  { bookId: 'ROM', chapter: 8, startVerse: 26, endVerse: 28, themes: ['Hope', 'Comfort'] },

  // Peace
  { bookId: 'PHP', chapter: 4, startVerse: 4, endVerse: 7, themes: ['Peace', 'Gratitude'] },
  { bookId: 'JHN', chapter: 14, startVerse: 25, endVerse: 27, themes: ['Peace'] },
  { bookId: 'PSA', chapter: 46, startVerse: 8, endVerse: 11, themes: ['Peace', 'Strength'] },
  { bookId: 'COL', chapter: 3, startVerse: 15, endVerse: 17, themes: ['Peace', 'Gratitude'] },
  { bookId: 'ROM', chapter: 5, startVerse: 1, endVerse: 5, themes: ['Peace'] },
  { bookId: 'NUM', chapter: 6, startVerse: 24, endVerse: 26, themes: ['Peace'] },
  { bookId: 'MAT', chapter: 11, startVerse: 28, endVerse: 30, themes: ['Peace', 'Comfort'] },
  { bookId: 'JHN', chapter: 16, startVerse: 31, endVerse: 33, themes: ['Peace'] },

  // Love
  { bookId: 'JHN', chapter: 3, startVerse: 16, endVerse: 18, themes: ['Love'] },
  { bookId: '1CO', chapter: 13, startVerse: 4, endVerse: 7, themes: ['Love'] },
  { bookId: 'ROM', chapter: 8, startVerse: 35, endVerse: 39, themes: ['Love'] },
  { bookId: '1JN', chapter: 4, startVerse: 16, endVerse: 19, themes: ['Love'] },
  { bookId: 'EPH', chapter: 3, startVerse: 17, endVerse: 19, themes: ['Love'] },
  { bookId: 'ROM', chapter: 5, startVerse: 6, endVerse: 8, themes: ['Love'] },
  { bookId: 'JHN', chapter: 15, startVerse: 9, endVerse: 13, themes: ['Love'] },
  { bookId: 'DEU', chapter: 6, startVerse: 4, endVerse: 7, themes: ['Love'] },

  // Strength
  { bookId: 'PHP', chapter: 4, startVerse: 11, endVerse: 13, themes: ['Strength'] },
  { bookId: 'ISA', chapter: 41, startVerse: 10, endVerse: 13, themes: ['Strength', 'Comfort'] },
  { bookId: 'PSA', chapter: 18, startVerse: 1, endVerse: 3, themes: ['Strength'] },
  { bookId: 'PSA', chapter: 73, startVerse: 25, endVerse: 28, themes: ['Strength'] },
  { bookId: '2CO', chapter: 12, startVerse: 7, endVerse: 10, themes: ['Strength'] },
  { bookId: 'EPH', chapter: 6, startVerse: 10, endVerse: 13, themes: ['Strength'] },
  { bookId: 'JOS', chapter: 1, startVerse: 7, endVerse: 9, themes: ['Strength'] },
  { bookId: 'PSA', chapter: 27, startVerse: 1, endVerse: 3, themes: ['Faith', 'Strength'] },
  { bookId: 'PSA', chapter: 121, startVerse: 1, endVerse: 4, themes: ['Comfort', 'Strength'] },

  // Faith
  { bookId: 'HEB', chapter: 11, startVerse: 1, endVerse: 3, themes: ['Faith'] },
  { bookId: 'MRK', chapter: 11, startVerse: 22, endVerse: 24, themes: ['Faith'] },
  { bookId: 'ROM', chapter: 10, startVerse: 9, endVerse: 13, themes: ['Faith'] },
  { bookId: 'EPH', chapter: 2, startVerse: 8, endVerse: 10, themes: ['Faith'] },
  { bookId: 'GAL', chapter: 2, startVerse: 19, endVerse: 21, themes: ['Faith'] },
  { bookId: 'JAS', chapter: 1, startVerse: 5, endVerse: 8, themes: ['Faith', 'Wisdom'] },
  { bookId: '1PE', chapter: 1, startVerse: 6, endVerse: 9, themes: ['Faith'] },
  { bookId: 'PSA', chapter: 23, startVerse: 1, endVerse: 4, themes: ['Faith', 'Comfort'] },

  // Comfort
  { bookId: '2CO', chapter: 1, startVerse: 3, endVerse: 5, themes: ['Comfort'] },
  { bookId: 'PSA', chapter: 34, startVerse: 17, endVerse: 19, themes: ['Comfort'] },
  { bookId: 'PSA', chapter: 147, startVerse: 1, endVerse: 3, themes: ['Comfort'] },
  { bookId: 'JHN', chapter: 14, startVerse: 1, endVerse: 3, themes: ['Comfort'] },
  { bookId: 'MAT', chapter: 5, startVerse: 3, endVerse: 6, themes: ['Comfort'] },

  // Wisdom
  { bookId: 'PRO', chapter: 3, startVerse: 5, endVerse: 8, themes: ['Wisdom'] },
  { bookId: 'PRO', chapter: 2, startVerse: 6, endVerse: 8, themes: ['Wisdom'] },
  { bookId: 'JAS', chapter: 3, startVerse: 13, endVerse: 17, themes: ['Wisdom'] },
  { bookId: 'PRO', chapter: 1, startVerse: 5, endVerse: 7, themes: ['Wisdom'] },
  { bookId: 'PRO', chapter: 4, startVerse: 5, endVerse: 9, themes: ['Wisdom'] },
  { bookId: 'COL', chapter: 2, startVerse: 2, endVerse: 4, themes: ['Wisdom'] },
  { bookId: 'PSA', chapter: 19, startVerse: 7, endVerse: 9, themes: ['Wisdom'] },

  // Gratitude
  { bookId: '1TH', chapter: 5, startVerse: 16, endVerse: 18, themes: ['Gratitude'] },
  { bookId: 'PSA', chapter: 100, startVerse: 1, endVerse: 5, themes: ['Gratitude'] },
  { bookId: 'PSA', chapter: 107, startVerse: 1, endVerse: 3, themes: ['Gratitude'] },
  { bookId: 'PSA', chapter: 103, startVerse: 1, endVerse: 5, themes: ['Gratitude'] },
  { bookId: 'EPH', chapter: 5, startVerse: 18, endVerse: 20, themes: ['Gratitude'] },
  { bookId: 'PSA', chapter: 95, startVerse: 1, endVerse: 3, themes: ['Gratitude'] },
];
