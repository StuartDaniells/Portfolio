import { loadEnv } from "vite";

/**
 * Single source of truth for build-time content selection.
 *
 * Shared by `vite.config.js` and `scripts/build.mjs` so the mode, the registry
 * and the output directory can never disagree.
 */

/** The one flag that decides what a build contains. Edit `.env.production`. */
export const CONTENT_MODE_VAR = "PORTFOLIO_CONTENT_MODE";

/** Supported values. Anything else aborts the build. */
export const CONTENT_MODES = ["public", "internal"];

/**
 * Registry modules. `public` must never import `./internal/*`, which is what
 * makes internal-only content absent from the public bundle rather than merely
 * hidden at runtime.
 */
export const REGISTRY_PATHS = {
  public: "src/content/caseStudies/registry.public.ts",
  internal: "src/content/caseStudies/registry.internal.ts",
};

/** Public output is deployable; the internal one is not. */
export const outDirFor = (contentMode) =>
  contentMode === "internal" ? "build-internal" : "build";

/**
 * Resolves the content mode.
 *
 * - `npm run dev` (serve, not preview) -> "internal", so every section shows.
 * - any build / preview -> the `.env.production` flag.
 * - flag missing -> "public" (fail closed).
 * - flag unrecognised -> throw.
 */
export const resolveContentMode = ({
  command,
  mode,
  isPreview = false,
  root = process.cwd(),
  expected,
}) => {
  let contentMode;

  if (command === "serve" && !isPreview) {
    contentMode = "internal";
  } else {
    const env = loadEnv(mode, root, "");
    const raw = String(env[CONTENT_MODE_VAR] ?? "").trim().toLowerCase();

    if (raw === "") {
      // A production build without the flag must never ship internal content.
      contentMode = "public";
    } else if (CONTENT_MODES.includes(raw)) {
      contentMode = raw;
    } else {
      throw new Error(
        `Unrecognised ${CONTENT_MODE_VAR}="${env[CONTENT_MODE_VAR]}". ` +
          `Set ${CONTENT_MODE_VAR}=public or ${CONTENT_MODE_VAR}=internal in .env.production.`
      );
    }
  }

  if (expected && contentMode !== expected) {
    throw new Error(
      `${CONTENT_MODE_VAR} is "${contentMode}" in .env.production, but this command expects "${expected}". ` +
        `Edit .env.production and set ${CONTENT_MODE_VAR}=${expected}, then run the command again.`
    );
  }

  return contentMode;
};
