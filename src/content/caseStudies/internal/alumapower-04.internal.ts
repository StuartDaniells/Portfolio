import { b, c, heading, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for AlumaPower Case Study 04.
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
            t("Owner's explicit clarification: "),
            b(
              "Power Automate was for file/folder routing, not for the QMS/testing application form logic."
            ),
            t(
              " Do not combine the custom web app and flow into one fictional product."
            ),
          ],
          [
            t(
              "Routing attributes owner described: department/channel, form type, submitter, requested location and folder structure. Examples included purchasing receipts, quality drafts, communications records, HR, QMS, fabrication, testing services and supply chain."
            ),
          ],
          [
            t(
              "Owner described earlier Excel sheets of SharePoint links and repeated manual coordination. Use as a qualitative before-state, not as evidence of measured savings."
            ),
          ],
          [
            t("The uploaded flow ZIP packages include "),
            c("Flow_Multi_Attach_Uploader"),
            t(", "),
            c("Flow_CreateSPFolder"),
            t(", "),
            c("QMS_Multi_Attach_Uploader"),
            t(" and "),
            c("TSS_URL_Params_SP_Uploader"),
            t(
              ". Verify their exact expressions, triggers, connectors, and tenant permissions against an authorized export before adding precise implementation details."
            ),
          ],
          [
            t(
              "The organization-level Entra/Azure AD setup and Microsoft 365 integration were owner-confirmed; do not imply a security audit, particular OAuth scopes, least-privilege proof or approval workflow without records."
            ),
          ],
          [
            t(
              "Some apps used Vue/Node/MongoDB, some used Microsoft Power Platform/SharePoint. Do not assign every technology to each app, or attribute code ownership to the author alone without reviewing individual projects."
            ),
          ],
          [
            t(
              "Before publishing screenshots, exclude employee identity, customer and laboratory data, SharePoint URLs, internal site structure and sensitive quality records."
            ),
          ],
        ],
      },
    ],
  },
];
