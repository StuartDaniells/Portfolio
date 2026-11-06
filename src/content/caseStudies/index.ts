import type { CaseStudyBlock } from "./types";
import { body as fangtooth01 } from "./fangtooth-01";
import { body as fangtooth02 } from "./fangtooth-02";
import { body as fangtooth03 } from "./fangtooth-03";
import { body as fangtooth04 } from "./fangtooth-04";

/**
 * Slug-keyed registry of extracted case-study bodies. Publication is driven by
 * the existence of content here: a study is reachable only when its slug has a
 * body.
 */
export const caseStudyBodies: Record<string, CaseStudyBlock[]> = {
  "hybrid-excel-architecture": fangtooth01,
  "configuration-driven-analytics": fangtooth02,
  "serverless-cloud-gateway": fangtooth03,
  "llm-orchestration-rag": fangtooth04,
};

export const getCaseStudyBody = (slug: string): CaseStudyBlock[] | undefined =>
  caseStudyBodies[slug];
