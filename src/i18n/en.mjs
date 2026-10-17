// English UI strings — centralized so a future language can be added without
// touching components. Verse text itself is modeled separately (in the data).

export const THEMES = [
  { id: 'Hope', desc: 'Verses of hope and future promise.' },
  { id: 'Peace', desc: 'Verses about peace, calm, and resting in God.' },
  { id: 'Love', desc: 'Verses about God’s love and loving one another.' },
  { id: 'Strength', desc: 'Verses for courage and inner strength.' },
  { id: 'Faith', desc: 'Verses about trusting and believing God.' },
  { id: 'Comfort', desc: 'Verses of comfort in hard times.' },
  { id: 'Wisdom', desc: 'Verses about wisdom and understanding.' },
  { id: 'Gratitude', desc: 'Verses about thanksgiving and praise.' },
];

export const faq = [
  {
    q: 'Is this random Bible verse generator free?',
    a: 'Yes. It is completely free, with no sign-up and no account required. The whole tool runs in your browser.',
  },
  {
    q: 'Which Bible translations are used?',
    a: 'The World English Bible (Protestant Edition) (WEBP) is the default, and the King James Version (KJV) is also available. Both are in the public domain.',
  },
  {
    q: 'Can I choose a specific topic?',
    a: 'Yes — choose from hope, peace, love, strength, faith, comfort, wisdom, or gratitude, or leave it on “All Verses” for a completely random pick.',
  },
  {
    q: 'Can I read more of the passage?',
    a: 'Yes. After a verse appears, use Read Context to see a few verses around it, or Read Full Chapter to open the whole chapter.',
  },
];

export const ui = {
  siteName: 'Random Bible Verse Generator',
  metaDescription:
    'Generate a random Bible verse, or pick a topic like hope, peace, love, strength, faith, comfort, wisdom, or gratitude. Free, from the World English Bible.',
  nav: { verseOfTheDay: 'Verse of the Day', search: 'Search', about: 'About', privacy: 'Privacy Policy', contact: 'Contact' },
  brand: 'VerseWell',
  install: 'Install App',
  h1: 'Random Bible Verse Generator',
  intro:
    'Generate a random Bible verse, or choose a topic to get a verse on that theme. Every verse is available in the World English Bible (Protestant Edition) and the King James Version.',
  themeGroupLabel: 'Choose one or more topics',
  translationLabel: 'Translation',
  allVerses: 'All Verses',
  sourceLabel: 'Verse Source',
  sourceCurated: 'Curated Verses',
  sourceCuratedFull: (n) => `Curated Verses — ${n} carefully selected verses`,
  sourceWholeBible: 'Whole Bible',
  topicSelected: (n) => `${n} topics selected`,
  topicDone: 'Done',
  topicClear: 'Clear all',
  topicWholeBibleNote: 'Topic filtering is available for curated verses only.',
  generate: { first: 'Generate Verse', again: 'Generate Another Verse' },
  history: 'History',
  historyTitle: 'Recent Verses',
  favorites: 'Favorites',
  favoritesTitle: 'Saved Verses',
  favorite: 'Save Verse',
  favoriteSaved: 'Saved',
  favoritesEmpty: 'No saved verses yet. Press “Save Verse” on a verse to keep it here.',
  favoriteRemove: 'Remove',
  guide:
    'A verse will appear here automatically. Choose a topic and press “Generate Another Verse” for a new one.',
  search: {
    title: 'Search the Bible',
    lede: 'Search the Bible, or browse by book and chapter. Your selected translation is used for the results.',
    placeholder: 'Search verses…',
    submit: 'Search',
    browseTitle: 'Browse by book',
    close: 'Close',
    count: (n) => `${n} result${n === 1 ? '' : 's'}`,
    capped: 'Showing the first 25 matches — try a more specific search.',
    noResults: 'No verses matched your search. Try a different word.',
    loading: 'Loading the search index…',
    loadError: 'Could not load the search index. Please try again.',
    chapterError: 'Could not load that chapter. Please try again.',
  },
  result: {
    copy: 'Copy Verse',
    copied: 'Copied!',
    share: 'Share',
    shareCopied: 'Link copied!',
    image: 'Save Image',
    readAloud: 'Read Aloud',
    stopReading: 'Stop',
    context: 'Read Context',
    fullChapter: 'Read Full Chapter',
    collapseChapter: 'Collapse Chapter',
    contextTitle: 'Context',
    chapterTitle: (book, chapter) => `${book} ${chapter}`,
    copyFallback: 'Copying failed. Please select the verse text and copy it manually.',
    ariaTheme: 'Theme',
    ariaRef: 'Reference',
  },
  errors: {
    themeUnavailable:
      'This topic has no verses available right now. Try “All Verses” or another topic.',
    chapterLoad: 'Could not load the full chapter. Please try again.',
    shareFailed: 'Could not share or copy the link. Please copy the URL from your browser.',
    imageFailed: 'Could not create the verse image. Please try again.',
    retry: 'Retry',
  },
};
