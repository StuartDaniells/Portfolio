import { b, c, heading, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for AlumaPower Case Study 02.
 *
 * Imported exclusively by `registry.internal.ts`. Public builds never reference
 * this module, so none of this prose, nor its headings, reaches `build/`.
 */
export const internalSections: InternalSectionGroup[] = [
  {
    afterSectionId: "outcome",
    blocks: [
      heading(2, "Internal editorial and engineering verification notes"),

      {
        kind: "list",
        ordered: false,
        items: [
          [
            b("Metric wording:"),
            t(
              " 'Testing staff reported approximately 45 minutes to seven seconds per experiment.' Not '45 minutes to seven seconds for all experiments', '100% accurate', or independently audited benchmark."
            ),
          ],
          [
            t(
              "Owner said 3–4 tests a day; do not calculate time saved/month from this number without valid working-day and baseline assumptions."
            ),
          ],
          [
            t(
              "2023 self-assessment p. 1 asserts ~15 hours/month saved; no need to publish an aggregate monthly figure because throughput and days vary."
            ),
          ],
          [
            t(
              "2023 self-assessment pp. 1–2 references Python, MongoDB, Node.js application update delivery and predictive analysis. Confirm which analytical modules shipped versus were exploratory before naming prediction/AI techniques in public copy."
            ),
          ],
          [
            t("Existing illustrative asset: "),
            c("Process, Data & Logic flow Diagram.png"),
            t(
              " shows lab hardware/data-logger inputs, a master-controller workflow, experiment information, databases, and the Experiment Analysis application leading to analytical outputs. It contains real operational screenshots; sanitise before publishing. The article diagram is intentionally a simplified logical abstraction."
            ),
          ],
          [
            t("Ideal public visual: "),
            b("before/after process"),
            t(" plus a "),
            b("sanitized results screen"),
            t(
              ". Avoid fabricating chart screenshots, experimental plots, or data values."
            ),
          ],
          [
            t(
              "Verify precise input file format(s), transformation library stack, deployment topology, how a user initiated analysis, report/export formats and whether Kusto queried by the tool."
            ),
          ],
        ],
      },
    ],
  },
];
