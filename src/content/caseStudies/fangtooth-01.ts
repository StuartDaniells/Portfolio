import { b, c, heading, i, t, type CaseStudyBlock } from "./types";

/**
 * Fangtooth Case Study 01 - Hybrid Excel & Local Backend.
 * Extracted from the approved source document. Review-only sections and
 * private repository links are excluded.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I designed a hybrid desktop–cloud architecture for Fangtooth, a financial analytics platform that operates within Microsoft Excel while executing intensive data-processing workloads through a locally deployed Python service. The central decision was to keep the Excel add-in focused on interaction and visualization, moving financial-file handling, validation, transformation, and analytical queries into a separate FastAPI backend."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "This preserved an Excel-native workflow without making the task pane responsible for computationally intensive processing or unrestricted local file operations."
      ),
    ],
  },

  heading(2, "Architecture and API/data flow"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The following diagram is a technical overview, not a depiction of every endpoint or configuration (due to security reasons)."
      )
    ],
  },
  {
    kind: "mermaid",
    label: "Hybrid Excel and local backend architecture",
    chart: `flowchart TB
    subgraph EXCEL["Microsoft Excel - presentation layer"]
        UI["Office.js + Vue 3 task pane<br/>Upload · Configure · Visualize"]
    end

    subgraph DESKTOP["Windows machine - local processing"]
        GATE["FastAPI API gateway"]
        VALIDATE["Stage 1 · File validation<br/>Columns · Types · Schema"]
        CROSS["Stage 2 · Cross-dataset checks<br/>DSL-based consistency rules"]
        TRANSFORM["Stage 3 · Transformation<br/>Excel → Parquet"]
        FORMULATOR["Query formulator<br/>JSON DSL → SQL"]
        DUCK["DuckDB analytics engine<br/>Views · Filters · Aggregations"]
        RATE["Tax / FX lookup handler"]
        PARQUET[("Local Parquet datasets<br/>Per engagement / company")]
        CONFIG[("Local JSON configurations<br/>Including DSL.json")]
        SQLITE[("Local SQLite<br/>Reference-rate cache")]
    end

    subgraph CLOUD["Supporting cloud services - not core analytics compute"]
        R2["Cloudflare R2<br/>Frontend assets"]
        FUNCTION["Azure Function App<br/>Reference-data proxy"]
        AZSQL[("Azure SQL<br/>Tax / FX reference data")]
    end

    R2 -->|"Load frontend assets"| UI

    UI -->|"1 · POST /api/validate_excel"| GATE
    GATE --> VALIDATE
    VALIDATE -->|"Validation results"| GATE

    UI -->|"2 · POST /api/validate-cross-dataset"| GATE
    GATE --> CROSS
    CROSS -->|"Consistency results"| GATE

    UI -->|"3 · POST /api/transform_datasets"| GATE
    GATE --> TRANSFORM
    TRANSFORM -->|"Write validated data"| PARQUET
    TRANSFORM -.->|"Invalidate stale view cache"| DUCK

    UI -->|"4 · POST /api/model_metric_charts"| GATE
    GATE --> FORMULATOR
    CONFIG -->|"Model and query rules"| FORMULATOR
    FORMULATOR -->|"Parameterized SQL"| DUCK
    DUCK <-->|"Read local data"| PARQUET
    DUCK -->|"Query rows"| FORMULATOR
    FORMULATOR -->|"Chart response"| GATE
    GATE -->|"JSON results · status · errors"| UI

    UI -->|"Optional · POST /api/fx_rate"| GATE
    GATE --> RATE
    RATE <-->|"Cache lookup / update"| SQLITE
    RATE -.->|"Cache miss · reference lookup"| FUNCTION
    FUNCTION <-->|"Read-only rate query"| AZSQL`,
    outline: [
      "The Excel task pane (Office.js + Vue 3) is the presentation layer.",
      "A local FastAPI gateway orchestrates file validation, cross-dataset checks, transformation, and chart queries.",
      "Validated data is written to local Parquet and queried by DuckDB; a local SQLite database caches reference rates.",
      "Cloudflare R2 and an Azure Function App are supporting services for frontend assets and reference data, not core analytics compute.",
      "Chart requests flow: gateway → query formulator → DuckDB → Parquet, returning structured JSON to the task pane.",
    ],
  },

  {
    kind: "paragraph",
    segments: [b("Representative request/response sequence:")],
  },
  {
    kind: "list",
    ordered: true,
    items: [
      [
        t("The user imports an Excel file; "),
        c("POST /api/validate_excel"),
        t(" performs column normalization, data-type validation, and schema checks."),
      ],
      [
        c("POST /api/validate-cross-dataset"),
        t(
          " applies cross-table rules, such as consistency checks between a trial balance and chart of accounts."
        ),
      ],
      [
        c("POST /api/transform_datasets"),
        t(
          " converts validated datasets into local Parquet files and invalidates stale DuckDB views."
        ),
      ],
      [
        t("When a chart is requested, "),
        c("POST /api/model_metric_charts"),
        t(
          " resolves the requested model and metric, reads the JSON DSL, formulates SQL, queries local Parquet through DuckDB, and returns structured results to the task pane."
        ),
      ],
      [
        t(
          "Tax/FX reference operations follow a separate path: local SQLite lookup first, with an Azure Function App-mediated read-only Azure SQL lookup where needed."
        ),
      ],
    ],
  },

  heading(2, "The challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Financial workflows often begin with multiple Excel datasets, such as: a trial balance, chart of accounts, and general ledger-that need to be checked, transformed, reconciled, and explored together. An Excel task pane provides a familiar interface, but its web-based execution environment is not the right place to manage extensive file-system operations or analytical processing."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The architectural requirements were to provide a familiar Excel interface, support multi-stage dataset validation and responsive reporting, and keep core financial processing and storage on the user's machine while permitting narrowly scoped cloud integrations."
      ),
    ],
  },

  heading(2, "The architectural decision"),

  {
    kind: "paragraph",
    segments: [t("I separated the solution into four responsibilities:")],
  },
  {
    kind: "list",
    ordered: true,
    items: [
      [
        b("Presentation:"),
        t(
          " An Office.js add-in with a Vue 3 task pane handles user interaction, dataset selection, feedback, and financial charts. The frontend build is distributed through Cloudflare R2."
        ),
      ],
      [
        b("Local execution:"),
        t(
          " A Windows-deployed FastAPI service exposes explicit API endpoints and owns file access, validation, transformations, and query orchestration."
        ),
      ],
      [
        b("Local analytical storage:"),
        t(
          " Validated data is converted to Parquet files organized by engagement and company. DuckDB executes analytical SQL over those datasets, while SQLite supports separate local application and reference-data needs."
        ),
      ],
      [
        b("Supporting cloud services:"),
        t(
          " An Azure Function App provides an intermediary for cloud-backed operations such as read-only tax/FX reference lookups; identity and software distribution are part of the wider platform, not the execution path for core financial queries."
        ),
      ],
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The important boundary is "),
      b("UI in Excel; computation and financial files in the local backend"),
      t(". The architecture is "),
      i("local-first"),
      t(", not completely offline or cloud-independent."),
    ],
  },

  heading(2, "Trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "This was not the simplest deployment architecture. It introduced a separate Windows backend installation and lifecycle, API coordination between the add-in and local service, and additional configuration for frontend hosting and optional cloud integrations. It also means intensive workloads consume local machine resources. Those costs were deliberate trade-offs for keeping computation and financial-file operations outside the Excel task pane."
      ),
    ],
  },

  heading(2, "Outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The resulting architecture supports an Excel-native workflow for importing and validating financial datasets, converting them into locally stored analytical formats, and requesting charts and reports through explicit API boundaries. It establishes a reusable foundation for subsequent analytics, cloud-integration, and AI capabilities."
      ),
    ],
  }
];
