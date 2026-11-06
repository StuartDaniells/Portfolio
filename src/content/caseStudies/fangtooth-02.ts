import { b, c, heading, t, type CaseStudyBlock } from "./types";

/**
 * Fangtooth Case Study 02 - Configuration-Driven Analytics.
 * Extracted from the approved source document. Review-only sections,
 * private repository links, and code/documentation reference sections are
 * excluded.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview", "1-overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I designed and directed the implementation of a configuration driven financial analytics engine that separates the definition of financial models from their execution. Rather than hard-coding individual reporting workflows, the system uses JSON based configuration-including a domain specific language (DSL) to select financial metrics, construct SQL queries, and execute analyses over locally stored Parquet datasets using DuckDB."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The same backend supports structured dataset validation, cross-dataset consistency checks, filtered analysis, charts, tables, drill-downs, and exports. The architectural goal was to create a reusable analytical core that could grow with new financial models without repeatedly rebuilding the processing infrastructure."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Central design decision: "),
      b(
        "Financial definitions belong in configuration; common validation, query execution, and data-access behavior belong in a shared backend engine."
      ),
    ],
  },

  heading(2, "System Architecture", "2-system-architecture"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The diagram combines two related flows documented in the backend: dataset ingestion and model driven analytical execution. It is a close conceptual representation of the actual system (due security constraints)."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Configuration-driven analytics system architecture",
    chart: `flowchart TB
    subgraph UI["Excel + Vue 3 task pane"]
        UP["Import financial datasets"]
        REQ["Choose model · metric · period · filters"]
        RENDER["Charts · tables · drill-down · export"]
    end

    subgraph INGEST["Local FastAPI - ingestion and validation"]
        GATE["api_gateway.py\nHTTP request handling"]
        V1["Individual upload validation\nColumn mapping · types · schema"]
        V2["Cross-dataset validation\nConfigured consistency rules"]
        CONVERT["Dataset transformation\nExcel → Parquet"]
    end

    subgraph MODEL["Local FastAPI - configuration-driven analytics"]
        CFG["JSON model configurations\nDSL.json · model indexes · renderer definitions"]
        FORM["query_formulator.py\nResolve model / metric · construct SQL"]
        QUERY["crud_db.py\nView management · query execution"]
        DUCK["DuckDB\nSQL on local Parquet"]
        RESULTS["Structured result objects\nChart / table / drill-down"]
    end

    FILES[("Local Parquet files\nEngagement / company datasets")]

    UP -->|"POST /api/validate_excel"| GATE
    GATE --> V1
    UP -->|"POST /api/validate-cross-dataset"| GATE
    GATE --> V2
    V2 <-->|"Rule definitions"| CFG
    UP -->|"POST /api/transform_datasets"| GATE
    GATE --> CONVERT
    CONVERT --> FILES
    CONVERT -.->|"Invalidate affected views"| QUERY

    REQ -->|"POST /api/model_metric_charts\n(or related endpoint)"| GATE
    GATE --> FORM
    CFG --> FORM
    FORM -->|"Parameterized SQL + context"| QUERY
    QUERY --> DUCK
    DUCK <--> FILES
    DUCK -->|"Query rows"| QUERY
    QUERY --> FORM
    FORM --> RESULTS
    RESULTS --> GATE
    GATE -->|"JSON / streamed output"| RENDER`,
    outline: [
      "The Excel task pane imports datasets and requests models, metrics, periods, and filters.",
      "Ingestion validates individual uploads, cross-dataset rules, and transforms Excel into local Parquet.",
      "Analytical requests flow through the gateway into the query formulator, which reads JSON model configuration.",
      "The formulator builds SQL, executed through DuckDB over local Parquet files, returning structured chart, table, or drill-down results.",
    ],
  },

  heading(2, "The Engineering Challenge", "3-the-engineering-challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Financial analysis draws on related but structurally different datasets: trial balances, charts of accounts, general ledgers, sales ledgers, and accounts receivable/payable records. The system must interpret these inputs according to reporting rules while accounting for different schemas, fiscal periods, and model-specific calculations."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "A separate, hard-coded pipeline for every metric would make the application difficult to extend and inconsistent to maintain. At the same time, accepting imperfect uploads or applying out-of-date views to revised datasets would undermine analytical reliability."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [t("The objective was to establish an architecture that could:")],
  },
  {
    kind: "list",
    ordered: false,
    items: [
      [t("Separate reporting logic and model metadata from Python execution code.")],
      [t("Normalize and validate incoming financial datasets before analytical use.")],
      [t("Query columnar local data efficiently without a mandatory cloud analytics database.")],
      [
        t(
          "Share a consistent model/query infrastructure across charts, tables, filters, drill-downs, and exports."
        ),
      ],
      [t("Manage data changes, fiscal-period logic, and concurrent access to analytical views.")],
    ],
  },

  heading(2, "Important Design Decisions", "6-important-design-decisions"),

  {
    kind: "paragraph",
    segments: [
      b("A. Separating business rules from execution code"),
      t(
        " Financial models and SQL templates are described in configuration rather than being embedded throughout the application. This allows model definitions to evolve while preserving the reusable backend execution layer. It also demands deliberate configuration validation and change management: moving rules into JSON does not remove their complexity."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("B. Using Parquet as the analytical data format"),
      t(
        " Financial spreadsheets are transformed into local Parquet datasets so the system can query columnar files using DuckDB. The approach is appropriate for repeated local analytical queries and avoids deploying a separate database server for each customer's financial data. It does not imply that every query is guaranteed to be fast; actual latency depends on dataset size, query complexity, hardware, and caching."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("C. Protecting analytical consistency after data changes"),
      t(" "),
      c("crud_db.py"),
      t(
        " uses Parquet file modification times and path identity to track whether analytical views remain current. When datasets are transformed or replaced, the backend invalidates the relevant view cache so subsequent requests can rebuild stale definitions."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("D. Managing concurrent catalog changes"),
      t(
        " The local backend uses per-database locks around DuckDB operations that may modify shared catalog objects. This addresses write/write conflicts when multiple HTTP requests attempt to create or replace views for the same database concurrently. Serialization is a conscious trade-off: it improves correctness, while potentially limiting concurrent throughput for the same catalog."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("E. Centralizing fiscal-period and reporting logic"),
      t(
        " The backend includes fiscal-period parsing and specialized financial statement logic. For example, the view execution layer can normalize cumulative trial-balance reporting into period movements for applicable statement views, so charts, tables, drill-downs, and exports use consistent interpretations."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("F. Reusing the engine across analytical workflows"),
      t(
        " The configuration-driven backend provides a common foundation for charting, tables, filtering, drill-down data, and exports. This creates a more maintainable system than implementing an unrelated data processing path for each screen or report."
      ),
    ],
  },

  heading(2, "Engineering Trade-offs", "7-engineering-trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The separation between configuration and execution reduces duplicated application logic, but introduces a need to maintain consistent schemas across the DSL, model indexes, renderer definitions, and dataset-validation rules."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "DuckDB and Parquet simplify local analytical infrastructure, but require careful handling of file updates, view lifecycles, query memory usage, and concurrent requests. Keeping models flexible also requires thoughtful constraints on dynamic SQL generation and configuration deployment."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The architecture therefore prioritizes "),
      b("reusability, local execution, and analytical consistency"),
      t(" over the simplicity of writing a few fixed-purpose reporting functions."),
    ],
  },

  heading(2, "Outcome", "8-outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The result is a shared, configuration driven analytical foundation for Fangtooth's financial workflows. It supports importing and checking related financial datasets, querying local Parquet through DuckDB, and returning consistent analytical results to the Excel interface."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "Instead of designing an isolated backend for each financial model, the platform provides a common engine in which configurations determine analytical behavior while Python services retain responsibility for validation, SQL execution, view management, and result formatting."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Portfolio takeaway:"),
      t(
        " I designed the separation between financial business definitions and the analytical execution engine, including the data-validation and concurrency considerations required to make that separation practical."
      ),
    ],
  },
];
