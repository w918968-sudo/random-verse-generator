// Regenerates public/sitemap.xml from the data files so every indexable page —
// including the per-verse detail pages — is listed. Hooked into the build script
// so it runs before `astro build` and the fresh sitemap is copied into dist/.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '../src/config.mjs';
import { THEMES, OCCASIONS } from '../src/i18n/en.mjs';
import { READING_PLANS } from '../src/data/reading-plans.mjs';

const LAST_MOD = '2026-10-23';
const root = process.cwd();
const verses = JSON.parse(readFileSync(join(root, 'public', 'data', 'verses.json'), 'utf8'));

const urls = [];
function add(loc, { changefreq = 'monthly', priority = '0.5', lastmod = LAST_MOD } = {}) {
  urls.push({ loc: `${SITE_URL}${loc}`, lastmod, changefreq, priority });
}

// Static / feature pages
add('/', { changefreq: 'monthly', priority: '1.0', lastmod: '2026-10-16' });
add('/verse-of-the-day/', { changefreq: 'daily', priority: '0.7', lastmod: '2026-10-17' });
add('/psalm-of-the-day/', { changefreq: 'daily', priority: '0.7' });
add('/psalms/', { changefreq: 'weekly', priority: '0.6' });
add('/top-100/', { changefreq: 'weekly', priority: '0.6' });
add('/verses-by-book/', { changefreq: 'weekly', priority: '0.6' });
add('/reading-plans/', { changefreq: 'weekly', priority: '0.6' });
add('/find-a-verse/', { changefreq: 'monthly', priority: '0.5', lastmod: '2026-10-18' });
add('/search/', { changefreq: 'monthly', priority: '0.5', lastmod: '2026-10-17' });
add('/about/', { changefreq: 'monthly', priority: '0.3' });
add('/contact/', { changefreq: 'monthly', priority: '0.3' });
add('/privacy/', { changefreq: 'monthly', priority: '0.3' });

// Topic landing pages (themes + occasions)
for (const t of THEMES) add(`/${t.id.toLowerCase()}/`, { changefreq: 'weekly', priority: '0.6' });
for (const o of OCCASIONS) add(`/${o.slug}/`, { changefreq: 'weekly', priority: '0.6' });

// Reading plan pages
for (const p of READING_PLANS) add(`/reading-plan/${p.slug}/`, { changefreq: 'weekly', priority: '0.5' });

// Per-verse detail pages
for (const v of verses) add(`/verses/${v.id}/`, { changefreq: 'monthly', priority: '0.4' });

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
console.log(`Wrote sitemap.xml with ${urls.length} URLs.`);
