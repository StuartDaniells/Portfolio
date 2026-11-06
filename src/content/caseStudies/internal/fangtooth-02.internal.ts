import { b, c, heading, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for Case Study 02.
 *
 * Imported exclusively by `registry.internal.ts`. Public builds never reference
 * this module, so none of this prose, its tables, or its Mermaid sources reach
 * `build/`.
 */
export const internalSections: InternalSectionGroup[] = [
  {
    afterSectionId: "the-engineering-challenge",
    blocks: [
      heading(
        2,
        "Dataset Ingestion and Validation",
        "4-dataset-ingestion-and-validation"
      ),

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
        headers: [
          [b("Phase")],
          [b("Representative endpoint")],
          [b("Primary responsibility")],
        ],
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
            [
              t(
                "Persist prepared data in Parquet and invalidate affected DuckDB view-cache entries."
              ),
            ],
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

      heading(
        2,
        "Configuration-Driven Analytics and SQL Execution",
        "5-configuration-driven-analytics-and-sql-execution"
      ),

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
            t(
              " locates the appropriate model and metric definition using cached JSON configuration, including "
            ),
            c("DSL.json"),
            t("."),
          ],
          [
            b("Construct SQL."),
            t(
              " The engine assembles dynamic analytical SQL and handles parameters and model-specific context."
            ),
          ],
          [
            b("Execute in DuckDB."),
            t(" "),
            c("crud_db.py"),
            t(
              " manages analytical views and executes SQL against local Parquet datasets."
            ),
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
    ],
  },
];
