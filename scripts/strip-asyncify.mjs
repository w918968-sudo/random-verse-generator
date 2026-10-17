// Removes the oversized onnxruntime "asyncify" WASM fallback from the build.
// The site serves cross-origin isolation headers (public/_headers), so the
// browser uses the smaller threaded WASM (public/data/find-a-verse/wasm/) and
// never loads the asyncify variant — which at ~25.6 MiB exceeds Cloudflare
// Workers' 25 MiB per-asset limit and would otherwise block `wrangler deploy`.
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'dist', '_astro');
let removed = 0;
for (const name of readdirSync(dir)) {
  if (name.includes('asyncify')) {
    rmSync(join(dir, name), { force: true });
    removed++;
  }
}
if (removed > 0) console.log(`Stripped ${removed} asyncify WASM file(s) from dist/_astro.`);
