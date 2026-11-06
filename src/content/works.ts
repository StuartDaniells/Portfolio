/**
 * Works index content registry.
 *
 * This module owns *metadata* only: organization grouping, study order, titles,
 * stack labels, card copy and publication state. Long-form case-study prose
 * lives in `src/content/caseStudies/` and is rendered through the case-study
 * body renderer — never duplicated here.
 */

export type StudyStatus = "published" | "placeholder";

export interface CaseStudy {
  /** Two-digit chapter number inside the organization, e.g. "02". */
  id: string;
  orgId: string;
  slug: string;
  /** Full page heading from the approved source document. */
  articleTitle: string;
  /** Short display title that fits the card. */
  title: string;
  /** Short focus descriptor shown on the study header. */
  focus: string;
  stack: string[];
  /** One-sentence card teaser. Not a metric claim. */
  teaser: string;
  /** Executive takeaway shown at the top of the study page. */
  takeaway: string;
  status: StudyStatus;
}

export interface WorksOrganization {
  id: string;
  name: string;
  role: string;
  summary: string;
  studies: CaseStudy[];
}

export const fangtooth: WorksOrganization = {
  id: "fangtooth",
  name: "Fangtooth Analytics Inc.",
  role: "Co-Founder & CTO",
  summary:
    "A financial analytics platform where analysts keep working in Excel while the heavy lifting happens locally, with cloud identity and an AI layer sitting behind an explicit boundary.",
  studies: [
    {
      id: "01",
      orgId: "fangtooth",
      slug: "hybrid-excel-architecture",
      articleTitle:
        "Architecting a Hybrid Excel-Integrated Financial Analytics Platform",
      title: "Hybrid Excel & Local Backend",
      focus: "Office.js · local process boundary",
      stack: ["Office.js", "Vue 3", "FastAPI"],
      teaser:
        "An Excel-native interface connected to a separate local processing engine for financial data workflows.",
      takeaway:
        "Keeps the analyst's existing tool and data locality intact while moving computation out of the workbook and behind a versioned API.",
      status: "published",
    },
    {
      id: "02",
      orgId: "fangtooth",
      slug: "configuration-driven-analytics",
      articleTitle: "Designing a Configuration-Driven Financial Analytics Engine",
      title: "Configuration-Driven Analytics",
      focus: "Query engine · declarative rules",
      stack: ["Python", "DuckDB", "Parquet"],
      teaser:
        "A configuration driven query pipeline for reusable, structured financial analytics.",
      takeaway:
        "Moves analytical definitions out of ad-hoc spreadsheet formulas and into a declarative format the engine can validate, version and execute.",
      status: "published",
    },
    {
      id: "03",
      orgId: "fangtooth",
      slug: "serverless-cloud-gateway",
      articleTitle:
        "Architecting a Serverless Cloud Gateway for Authentication, Data Access & Software Distribution",
      title: "Cloud Gateway & Security",
      focus: "Identity · reference data",
      stack: ["Azure Functions", "OAuth 2.0"],
      teaser:
        "A serverless integration boundary for identity, reference data, and software distribution.",
      takeaway:
        "Defines the trust boundary between local analytics and the cloud, with capability scoped to what actually needs the internet.",
      status: "published",
    },
    {
      id: "04",
      orgId: "fangtooth",
      slug: "llm-orchestration-rag",
      articleTitle:
        "Architecting an LLM Orchestration & RAG Financial Analysis Layer",
      title: "LLM Orchestration & RAG",
      focus: "Retrieval · grounded answers",
      stack: ["LlamaIndex", "Qdrant", "Ollama"],
      teaser:
        "An orchestration layer combining document retrieval with deterministic financial context for AI-assisted analysis.",
      takeaway:
        "Grounding is treated as an orchestration problem: retrieve first, assemble explicit context, then generate — never let the model reach for data itself.",
      status: "published",
    },
  ],
};

export const alumapower: WorksOrganization = {
  id: "alumapower",
  name: "AlumaPower",
  role: "Data Engineer & Full-Stack Developer",
  summary:
    "Industrial telemetry and enterprise software delivery: ingesting operational data and building the applications that sit on top of it.",
  studies: [
    {
      id: "01",
      orgId: "alumapower",
      slug: "industrial-telemetry",
      articleTitle: "Industrial telemetry",
      title: "Industrial telemetry",
      focus: "Ingestion · operational data",
      stack: ["Python", "SQL", "Azure"],
      teaser: "Placeholder chapter. Not published.",
      takeaway: "Placeholder chapter. Not published.",
      status: "placeholder",
    },
    {
      id: "02",
      orgId: "alumapower",
      slug: "enterprise-applications",
      articleTitle: "Enterprise applications",
      title: "Enterprise applications",
      focus: "Full-stack · line-of-business",
      stack: ["Full-stack", "SQL", "Azure"],
      teaser: "Placeholder chapter. Not published.",
      takeaway: "Placeholder chapter. Not published.",
      status: "placeholder",
    },
  ],
};

export const worksOrganizations: WorksOrganization[] = [fangtooth, alumapower];

/** A study can be navigated to when it is published. */
export const canOpenStudy = (study: CaseStudy): boolean =>
  study.status === "published";

/** Placeholder (unpublished) studies never appear in a public grid. */
export const visibleStudies = (org: WorksOrganization): CaseStudy[] =>
  org.studies.filter((study) => study.status !== "placeholder");

export const getOrganization = (orgId?: string): WorksOrganization | undefined =>
  worksOrganizations.find((org) => org.id === orgId);

export const getStudy = (
  orgId?: string,
  slug?: string
): CaseStudy | undefined =>
  getOrganization(orgId)?.studies.find((study) => study.slug === slug);

export const studyPath = (study: CaseStudy): string =>
  `/home/works/${study.orgId}/${study.slug}`;

export const organizationAnchor = (org: WorksOrganization): string =>
  `/home/works#${org.id}`;

export const adjacentStudies = (
  study: CaseStudy
): { previous?: CaseStudy; next?: CaseStudy } => {
  const org = getOrganization(study.orgId);
  if (!org) return {};
  const ordered = visibleStudies(org);
  const index = ordered.findIndex((item) => item.slug === study.slug);
  if (index === -1) return {};
  return { previous: ordered[index - 1], next: ordered[index + 1] };
};
