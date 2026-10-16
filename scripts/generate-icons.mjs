// Generates public/icons/*.png PWA/app icons from public/favicon.svg.
// Run: node scripts/generate-icons.mjs  (or npm run icons)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const faviconSvg = join(__dirname, '..', 'public', 'favicon.svg');
const outDir = join(__dirname, '..', 'public', 'icons');

mkdirSync(outDir, { recursive: true });

// Plain icons: keep the favicon's rounded corners (transparent).
for (const size of [192, 512]) {
  await sharp(faviconSvg).resize(size, size).png().toFile(join(outDir, `icon-${size}.png`));
}

// Full-bleed icon: solid brand square with the mark centered within the safe zone.
// Used for maskable (Android) and apple-touch-icon (iOS rounds corners itself).
async function fullBleed(size, filename) {
  const mark = await sharp(faviconSvg).resize(Math.round(size * 0.62), Math.round(size * 0.62)).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: '#8C4A2F' },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(join(outDir, filename));
}

await fullBleed(512, 'icon-maskable-512.png');
await fullBleed(180, 'apple-touch-icon.png');

console.log('Wrote', outDir);
