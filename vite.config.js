import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  CONTENT_MODE_VAR,
  REGISTRY_PATHS,
  outDirFor,
  resolveContentMode,
} from "./scripts/content-mode.mjs";

const projectRoot =
  typeof __dirname === "string" ? __dirname : process.cwd();

/**
 * Matches any module inside `src/content/caseStudies/internal/`.
 * Those modules are imported only by `registry.internal.ts`.
 */
const INTERNAL_CONTENT_MODULE =
  /[\\/]content[\\/]caseStudies[\\/]internal[\\/]/;

const internalContentError = (id) =>
  `Internal-only case-study content ("${id}") was pulled into a public build. ` +
  `Public builds resolve @case-study-bodies to ${REGISTRY_PATHS.public}, which must never import ` +
  `src/content/caseStudies/internal/*. Set ${CONTENT_MODE_VAR}=internal in .env.production if you need a full build.`;

/**
 * Defence in depth. The alias below is what keeps internal-only content out of
 * the public bundle, but a stray direct import would silently defeat it, so a
 * public build fails loudly instead.
 */
const guardInternalContent = () => ({
  name: "case-study-guard-internal-content",
  apply: "build",
  enforce: "pre",
  resolveId(source) {
    if (INTERNAL_CONTENT_MODULE.test(source)) {
      this.error(internalContentError(source));
    }
    return null;
  },
  transform(_code, id) {
    if (INTERNAL_CONTENT_MODULE.test(id)) {
      this.error(internalContentError(id));
    }
    return null;
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  // Build-time content selection. `npm run dev` resolves to "internal";
  // everything else reads PORTFOLIO_CONTENT_MODE from .env.production and
  // fails closed to "public" when it is missing.
  const contentMode = resolveContentMode({ command, mode, isPreview });

  return {
    plugins: [
      react({
        // Ensure Babel transforms JS and TS/TSX files containing JSX
        include: /\.(js|jsx|ts|tsx)$/,
      }),
      ...(command === "build" && contentMode === "public"
        ? [guardInternalContent()]
        : []),
    ],
    resolve: {
      alias: [
        {
          // This alias is the whole mechanism: pages import
          // `@case-study-bodies`, and the selected registry alone decides
          // whether internal-only modules are part of the module graph. The
          // unselected registry is never imported, so Rollup never sees it.
          find: /^@case-study-bodies$/,
          replacement: path.resolve(projectRoot, REGISTRY_PATHS[contentMode]),
        },
      ],
    },
    esbuild: {
      loader: "tsx",
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      // Public output stays in build/ (the deployable directory). The private
      // build goes to build-internal/, which is git-ignored and never deployed.
      outDir: outDirFor(contentMode),
      // Clear the previous output so stale files from an earlier mode can
      // never be served alongside a fresh build.
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
