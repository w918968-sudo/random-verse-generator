// Generates public/og-image.png (1200x630) used as the social share card.
// Design: warm-paper background, centered layout, gold underline.
// Run: node scripts/generate-og-image.mjs  (or npm run og:image)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-image.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F3EA"/>
  <g transform="translate(536 84) scale(2)">
    <path d="M32 19c-4.2-3-9.4-4.2-14.5-3.2V42c5.1-1 10.3 0.2 14.5 3.2 4.2-3 9.4-4.2 14.5-3.2V15.8C41.4 14.8 36.2 16 32 19z" fill="#8C4A2F"/>
    <path d="M32 19v26.2" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M32 3c2 3 4 5 7 6.5c-3 1.5-5 3.5-7 6.5c-2-3-4-5-7-6.5c3-1.5 5-3.5 7-6.5z" fill="#C9A227"/>
  </g>
  <text x="600" y="312" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="80" font-weight="700" letter-spacing="6" fill="#C9A227">VerseWell</text>
  <text x="600" y="386" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="42" fill="#2B2620">Random Bible Verse Generator</text>
  <text x="600" y="440" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#6B6355">Free Bible verses by topic — hope, peace, love &amp; more</text>
  <line x1="470" y1="468" x2="730" y2="468" stroke="#C9A227" stroke-width="3"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
