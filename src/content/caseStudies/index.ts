/**
 * Case-study registry entry point.
 *
 * `@case-study-bodies` is resolved by Vite at build time to either
 * `registry.public.ts` (public builds) or `registry.internal.ts` (dev server
 * and internal builds). Re-exporting the alias here keeps the stable
 * `content/caseStudies` import path for pages, while guaranteeing that a
 * public bundle can never reach an internal-only content module.
 *
 * Do not import `./fangtooth-*` or `./internal/*` directly from pages - always
 * go through this module so the build mode decides what exists.
 */
export * from "@case-study-bodies";
