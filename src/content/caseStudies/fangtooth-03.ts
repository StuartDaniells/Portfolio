import { b, heading, i, t, type CaseStudyBlock } from "./types";

/**
 * Fangtooth Case Study 03 - Serverless Cloud Gateway.
 * Extracted from the approved source document. Review-only sections,
 * private repository links, and engineering verification sections are
 * excluded.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview", "1-overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I architected a serverless cloud integration layer for Fangtooth, connecting a locally executed financial analytics platform with centralized authentication, reference-data services, and software distribution."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "Built using Python-based Azure Functions, the architecture separates cloud-facing responsibilities from computationally intensive financial processing. It enables desktop clients to authenticate through a centralized identity provider, retrieve tax and foreign exchange reference data without direct database access, and obtain software installers through controlled download workflows."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The central architectural decision was to establish "),
      b(
        "a shared, lightweight cloud gateway while keeping financial processing and customer datasets on the user's machine."
      ),
    ],
  },

  heading(2, "System Architecture", "2-system-architecture"),

  {
    kind: "mermaid",
    label: "Serverless cloud gateway system architecture",
    chart: `flowchart TB
    subgraph CLIENT["User's Windows Machine"]
        EXCEL["Excel Task Pane\nOffice.js + Vue 3"]
        LOCAL["Local FastAPI Service\nFinancial Analytics + Reference Lookups"]
        CACHE[("SQLite Cache\nTax + FX Rates")]
    end

    subgraph AZURE["Azure - Shared Integration Boundary"]
        FA["Azure Function App\nPython · HTTP Endpoints"]
        TABLE[("Azure Table Storage\nAuth Flows · Sessions\nDownload Tokens · MSI Status")]
        SQL[("Azure SQL\nRead-only Tax / FX Data")]
        KV["Azure Key Vault\nIdentity and R2 Secrets"]
    end

    subgraph EXTERNAL["External Services"]
        KINDE["Kinde\nOAuth 2.0 + PKCE"]
        SPA["Cloudflare R2\nFrontend Assets"]
        MSI["Cloudflare R2\nMSI Installer Object"]
    end

    SPA -->|"Serve Task Pane Assets"| EXCEL
    EXCEL -->|"Local Analytics Requests"| LOCAL
    LOCAL <--> CACHE
    EXCEL -->|"OAuth / Session Claim / Download Request"| FA
    LOCAL -->|"Session Validation Cache Miss / Tax-FX Requests"| FA
    FA <--> |"OAuth Redirect / Token Exchange"| KINDE
    FA <--> |"Session and Download State"| TABLE
    FA -->|"Read-only SQL Queries"| SQL
    FA -->|"Resolve Credentials"| KV
    FA -->|"Generate Time-limited Object URL"| MSI
    EXCEL -.->|"Download MSI via Brokered URL"| MSI`,
    outline: [
      "The user's machine runs the Excel task pane, the local FastAPI service, and a SQLite rate cache.",
      "Azure Functions coordinates OAuth with Kinde, stores session/download state in Azure Table Storage, and queries read-only Azure SQL.",
      "Azure Key Vault supplies identity and Cloudflare R2 credentials to the Function App.",
      "Cloudflare R2 serves frontend assets and the MSI installer object through a brokered, time-limited URL.",
    ],
  },
  {
    kind: "note",
    segments: [
      t(
        "Diagram note: the chart represents distinct requests, not one mandatory sequential path. Cloudflare R2 serves frontend assets separately from its installer object. The Azure Function App does not run financial models or host customer Parquet datasets."
      ),
    ],
  },

  heading(2, "The Engineering Challenge", "3-the-engineering-challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Fangtooth's local-first architecture introduced requirements that could not be handled entirely within the desktop application."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The platform needed to authenticate users "),
      i("before"),
      t(
        " the local backend was installed, provide database access to clients with varying public IP addresses, and distribute application installers without granting unrestricted access to the installation download workflow."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The solution also needed to avoid embedding production Azure SQL credentials in distributed executables or introducing unnecessary remote requests into routine financial analytics."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The challenge was to design an integration layer that centralized identity, mediated shared services, and supported application delivery without turning the local analytics engine into a cloud-dependent service."
      ),
    ],
  },

  heading(2, "Key Architectural Decisions", "5-key-architectural-decisions"),

  {
    kind: "paragraph",
    segments: [
      b("Separate identity authority from local computation."),
      t(
        " Kinde manages OAuth sign-in, the Azure Function App coordinates authentication and opaque session issuance, and local FastAPI does not need to manage user passwords or initiate the OAuth callback flow."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Keep session bootstrap independent of backend installation."),
      t(
        " The browser facing frontend calls Azure Functions directly for sign-in and session claiming, allowing a first-time user to authenticate and obtain an installer before a local service exists."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Mediate shared SQL access through a controlled cloud service."),
      t(
        " The Function App uses read-only Azure SQL credentials on a configured allowlisted network path, rather than requiring the ordinary desktop client to connect directly to the database."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Cache reference data locally."),
      t(
        " A SQLite mirror reduces repeated remote lookups and allows previously synchronized rates to be served locally. First-time synchronization and genuinely missing values may still require connectivity."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Separate static asset hosting from privileged distribution decisions."),
      t(
        " Cloudflare R2 holds frontend assets and the MSI object; Azure Functions brokers the download through a session check, a short-lived download token, and a presigned object URL."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Use dedicated state and secret stores."),
      t(
        " Azure Table Storage records auth flows, sessions, download-token state, and update status. Azure Key Vault supplies Kinde and R2 credentials for the hosted Function App, with environment-variable fallbacks for development."
      ),
    ],
  },

  heading(2, "Security Boundaries and Engineering Trade-offs", "6-security-boundaries-and-engineering-trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The gateway is not a blanket security perimeter around every HTTP route. Authentication is enforced for the MSI-link issuance path, whereas the reviewed rate and update-status handlers do not implement equivalent per-user session checks. Authorization should therefore be described by endpoint and operation, not assumed for the whole Function App."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The desktop backend's positive session-validation cache reduces repeated Azure calls but adds a revocation-latency trade-off: a previously validated session can remain cached until its local TTL expires. The project documentation specifies a two-hour positive-cache TTL."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The cloud download token is intended for one-time use; the subsequent R2 presigned URL is time-limited, "),
      b("not guaranteed single-use"),
      t(
        ". The implementation marks the token used before returning the R2 redirect, but one-time behavior under simultaneous requests should not be described as formally atomic without testing."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The architecture also introduces a dependency on a cloud integration layer for new sign-ins, first-time reference-data synchronization, and installer distribution. It intentionally keeps ordinary financial analysis within the local backend."
      ),
    ],
  },

  heading(2, "Outcome", "7-outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The design establishes a distinct cloud integration boundary for a local-first financial application. It allows users to authenticate and retrieve an installer before a backend exists, gives distributed clients a common read-only path to tax and FX reference data, and preserves the local analytical execution model."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The result is a modular division of responsibility: "),
      b(
        "local services perform financial computation; Azure Functions coordinates identity, shared reference-data access, and delivery workflows; Cloudflare R2 distributes application assets."
      ),
    ],
  }
];
