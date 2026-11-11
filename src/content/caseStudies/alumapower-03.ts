import { b, heading, t, type CaseStudyBlock } from "./types";

/**
 * AlumaPower Case Study 03 - Data infrastructure modernization and recovery.
 * Public sections transcribed from the approved source document. The
 * terminal internal verification notes live in `internal/alumapower-03.internal.ts`
 * and are excluded from public builds.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Across multiple internal systems, I helped move critical research and operational information away from isolated laboratory PCs and independently maintained data stores toward standardized, centrally accessible databases. The effort expanded into data exports, application integrations, MongoDB Atlas configuration, scheduled backup automation and shared server infrastructure."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "This data layer was not a one app use case scenario, but also used by other internal business processes and applications. The strongest operational result was protecting access to experimental data in an environment where individual lab computers could crash, become corrupted or be lost."
      ),
    ],
  },

  heading(2, "Architecture and data flow"),

  {
    kind: "paragraph",
    segments: [
      t("This conceptual overview intentionally separates "),
      b("data movement and nightly backup"),
      t(" from "),
      b("application-hosting failover"),
      t(
        ". The two features have different recovery guarantees and must not be conflated."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Data infrastructure: migration, backup and hosting",
    chart: `flowchart TB
    LAB["Lab machines<br/>Legacy experimental logs"]
    ETL["Python import / cleanup / migration scripts"]
    LOCAL[("Central local MongoDB<br/>Standardized data")]
    ATLAS[("MongoDB Atlas<br/>Shared application data")]
    JOB["Scheduled Python jobs<br/>Windows Task Scheduler"]
    BACKUP[("Nightly backup outputs<br/>Recovery copies")]
    APPS["Internal applications<br/>Lab · QMS · fabrication · HR"]
    PRIMARY["Server-1<br/>Shared application hosting"]
    SECONDARY["Server-2<br/>Backup/failover hosting"]

    LAB --> ETL --> LOCAL
    ETL -.->|"Export and migration as required"| ATLAS
    JOB -->|"Automated backup"| BACKUP
    LOCAL -.-> JOB
    APPS --> ATLAS
    APPS --> LOCAL
    PRIMARY -.->|"Documented standby/failover arrangement"| SECONDARY`,
    outline: [
      "Lab machines with legacy experimental logs feed Python import, cleanup and migration scripts.",
      "Scripts load standardized data into a central local MongoDB and export/migrate to MongoDB Atlas as required.",
      "Scheduled Python jobs (Windows Task Scheduler) write nightly backup outputs.",
      "Internal applications read from both MongoDB Atlas and the central local MongoDB.",
      "Server-1 hosts shared applications, with Server-2 in a documented standby/failover arrangement.",
      "The diagram does not prove continuous replication, point-in-time recovery, or tested failover.",
    ],
  },
  heading(2, "The challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Research data accumulated in local experiment logs and computer specific storage. Individual PCs were not reliable long term repositories, and fragmented datasets made cross-experiment comparison, access by multiple teams, and recovery after machine failure difficult. Meanwhile, internal apps needed a consistent database layer without every application owning its own unsupported storage and maintenance routines."
      ),
    ],
  },

  heading(2, "The architectural decision"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I worked on centralizing and standardizing experimental datasets, wrote Python scripts to export, validate or migrate existing information and integrate consuming applications with MongoDB and MongoDB Atlas, and configured scheduled backup routines. The local environment used scheduled Python jobs during off-hours (described in assessments as around 10 p.m.), while cloud environments also used configured automation. I separately contributed to the shared Server-1 / Server-2 hosting and recovery design."
      ),
    ],
  },

  heading(2, "Why this design"),

  {
    kind: "paragraph",
    segments: [
      b("Data access:"),
      t(
        " A standardized source made historical experimental records and operational information easier for different internal systems and teams to retrieve."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Resilience:"),
      t(
        " Scheduled backup copies reduced reliance on lab machines. As a result, research data remained available despite Windows crashes, corruption or lost PCs."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Operational efficiency:"),
      t(
        " Shared data and application foundations reduced repeated setup and manual data handoffs across internal tools."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Migration pragmatism:"),
      t(
        " Exports, transformations and application integration changes could be introduced progressively. The migration story here focuses on MongoDB and Atlas; the earlier "
      ),
      b("Cosmos DB → ADX telemetry migration belongs in the Ops Vista evolution narrative"),
      t(", not as an Atlas migration."),
    ],
  },

  heading(2, "Trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Centralized infrastructure introduces access management, backup rotation, restore verification, configuration and shared dependency risk. Scheduled backups can lose changes since the last successful run. A secondary server is not automatically a proven high availability system unless traffic switching, state replication and recovery procedures are actually tested. MongoDB Atlas migration also changes networking, security and operating cost considerations."
      ),
    ],
  },

  heading(2, "Outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The company gained more consistent access to research and operational data and scheduled recovery safeguards beyond individual lab PCs. As a result, research data was preserved during multiple lab computer failures and a centralized hosting arrangement for several internal applications. The work supported experimentation, collaboration and ongoing product development."
      ),
    ],
  },
];
