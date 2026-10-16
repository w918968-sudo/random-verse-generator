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
    q: 'Which Bible translation is used?',
    a: 'The World English Bible (Protestant Edition) (WEBP), a public-domain English translation published by eBible.org.',
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
  nav: { about: 'About', privacy: 'Privacy Policy', contact: 'Contact' },
  brand: 'VerseWell',
  h1: 'Random Bible Verse Generator',
  intro:
    'Generate a random Bible verse, or choose a topic to get a verse on that theme. Every verse comes from the World English Bible (Protestant Edition).',
  themeGroupLabel: 'Choose a topic',
  allVerses: 'All Verses',
  generate: { first: 'Generate Verse', again: 'Generate Another Verse' },
  guide:
    'Choose a topic and press “Generate Verse” — or just press it for any verse. Your verse will appear here.',
  result: {
    copy: 'Copy Verse',
    copied: 'Copied!',
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
    retry: 'Retry',
  },
};
