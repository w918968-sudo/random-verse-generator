// Site configuration — single source of truth for deployment values.

export const SITE_NAME = 'Random Bible Verse Generator';

// Canonical base URL (no trailing slash). Drives canonical, Open Graph, sitemap.
export const SITE_URL = 'https://randomversegenerator.info';

// Contact email shown on the Contact page. Leave empty to show a "not configured" notice.
export const CONTACT_EMAIL = 'w918968@gmail.com';

// Google Analytics 4 measurement ID. Empty = analytics disabled.
export const GA4_MEASUREMENT_ID = 'G-VCJZ5PQFNP';

// Google Search Console verification token (content of the google-site-verification meta).
export const SEARCH_CONSOLE_VERIFICATION = 'cmhwEEr-PL8aa7uvmFSpSGyoYLlwyJolHR3-Or5N8hs';

export const TRANSLATIONS = [
  {
    id: 'WEBP',
    name: 'World English Bible (Protestant Edition)',
    sourceUrl: 'https://ebible.org/engwebp/',
    copyrightUrl: 'https://ebible.org/engwebp/copyright.htm',
    short: 'WEBP',
    licenseNote: 'Public domain. “World English Bible” is a trademark of eBible.org.',
  },
  {
    id: 'KJV',
    name: 'King James Version',
    sourceUrl: 'https://ebible.org/eng-kjv2006/',
    copyrightUrl: 'https://ebible.org/eng-kjv2006/copyright.htm',
    short: 'KJV',
    licenseNote: 'Public domain. In the United Kingdom, Crown copyright applies to printed copies only.',
  },
];

// Default translation shown on first visit (also used for footer/SEO copy).
export const TRANSLATION = TRANSLATIONS[0];
