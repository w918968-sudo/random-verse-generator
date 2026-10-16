// Generates public/og-image.png (1200x630) used as the social share card.
// Run: node scripts/generate-og-image.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-image.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#8C4A2F"/>
  <rect x="20" y="20" width="1160" height="590" rx="22" fill="none" stroke="#C9A227" stroke-opacity="0.55" stroke-width="3"/>
  <g transform="translate(80 64) scale(2.4)">
    <path d="M32 19c-4.2-3-9.4-4.2-14.5-3.2V42c5.1-1 10.3 0.2 14.5 3.2 4.2-3 9.4-4.2 14.5-3.2V15.8C41.4 14.8 36.2 16 32 19z" fill="#FFFDF7"/>
    <path d="M32 19v26.2" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M32 3c2 3 4 5 7 6.5c-3 1.5-5 3.5-7 6.5c-2-3-4-5-7-6.5c3-1.5 5-3.5 7-6.5z" fill="#C9A227"/>
  </g>
  <text x="80" y="340" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="700" letter-spacing="8" fill="#C9A227">VerseWell</text>
  <text x="80" y="416" font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="#FFFDF7">Random Bible Verse Generator</text>
  <text x="80" y="482" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#F1E5C9">Free Bible verses by topic — hope, peace, love &amp; more</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
