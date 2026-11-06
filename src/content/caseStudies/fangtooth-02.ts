import { b, c, heading, t, type CaseStudyBlock } from "./types";

/**
 * Fangtooth Case Study 02 — Configuration-Driven Analytics.
 * Extracted from the approved source document. Review-only sections,
 * private repository links, and code/documentation reference sections are
 * excluded.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "1. Overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I designed and directed the implementation of a configuration-driven financial analytics engine that separates the definition of financial models from their execution. Rather than hard-coding individual reporting workflows, the system uses JSON-based configuration—including a domain-specific language (DSL)—to select financial metrics, construct SQL queries, and execute analyses over locally stored Parquet datasets using DuckDB."
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

  heading(2, "2. System Architecture"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The diagram combines two related flows documented in the backend: dataset ingestion and model-driven analytical execution. It is a conceptual representation, not a claim that every internal function always runs in this precise order."
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

    subgraph INGEST["Local FastAPI — ingestion and validation"]
        GATE["api_gateway.py\nHTTP request handling"]
        V1["Individual upload validation\nColumn mapping · types · schema"]
        V2["Cross-dataset validation\nConfigured consistency rules"]
        CONVERT["Dataset transformation\nExcel → Parquet"]
    end

    subgraph MODEL["Local FastAPI — configuration-driven analytics"]
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
  {
    kind: "note",
    segments: [
      t("Production API paths use the "),
      c("/api"),
      t(
        " prefix; development mode may use root-level endpoints. Validation and transformation requests are separate HTTP operations. The local backend retains ownership of financial data processing."
      ),
    ],
  },

  heading(2, "3. The Engineering Challenge"),

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

  heading(2, "4. Dataset Ingestion and Validation"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The documented ingestion workflow is divided into three externally callable phases, with validation findings returned to the UI as structured events:"
      ),
    ],
  },
  {
    kind: "table",
    headers: [[b("Phase")], [b("Representative endpoint")], [b("Primary responsibility")]],
    rows: [
      [
        [b("1. Validate individual uploads")],
        [c("POST /api/validate_excel")],
        [
          t(
            "Column normalization/mapping, type checks, schema checks, and user-readable warnings/errors."
          ),
        ],
      ],
      [
        [b("2. Cross-validate related datasets")],
        [c("POST /api/validate-cross-dataset")],
        [
          t(
            "Apply configured rules across related financial datasets, such as trial balance and chart of accounts."
          ),
        ],
      ],
      [
        [b("3. Transform datasets")],
        [c("POST /api/transform_datasets")],
        [t("Persist prepared data in Parquet and invalidate affected DuckDB view-cache entries.")],
      ],
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The backend components include "),
      c("dataset_ingestor.py"),
      t(", "),
      c("excel_file_operations.py"),
      t(", and "),
      c("parquet_validator.py"),
      t(". The validation-event structure distinguishes "),
      b("blocking errors"),
      t(" from "),
      b("warnings"),
      t(
        "; cross-dataset rule configurations can assign severity. This prevents inconsistent data from being treated as silently valid while still surfacing non-blocking issues for review."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Dataset ingestion and validation sequence",
    chart: `sequenceDiagram
    autonumber
    participant UI as Vue / Excel Task Pane
    participant GW as FastAPI Gateway
    participant ING as dataset_ingestor.py
    participant VAL as parquet_validator.py
    participant FS as Local Dataset Files
    participant DB as DuckDB View Cache

    UI->>GW: POST /api/validate_excel (file + context)
    GW->>ING: Normalize / map columns, check types and schema
    ING-->>GW: Structured validation events
    GW-->>UI: Errors / warnings
    UI->>GW: POST /api/validate-cross-dataset
    GW->>VAL: Evaluate configured cross-dataset rules
    VAL-->>GW: Validation status + events
    GW-->>UI: Cross-validation results
    UI->>GW: POST /api/transform_datasets
    GW->>ING: Transform selected validated datasets
    ING->>FS: Write Parquet + metadata
    ING->>DB: Invalidate affected view-cache entries
    GW-->>UI: Transformation status`,
    outline: [
      "The task pane calls validation endpoints for single uploads and cross-dataset rules.",
      "The gateway returns structured errors and warnings to the UI.",
      "Transformation writes Parquet files and invalidates affected DuckDB view-cache entries.",
    ],
  },
  {
    kind: "note",
    segments: [
      t(
        "The precise order of intermediate temporary files, validation passes, and final writes depends on the implementation path; the diagram shows the documented API-level workflow."
      ),
    ],
  },

  heading(2, "5. Configuration-Driven Analytics and SQL Execution"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Once prepared datasets are available locally, the backend services analytical requests using a shared query pipeline."
      ),
    ],
  },
  {
    kind: "list",
    ordered: true,
    items: [
      [
        b("Resolve the request context."),
        t(
          " The client sends the engagement, company, fiscal dates, model, metric, and relevant filters. The FastAPI gateway parses the request."
        ),
      ],
      [
        b("Read model definitions."),
        t(" "),
        c("query_formulator.py"),
        t(" locates the appropriate model and metric definition using cached JSON configuration, including "),
        c("DSL.json"),
        t("."),
      ],
      [
        b("Construct SQL."),
        t(" The engine assembles dynamic analytical SQL and handles parameters and model-specific context."),
      ],
      [
        b("Execute in DuckDB."),
        t(" "),
        c("crud_db.py"),
        t(" manages analytical views and executes SQL against local Parquet datasets."),
      ],
      [
        b("Package the result."),
        t(
          " The query formulator post-processes rows into the structured response expected by the frontend chart or table renderer."
        ),
      ],
    ],
  },
  {
    kind: "mermaid",
    label: "Configuration-driven analytics execution sequence",
    chart: `sequenceDiagram
    autonumber
    participant UI as Vue Task Pane
    participant GW as api_gateway.py
    participant QF as query_formulator.py
    participant CFG as Config Cache / DSL.json
    participant CRUD as crud_db.py
    participant DB as DuckDB + Parquet

    UI->>GW: POST /api/model_metric_charts (context, model, metric, filters)
    GW->>GW: Parse request and resolve engagement/company context
    GW->>QF: postCharts(...)
    QF->>CFG: Resolve requested metric's query definition
    CFG-->>QF: Model/metric configuration
    QF->>QF: Construct SQL and request parameters
    QF->>CRUD: executeQuery(db_path, sql, params)
    CRUD->>CRUD: Acquire per-database execution lock
    CRUD->>DB: Create/refresh view as needed and execute SELECT
    DB-->>CRUD: Result rows
    CRUD-->>QF: Structured rows
    QF->>QF: Post-process chart data
    QF-->>GW: Render-ready analytical response
    GW-->>UI: JSON response`,
    outline: [
      "The task pane posts model, metric, and filter context to the gateway.",
      "The query formulator resolves the metric definition from cached JSON configuration.",
      "SQL is constructed and executed through a per-database lock in DuckDB against local Parquet.",
      "Rows are post-processed into a render-ready response returned to the UI.",
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The same general architecture also supports table rendering, filter selection, active-filter resolution, drill-down results, and data exports through related endpoints. It does not mean every endpoint uses an identical SQL path or payload."
      ),
    ],
  },

  heading(2, "6. Important Design Decisions"),

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

  heading(2, "7. Engineering Trade-offs"),

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

  heading(2, "8. Outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The result is a shared, configuration-driven analytical foundation for Fangtooth's financial workflows. It supports importing and checking related financial datasets, querying local Parquet through DuckDB, and returning consistent analytical results to the Excel interface."
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
