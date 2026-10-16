// Site configuration — single source of truth for deployment values.
// TODO (before launch): fill in the empty values below. The site still works
// while they are empty (GA4 and Search Console stay off; Contact shows a notice).

export const SITE_NAME = 'Random Bible Verse Generator';

// Canonical base URL (no trailing slash). Drives canonical, Open Graph, sitemap.
export const SITE_URL = 'https://randomversegenerator.info';

// Contact email shown on the Contact page. Leave empty to show a "not configured" notice.
export const CONTACT_EMAIL = '';

// Google Analytics 4 measurement ID. Empty = analytics disabled.
export const GA4_MEASUREMENT_ID = '';

// Google Search Console verification token (content of the google-site-verification meta).
export const SEARCH_CONSOLE_VERIFICATION = '';

export const TRANSLATION = {
  id: 'WEBP',
  name: 'World English Bible (Protestant Edition)',
  sourceUrl: 'https://ebible.org/engwebp/',
  copyrightUrl: 'https://ebible.org/engwebp/copyright.htm',
};
