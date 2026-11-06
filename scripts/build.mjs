import { rm } from "node:fs/promises";
import path from "node:path";
import { build } from "vite";
import { outDirFor, resolveContentMode } from "./content-mode.mjs";
import { verifyPublicBuild } from "./verify-public-build.mjs";

/**
 * Build driver.
 *
 * `npm run build`            - respects PORTFOLIO_CONTENT_MODE in .env.production
 * `npm run build:public`     - asserts the flag is "public"
 * `npm run build:internal`   - asserts the flag is "internal"
 *
 * The flag is never overridden here: `.env.production` stays the single place
 * you edit to change what a build contains.
 */
const expected = process.argv[2];
const root = process.cwd();

let contentMode;
try {
  contentMode = resolveContentMode({
    command: "build",
    mode: "production",
    root,
    expected,
  });
} catch (error) {
  console.error(`\n[portfolio] ${error.message}\n`);
  process.exit(1);
}

const outDir = outDirFor(contentMode);

// Remove previous output for this mode before writing, so a partially failed
// build can never leave stale files behind.
await rm(path.resolve(root, outDir), { recursive: true, force: true });

try {
  await build({ mode: "production" });
} catch (error) {
  console.error(error);
  process.exit(1);
}

if (contentMode === "public") {
  const ok = await verifyPublicBuild({ root, outDir });
  if (!ok) process.exit(1);
}

console.log(`[portfolio] ${contentMode} build written to ${outDir}/`);
