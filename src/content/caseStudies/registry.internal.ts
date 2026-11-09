import type { CaseStudyBlock, InternalSectionGroup } from "./types";
import { makeRegistry, mergeInternalSections } from "./types";
import { body as fangtooth01 } from "./fangtooth-01";
import { body as fangtooth02 } from "./fangtooth-02";
import { body as fangtooth03 } from "./fangtooth-03";
import { body as fangtooth04 } from "./fangtooth-04";
import { internalSections as fangtooth01Internal } from "./internal/fangtooth-01.internal";
import { internalSections as fangtooth02Internal } from "./internal/fangtooth-02.internal";
import { internalSections as fangtooth03Internal } from "./internal/fangtooth-03.internal";
import { internalSections as fangtooth04Internal } from "./internal/fangtooth-04.internal";
import { body as alumapower01 } from "./alumapower-01";
import { body as alumapower02 } from "./alumapower-02";
import { body as alumapower03 } from "./alumapower-03";
import { body as alumapower04 } from "./alumapower-04";
import { internalSections as alumapower01Internal } from "./internal/alumapower-01.internal";
import { internalSections as alumapower02Internal } from "./internal/alumapower-02.internal";
import { internalSections as alumapower03Internal } from "./internal/alumapower-03.internal";
import { internalSections as alumapower04Internal } from "./internal/alumapower-04.internal";

/**
 * Internal case-study registry.
 *
 * Resolved for `npm run dev` and for `PORTFOLIO_CONTENT_MODE=internal` builds.
 * It is the only module allowed to import `./internal/*`; the public build
 * resolves `@case-study-bodies` to `registry.public.ts` instead, so this
 * module is never reachable and its content never reaches `build/`.
 *
 * Section numbering is not stored here: it is recomputed at render time from
 * whichever sections survive (`outline.ts`), which is why moving a section
 * between public and internal never requires renumbering anything by hand.
 */
const withInternal = (
  blocks: CaseStudyBlock[],
  groups: InternalSectionGroup[]
): CaseStudyBlock[] => mergeInternalSections(blocks, groups);

export const { caseStudyBodies, getCaseStudyBody } = makeRegistry({
  "hybrid-excel-architecture": withInternal(fangtooth01, fangtooth01Internal),
  "configuration-driven-analytics": withInternal(fangtooth02, fangtooth02Internal),
  "serverless-cloud-gateway": withInternal(fangtooth03, fangtooth03Internal),
  "llm-orchestration-rag": withInternal(fangtooth04, fangtooth04Internal),
  "ops-vista-2-industrial-iot": withInternal(alumapower01, alumapower01Internal),
  "experiment-analysis-automation": withInternal(alumapower02, alumapower02Internal),
  "data-infrastructure-modernization": withInternal(alumapower03, alumapower03Internal),
  "enterprise-workflow-applications": withInternal(alumapower04, alumapower04Internal),
});
