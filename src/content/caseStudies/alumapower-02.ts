import { b, heading, t, type CaseStudyBlock } from "./types";

/**
 * AlumaPower Case Study 02 - Experiment Analysis automation.
 * Public sections transcribed from the approved source document. The
 * terminal internal verification notes live in `internal/alumapower-02.internal.ts`
 * and are excluded from public builds.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I developed an Experiment Analysis application to replace a repetitive laboratory workflow that required researchers and testing staff to import data files, clean and transform measurements, move results into Excel, and build queries, tables and graphs before an experiment could be reviewed. The application brought those steps into a repeatable, largely one click process."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("Testing personnel reported that a routine analysis that previously took "),
      b("approximately 45 minutes per experiment"),
      t(" could be completed in "),
      b("about 7 seconds per experiment"),
      t(
        " with the application. The result mattered because the laboratory ran multiple experiments per day; reducing routine preparation work meant more time to interpret the results and act on them."
      ),
    ],
  },

  heading(2, "Architecture and data flow"),

  {
    kind: "paragraph",
    segments: [
      t("The exact input file types and order of pipeline steps varied as the tool evolved. This is a "),
      b("logical workflow.")
    ],
  },
  {
    kind: "mermaid",
    label: "Experiment Analysis workflow",
    chart: `flowchart LR
    LOGS["Experimental data logs<br/>Raw measurements / source files"]
    INGEST["Python import<br/>Parse and validate"]
    CLEAN["Cleaning and transformation<br/>Standardize structure"]
    ANALYSIS["Analysis routines<br/>Metrics · tables · patterns"]
    STORE[("MongoDB<br/>Structured data access")]
    REPORT["Reports / charts<br/>Results for testing staff"]
    LOGS --> INGEST --> CLEAN --> ANALYSIS --> REPORT
    CLEAN --> STORE
    STORE -.-> ANALYSIS`,
    outline: [
      "Experimental data logs are imported by Python, which parses and validates them.",
      "Cleaning and transformation standardizes the data structure.",
      "Analysis routines compute metrics, tables and patterns, then produce reports and charts for testing staff.",
      "Cleaned data is stored in MongoDB for structured access and can feed back into analysis.",
      "This is a logical workflow.",
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Representative sequence:"),
      t(
        " A tester selects or loads an experiment. Python imports and prepares its observations, applies repeatable calculations and transformations, produces structured analysis, and delivers calculations, charts or reports. MongoDB supported standardized access to all the cleansed and analyzed experimental data; the Node.js component was for automated application version downloads and control."
      ),
    ],
  },

  heading(2, "The challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The prior analysis process repeated the same labor-intensive preparation for each experiment: importing files, fixing structures and values, extracting relevant measurements, transferring results to Excel, and recreating queries, formulas and charts. It took time and introduced opportunities for inconsistent cleanup and manual error. The testing team needed quick turnaround because several experiments could run in a day."
      ),
    ],
  },

  heading(2, "The architectural decision"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I automated data import, validation/cleanup, normalization, calculation, and presentation in Python rather than trying to optimize the manual steps separately. This made the procedure repeatable, reduced ad hoc copy/paste activity, and established a common structure for downstream analysis. The app combined data engineering with application delivery instead of remaining a collection of disconnected analyst scripts."
      ),
    ],
  },

  heading(2, "Why this design"),

  {
    kind: "paragraph",
    segments: [
      b("One workflow instead of repeated manual handoffs."),
      t(
        " Users could focus on outcomes rather than reproducing preparation steps in multiple tools."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Repeatability and quality."),
      t(
        " Standardized parsing, transformation and checks reduced variation between experiment runs. Source documents describe improved data consistency and insights, but no independent error-rate reduction was measured."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Rapid engineering feedback."),
      t(
        " Faster access to comparable outputs helped testing and engineering teams inspect experimental behavior and refine the power-system prototypes."
      ),
    ],
  },

  heading(2, "Trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Automation requires maintenance when experiment log formats, sensors, test protocols or analysis requirements change. Results also depend on correct assumptions in parsing and calculations; automated speed is not itself proof of scientific accuracy. Source data validation and traceability remained necessary."
      ),
    ],
  },

  heading(2, "Outcome"),

  {
    kind: "paragraph",
    segments: [
      t("A previously manual analysis workflow was reduced from "),
      b("~45 minutes to ~7 seconds per experiment"),
      t(
        ", according to the testing team. More consistent data preparation reduced repetitive work and made experimental findings available sooner. It also describe standardized storage and repeated use of research results across teams."
      ),
    ],
  },
];
