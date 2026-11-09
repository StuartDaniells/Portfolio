import { b, heading, i, t, type CaseStudyBlock } from "./types";

/**
 * AlumaPower Case Study 04 - Enterprise applications and workflow engineering.
 * Public sections transcribed from the approved source document. The
 * terminal internal verification notes live in `internal/alumapower-04.internal.ts`
 * and are excluded from public builds.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Alongside industrial monitoring and experimental data engineering, I contributed to a range of internal applications used by quality management, fabrication, laboratory/testing, supply chain, inventory and administrative teams. The work was less about a single complex algorithm and more about "
      ),
      b("understanding how people actually moved information through the business"),
      t(
        " and replacing fragile manual routing with explicit workflows."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "A useful example is document and attachment handling. Quality and testing teams recorded issues through application forms, then needed to store photos, videos, supporting files and records under the correct SharePoint site, channel and folder. Over time, teams accumulated spreadsheets containing SharePoint links and needed people to remember which location was correct for a particular submission. The application and automation work reduced that coordination burden without forcing every department into an identical document structure."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("These were "),
      b("separate business applications and workflows"),
      t(
        ", not one monolithic ERP platform. My contribution spanned custom application development and the configuration/integration of Microsoft 365 automation."
      ),
    ],
  },

  heading(2, "Architecture and integration patterns"),

  {
    kind: "paragraph",
    segments: [
      t("The diagram illustrates two related but "),
      b("distinct responsibilities"),
      t(
        ": web applications capture and present operational records, while document automation determines the destination for attachments."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Enterprise application and document routing pattern",
    chart: `flowchart TB
    USERS["Quality · Testing · Fabrication · Supply Chain · HR users"]
    WEB["Internal web interfaces<br/>Forms · records · review screens"]
    APP["Custom application services<br/>Vue / Node.js · MongoDB as applicable"]
    FILE["Attachment or document submission<br/>File · image · video"]
    META["Routing attributes<br/>Department/channel · form type<br/>Submitter · requested destination"]
    FLOW["Power Automate<br/>Routing and upload workflow"]
    SITE["Microsoft 365 / SharePoint<br/>Site and library organization"]
    DEST["Destination folder<br/>Quality · testing · purchasing · receipts · drafts ..."]
    REVIEW["Department review / retrieval"]
    USERS --> WEB
    WEB --> APP
    WEB --> FILE
    FILE --> META --> FLOW --> SITE --> DEST --> REVIEW
    APP -.->|"Application records where relevant"| REVIEW`,
    outline: [
      "Users interact with internal web interfaces for forms, records and review screens.",
      "Web interfaces call custom application services (Vue / Node.js, MongoDB as applicable) and accept file, image or video submissions.",
      "Attachments carry routing attributes (department/channel, form type, submitter, requested destination).",
      "Power Automate uses those attributes to place files in the correct Microsoft 365 / SharePoint destination folder.",
      "Department review and retrieval happens from the destination folder, with application records linked where relevant.",
      "The web application owns forms and business workflow; Power Automate owns file/folder routing, not the application's form logic.",
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Boundaries matter:"),
      t(" The "),
      b("web application"),
      t(" handled user-facing forms and the associated business workflow. The "),
      b("Power Automate component"),
      t(" handled finding and writing the right file/folder destination; it was "),
      i("not"),
      t(
        " the mechanism that executed the entire QMS/testing application or performed all form validation. Microsoft 365 and Azure AD/Entra configuration established the organizational integration environment. Exact permission design and individual connector implementations are not asserted here."
      ),
    ],
  },

  heading(2, "The challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Files and issue records were useful only when colleagues could find them later. Teams worked with multiple SharePoint sites or channels and different conventions for purchasing, receipts, quality drafts, quality communications, experiment-related media and departmental records. When a new form, department or storage category was introduced, staff could end up relying on a manually curated list of locations and ad hoc knowledge held by one colleague."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The practical pain was easy to underestimate: a successful form submission did not necessarily mean the evidence was filed in the right place. A photo or test video stored under the wrong directory might be available technically but hard to retrieve for review, traceability or follow up. The resulting administrative steps multiplied across quality, testing and fabrication work."
      ),
    ],
  },

  heading(2, "The architectural decision"),

  {
    kind: "paragraph",
    segments: [
      t("Instead of demanding that every employee navigate a growing SharePoint directory tree, I helped bring "),
      b("routing context into the submission flow"),
      t(
        ". Metadata such as department or channel, form type, the person submitting, the intended category and applicable folder structure informed where the attachment belonged. Power Automate then carried out the file and folder operation through the organization’s Microsoft 365 integration."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("Custom web applications continued to own their individual form and record interactions. The automation acted as a "),
      b("supporting integration boundary"),
      t(
        " between the user workflow and the document repository. This divided responsibilities more cleanly than mixing document-placement decisions into every web form or requiring staff to memorize direct SharePoint links."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The same broader application practice applied to internal QMS, supply-chain, inventory and laboratory workflows: tailor interfaces and data handling to a department's needs while sharing appropriate hosting, identity and storage capabilities where practical. The implementations were related by engineering approach, "
      ),
      b("not"),
      t(" by a single universal codebase."),
    ],
  },

  heading(2, "Why this design"),

  {
    kind: "paragraph",
    segments: [
      b("Route by intent, not by manual navigation."),
      t(
        " A submission can carry the attributes needed to locate its correct home. The system makes document filing part of the workflow rather than a separate task that depends on someone maintaining a directory cheat sheet."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Keep business forms and file movement separate."),
      t(
        " The application can evolve its fields and review logic without turning every screen into a bespoke SharePoint uploader. Conversely, folder routing can change without redesigning the entire web interface. Provided the metadata contract remains compatible."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Preserve department specific structures."),
      t(
        " Purchasing receipts, quality-management drafts, testing videos, HR documents and other records did not need to share a misleadingly uniform hierarchy. The routing system supported the correct destination based on their different business contexts."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Use the existing Microsoft ecosystem selectively."),
      t(
        " SharePoint and Power Automate were appropriate for documents already governed through Microsoft 365. Custom software remained useful when a department required workflows beyond simple file upload or low code forms."
      ),
    ],
  },

  heading(2, "Trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Configuration-driven routing moves complexity into rules, metadata quality, permissions and exception handling. An incorrectly classified document can still be filed in the wrong place. Connector credentials and Microsoft 365 permissions require maintenance as the organization changes. Workflow runs can fail or be retried, so production-quality systems need monitoring and idempotent behavior; this case study does not claim that all such controls were independently audited."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "A mixed portfolio of custom applications and Microsoft Power Platform flows also creates multiple deployment and administration surfaces. Reuse should be purposeful rather than forcing every project into the same frontend or storage choice."
      ),
    ],
  },

  heading(2, "Outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The combined web-application and document routing work gave quality, fabrication, testing and other operational teams a more direct path from submitting an issue or supporting attachment to retrieving it later from the right departmental location. It replaced part of a manual, link heavy coordination process with routing based on submission context."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The engineering contribution is "),
      b("requirements translation"),
      t(
        ": identifying a repeated operational failure, separating application logic from document placement, and implementing a workflow suited to the organization's existing systems."
      ),
    ],
  },
];
