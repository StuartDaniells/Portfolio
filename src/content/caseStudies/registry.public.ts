import { makeRegistry } from "./types";
import { body as fangtooth01 } from "./fangtooth-01";
import { body as fangtooth02 } from "./fangtooth-02";
import { body as fangtooth03 } from "./fangtooth-03";
import { body as fangtooth04 } from "./fangtooth-04";

/**
 * Public case-study registry.
 *
 * This is the module the public build resolves `@case-study-bodies` to (see
 * `vite.config.js`). It imports only the public bodies, so no internal-only
 * module is ever part of the public module graph and Rollup cannot emit that
 * content into `build/`.
 *
 * Never import `./internal/*` from this file or from any module it reaches.
 */
export const { caseStudyBodies, getCaseStudyBody } = makeRegistry({
  "hybrid-excel-architecture": fangtooth01,
  "configuration-driven-analytics": fangtooth02,
  "serverless-cloud-gateway": fangtooth03,
  "llm-orchestration-rag": fangtooth04,
});
