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

export const OCCASIONS = [
  { id: 'Anxiety', slug: 'anxiety', desc: 'Verses for anxious and worried hearts.' },
  { id: 'Fear', slug: 'fear', desc: 'Verses about courage and God’s protection.' },
  { id: 'Encouragement', slug: 'encouragement', desc: 'Verses to lift your spirit and renew hope.' },
  { id: 'Healing', slug: 'healing', desc: 'Verses about God’s healing for body and soul.' },
  { id: 'Forgiveness', slug: 'forgiveness', desc: 'Verses about God’s mercy and forgiving others.' },
  { id: 'Patience', slug: 'patience', desc: 'Verses about patience and waiting on God.' },
  { id: 'New Beginnings', slug: 'new-beginnings', desc: 'Verses for fresh starts and second chances.' },
  { id: 'Grief', slug: 'grief', desc: 'Verses of comfort for those who mourn.' },
  { id: 'Money', slug: 'money', desc: 'Verses about money, contentment, and generosity.' },
  { id: 'Marriage', slug: 'marriage', desc: 'Verses about love, marriage, and commitment.' },
  { id: 'Birthday', slug: 'birthday', desc: 'Verses to celebrate life and God’s blessings.' },
  { id: 'Work', slug: 'work', desc: 'Verses about work, diligence, and purpose.' },
  { id: 'Friendship', slug: 'friendship', desc: 'Verses about friendship and true companions.' },
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
  nav: { navLabel: 'Primary', verseOfTheDay: 'Verse of the Day', psalmOfTheDay: 'Psalm of the Day', psalms: 'Psalms', top100: 'Top 100', versesByBook: 'Verses by Book', readingPlans: 'Reading Plans', findAVerse: 'Find a Verse', search: 'Search', about: 'About', privacy: 'Privacy Policy', contact: 'Contact' },
  brand: 'VerseWell',
  install: 'Install App',
  h1: 'Random Bible Verse Generator',
  intro:
    'Generate a random Bible verse, or choose a topic to get a verse on that theme. Every verse is available in the World English Bible (Protestant Edition) and the King James Version.',
  themeGroupLabel: 'Choose one or more topics',
  occasionGroupLabel: 'Occasions',
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
  readingPlan: {
    prev: 'Previous',
    next: 'Next',
    complete: 'Mark Day Complete',
    completed: 'Plan complete — you’ve read every day of this plan.',
    restart: 'Restart Plan',
    dayOf: (n, m) => `Day ${n} of ${m}`,
  },
  findAVerse: {
    title: 'Find a Verse',
    lede:
      'Describe what you are looking for in your own words — a feeling, a situation, or a question — and get a matching verse. Everything runs privately in your browser.',
    placeholder: 'Describe what you’re looking for…',
    submit: 'Find a Verse',
    cancel: 'Cancel',
    examplesLabel: 'Try an example:',
    status: {
      loadingIndex: 'Loading the Bible index…',
      loadingModel: 'Preparing semantic search…',
      finding: 'Finding a relevant verse…',
      ready: 'Describe what you’re looking for, then press “Find a Verse”.',
    },
    noResults:
      'No verse closely matched that. Try rewording, or browse the whole Bible with search instead.',
    searchLink: 'Search the Bible',
    keywordMode:
      'Semantic search is unavailable on this device, so results use basic keyword matching instead.',
    error: 'Something went wrong. Please try again.',
    result: {
      label: 'Most relevant verse',
      copy: 'Copy Verse',
      copied: 'Copied!',
      save: 'Save Verse',
      saved: 'Saved',
      context: 'Read Context',
      fullChapter: 'Read Full Chapter',
      collapseChapter: 'Collapse Chapter',
      another: 'Generate Another Relevant Verse',
      noMore: 'No more relevant verses for this description. Try a new one.',
      copyFallback: 'Copying failed. Please select the verse text and copy it manually.',
    },
    explain: {
      mixed: 'This verse closely matches both the wording and the theme of your description.',
      keywords: 'This verse uses wording close to your description.',
      theme: 'This verse shares a theme with what you described.',
    },
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
