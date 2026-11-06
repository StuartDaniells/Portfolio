import { b, heading, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for Case Study 01.
 *
 * Imported exclusively by `registry.internal.ts`. Public builds never reference
 * this module, so none of this prose, nor its headings, reaches `build/`.
 */
export const internalSections: InternalSectionGroup[] = [
  {
    afterSectionId: "the-architectural-decision",
    blocks: [
      heading(2, "Why this design"),

      {
        kind: "paragraph",
        segments: [
          b("Performance and responsiveness."),
          t(
            " Computational workloads reside outside the Excel task pane. DuckDB and columnar Parquet storage provide a suitable execution model for repeated analytical queries without requiring the frontend to process large datasets."
          ),
        ],
      },
      {
        kind: "paragraph",
        segments: [
          b("Data handling."),
          t(
            " Core financial datasets and analytical processing stay on the desktop in the documented workflow. This reduces unnecessary data movement, but does not by itself prove end-to-end security or regulatory compliance; other platform features do connect to cloud services."
          ),
        ],
      },
      {
        kind: "paragraph",
        segments: [
          b("Separation of concerns."),
          t(
            " The Office.js/Vue interface, local API, storage, and optional cloud services have different responsibilities. The backend can evolve its processing logic without embedding that logic in the user interface."
          ),
        ],
      },
    ],
  },
];
