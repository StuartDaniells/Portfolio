/**
 * Works index content registry.
 *
 * This module owns *metadata* only: organization grouping, study order, titles,
 * stack labels, card copy and publication state. Long-form case-study prose
 * lives in `src/content/caseStudies/` and is rendered through the case-study
 * body renderer - never duplicated here.
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
      stack: ["Office.js", "Vue 3", "Python FastAPI", "JavaScript", "State management (Pinia)", "Hooks and composition API", "AWS CLI s3 bucket sync"],
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
      stack: ["Python", "DuckDB", "Parquet", "SQL generation", "JSON DSL (Domain-Specific Language)"],
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
      stack: ["Azure Functions", "OAuth 2.0", "Cloudflare R2 Blob Storage", "Azure Table Storage", "Azure Key Vault", "Windows KeyRings"],
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
      stack: ["LlamaIndex", "Qdrant", "Ollama", "Docker", "SSE streaming", "Prompt assembly", "OpenAI API", "Similarity search", "Vector embeddings"],
      teaser:
        "An orchestration layer combining document retrieval with deterministic financial context for AI-assisted analysis.",
      takeaway:
        "Grounding is treated as an orchestration problem: retrieve first, assemble explicit context, then generate - never let the model reach for data itself.",
      status: "published",
    },
  ],
};

export const alumapower: WorksOrganization = {
  id: "alumapower",
  name: "AlumaPower",
  role: "Data & Cloud Engineer · Full-Stack Developer",
  summary:
    "At AlumaPower, I built software that connected industrial research with day to day operations: remote monitoring and control of experimental power systems, faster experiment analysis, reliable access to research data, and applications that reduced manual coordination across teams. These are four distinct initiatives, each with different engineering constraints and outcomes.",
  studies: [
    {
      id: "01",
      orgId: "alumapower",
      slug: "ops-vista-2-industrial-iot",
      articleTitle:
        "Architecting Ops Vista 2.0: A Schema Driven Industrial Telemetry Platform",
      title: "Industrial IoT & Real-Time Telemetry",
      focus: "Industrial IoT · real-time telemetry",
      stack: ["Vue3", "Python", "MQTT", "Protobuf", "Azure Data Explorer (ADX)", "Kusto Query Language (KQL)", "Azure App Service", "Azure Functions", "Azure Key Vault", "MongoDB Atlas", "Node.js", "FastAPI", "pm2 process manager", "Grafana", "Azure Web PubSub (WebSocket)"],
      teaser:
        "Evolved CLI-based telemetry into schema driven live monitoring, remote control and selective historical analysis across two independently deployed hardware services.",
      takeaway:
        "Preserves raw telemetry in Azure Data Explorer as the system of record while streaming a compact live projection to the UI and persisting only requested decoded history, across two hardware specific service boundaries.",
      status: "published",
    },
    {
      id: "02",
      orgId: "alumapower",
      slug: "experiment-analysis-automation",
      articleTitle:
        "Automating Experiment Analysis: From Manual Spreadsheets to Repeatable Results",
      title: "Experiment Analysis Automation",
      focus: "Data engineering · experiment automation",
      stack: ["Python", "ETL Data pipelines", "MongoDB", "Data validation and clean-up", "Analysis and Report automation", "Node.js"],
      teaser:
        "Replaced manual data cleanup and spreadsheet analysis with a repeatable Python workflow; testing staff reported roughly 45 minutes to 7 seconds per experiment.",
      takeaway:
        "A repeatable Python workflow replaced per-experiment file imports, cleanup and chart rebuilding, so testing staff moved from roughly 45 minutes to about 7 seconds of preparation per experiment.",
      status: "published",
    },
    {
      id: "03",
      orgId: "alumapower",
      slug: "data-infrastructure-modernization",
      articleTitle:
        "Modernizing Data Infrastructure: Centralized Research Data, Backups and Recovery",
      title: "Data Infrastructure & Recovery",
      focus: "Database infrastructure · backup & recovery",
      stack: ["MongoDB Atlas", "Python", "Windows Server", "Cron jobs", "Scheduled backups", "Recovery verification", "Point in time recovery", "Node.js", "Web templating", "pm2 process manager"],
      teaser:
        "Centralized experimental and business data, migrated MongoDB workloads to Atlas, and implemented automated backups and shared application hosting.",
      takeaway:
        "Standardized scattered lab data into central stores, moved MongoDB workloads to Atlas, and added scheduled backups so research data survived individual machine failures.",
      status: "published",
    },
    {
      id: "04",
      orgId: "alumapower",
      slug: "enterprise-workflow-applications",
      articleTitle:
        "Engineering Enterprise Applications: Making Operational Workflows Easier to Run",
      title: "Enterprise Applications & Workflows",
      focus: "Workflow engineering · Microsoft 365 integration",
      stack: ["Vue", "Node.js", "SharePoint", "Power Automate", "Power Apps", "Power Platform Development", "Microsoft Graph API"],
      teaser:
        "Built internal tools and contextual SharePoint file-routing automation, replacing manual link lookup and document placement across departments.",
      takeaway:
        "Separated custom web-app logic from document placement so Power Automate files attachments by submission context instead of hand-maintained link lists.",
      status: "published",
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
