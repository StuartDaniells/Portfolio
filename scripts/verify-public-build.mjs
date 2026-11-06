import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Strings that exist only inside the internal-only case-study sections.
 * If any of these appears in the public output, the build is not safe to
 * deploy, so the check fails with a non-zero exit code.
 */
const INTERNAL_ONLY_SENTINELS = [
  // 01 - Why this design
  "Performance and responsiveness.",
  // 02 - Dataset Ingestion and Validation
  "Dataset Ingestion and Validation",
  "parquet_validator",
  "excel_file_operations.py",
  // 02 - Configuration-Driven Analytics and SQL Execution
  "Configuration-Driven Analytics and SQL Execution",
  "Acquire per-database execution lock",
  // 03 - Three Integration Workflows
  "Three Integration Workflows",
  "Centralized Tax and FX Reference Data",
  "Session-Gated MSI Distribution",
  "auth/start-prod",
  // 04 - Backend Orchestration & Streaming Lifecycle
  "Backend Orchestration & Streaming Lifecycle",
  "workspace_thread_names",
  "Representative endpoints",
];

/** Public content. Proves the scan actually read the bundle. */
const PUBLIC_CONTROL = "Fangtooth Analytics Inc.";

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".map",
  ".txt",
  ".xml",
  ".svg",
]);

const collectFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }

  return files;
};

/**
 * Scans a public build for internal-only content.
 * Returns true when the output is clean, false otherwise.
 */
export const verifyPublicBuild = async ({
  root = process.cwd(),
  outDir = "build",
} = {}) => {
  const outPath = path.resolve(root, outDir);

  let files;
  try {
    files = await collectFiles(outPath);
  } catch {
    console.error(
      `[verify:public] No build output at ${outPath}. Run "npm run build:public" first.`
    );
    return false;
  }

  const offences = [];
  let controlFound = false;

  for (const file of files) {
    const text = await readFile(file, "utf8");

    if (text.includes(PUBLIC_CONTROL)) controlFound = true;

    for (const sentinel of INTERNAL_ONLY_SENTINELS) {
      if (text.includes(sentinel)) offences.push({ file, sentinel });
    }
  }

  if (!controlFound) {
    console.error(
      `[verify:public] Scanned ${files.length} files but never found the public control string. Refusing to report success.`
    );
    return false;
  }

  if (offences.length > 0) {
    console.error(
      "[verify:public] FAILED - internal-only content found in the public build:"
    );
    for (const { file, sentinel } of offences) {
      console.error(`  ${path.relative(root, file)} -> "${sentinel}"`);
    }
    return false;
  }

  console.log(
    `[verify:public] OK - ${files.length} files scanned in ${outDir}/, no internal-only strings found.`
  );
  return true;
};

const isDirectRun =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const ok = await verifyPublicBuild({ outDir: process.argv[2] ?? "build" });
  process.exit(ok ? 0 : 1);
}
