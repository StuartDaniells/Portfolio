import { b, heading, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for AlumaPower Case Study 03.
 *
 * Imported exclusively by `registry.internal.ts`. Public builds never reference
 * this module, so none of this prose, nor its headings, reaches `build/`.
 */
export const internalSections: InternalSectionGroup[] = [
  {
    afterSectionId: "architecture-and-data-flow",
    blocks: [
      {
        kind: "paragraph",
        segments: [
          b("Important:"),
          t(
            " This graphic does not prove continuous replication, point-in-time recovery, transactional sync, or tested failover. The actual data stores, backup destination/retention and trigger behavior require verification."
          ),
        ],
      },
    ],
  },
  {
    afterSectionId: "outcome",
    blocks: [
      heading(2, "Internal editorial and engineering verification notes"),

      {
        kind: "list",
        ordered: false,
        items: [
          [
            t("Separate "),
            b("logical data migrations / exports"),
            t(", "),
            b("nightly backups"),
            t(", "),
            b("database restore procedure"),
            t(", and "),
            b("AP-Server failover"),
            t(
              " as different systems. DBLogsSync-like log synchronization is "
            ),
            b("not"),
            t(
              " a backup unless it satisfies backup/recovery requirements."
            ),
          ],
          [
            t(
              "Confirm source and target for local MongoDB→Atlas migration, whether all data was bulk-migrated, backup retention/destinations, protection controls, ownership of Atlas cluster/access configuration and actual restore tests."
            ),
          ],
          [
            t(
              "Confirm AP-Server-1/2 OS, deployment details, PM2 role, restart/recovery design and whether failover was truly automatic or manual. Do not claim instantaneous failover or 'no downtime'."
            ),
          ],
          [
            t(
              "2023 review pp. 2–3: nightly 10 p.m. backup, avoided loss of research data, team server ownership. 2024 review pp. 3–4: centralized database/backups, AP-Server-1 & -2 and described failover."
            ),
          ],
          [
            t(
              "Isolate private infra names in internal mode if the owner wants them omitted from the public article."
            ),
          ],
        ],
      },
    ],
  },
];
