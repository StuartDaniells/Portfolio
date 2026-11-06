import { b, c, heading, i, t, type CaseStudyBlock } from "./types";

/**
 * Fangtooth Case Study 03 — Serverless Cloud Gateway.
 * Extracted from the approved source document. Review-only sections,
 * private repository links, and engineering verification sections are
 * excluded.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "1. Overview"),

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

  heading(2, "2. System Architecture"),

  {
    kind: "mermaid",
    label: "Serverless cloud gateway system architecture",
    chart: `flowchart TB
    subgraph CLIENT["User's Windows Machine"]
        EXCEL["Excel Task Pane\nOffice.js + Vue 3"]
        LOCAL["Local FastAPI Service\nFinancial Analytics + Reference Lookups"]
        CACHE[("SQLite Cache\nTax + FX Rates")]
    end

    subgraph AZURE["Azure — Shared Integration Boundary"]
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

  heading(2, "3. The Engineering Challenge"),

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

  heading(2, "4. Three Integration Workflows"),

  heading(3, "A. Authentication and Session Lifecycle"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Rather than implementing an independent identity system in the Windows backend, Fangtooth delegates sign-in to Kinde through Azure Functions. The Function App generates a PKCE authorization flow, stores transient state in Azure Table Storage, exchanges the OAuth authorization code, and issues an opaque application session token. The frontend can complete this process even when the desktop backend has not yet been installed."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Authentication and session lifecycle sequence",
    chart: `sequenceDiagram
    autonumber
    participant UI as Vue Task Pane / Browser
    participant FA as Azure Function App
    participant T as Azure Table Storage
    participant K as Kinde OAuth
    participant BE as Local FastAPI

    UI->>FA: POST /api/auth/start-prod {uuid}
    FA->>T: Store pending AuthFlow (state, verifier, correlationId)
    FA-->>UI: authorizeUrl + correlationId
    UI->>K: Redirect for user sign-in (OAuth + PKCE)
    K->>FA: GET /api/auth/callback-prod?code=...&state=...
    FA->>T: Lookup and check pending AuthFlow
    FA->>K: Exchange code + PKCE verifier for tokens
    FA->>T: Store Session + mark AuthFlow ready
    FA-->>UI: Redirect to auth-complete page
    UI->>FA: POST /api/auth/session/claim {correlationId, uuid}
    FA->>T: Retrieve session, mark flow claimed
    FA-->>UI: sessionToken + userId
    UI->>BE: POST /auth/validate {sessionToken, uuid}
    alt FastAPI positive validation cache hit
        BE-->>UI: valid = true
    else Cache miss
        BE->>FA: POST /api/auth/validate
        FA->>T: Check session, UUID, expiry, revoked flag
        FA-->>BE: valid / invalid
        BE-->>UI: Session validation result
    end`,
    outline: [
      "The frontend starts a PKCE authorization flow through Azure Functions.",
      "The Function App stores pending state, exchanges the authorization code with Kinde, and stores a session.",
      "The frontend claims a session token and validates it through the local FastAPI service.",
      "On a cache miss, FastAPI defers to the Function App, which checks session, UUID, expiry, and revocation in Table Storage.",
    ],
  },
  {
    kind: "note",
    segments: [
      t("Development uses the corresponding "),
      c("start-dev"),
      t(" and "),
      c("callback-dev"),
      t(
        " endpoints. The local FastAPI layer caches positive session validation results; Azure Functions and Table Storage remain the session authority. The cloud session claim is deliberately independent of the local backend."
      ),
    ],
  },

  heading(3, "B. Centralized Tax and FX Reference Data"),

  {
    kind: "paragraph",
    segments: [
      t(
        "A desktop application cannot assume that every client's public IP can be allowlisted against Azure SQL. Rather than distributing SQL credentials and requiring direct client-to-database connections, the design routes shared reference-data queries through the Azure Function App."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The local FastAPI service keeps a SQLite copy of reference rates. It performs a full synchronization when the local database is absent, uses background refresh for stale data, and can request individual rates when a lookup misses the cache. The cloud proxy exposes targeted, read-only rate and sync endpoints backed by Azure SQL."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Centralized tax and FX reference data sequence",
    chart: `sequenceDiagram
    autonumber
    participant UI as Excel Task Pane
    participant BE as Local FastAPI
    participant DB as Local SQLite
    participant FA as Azure Function App
    participant SQL as Azure SQL

    UI->>BE: POST /api/fx_rate (or tax-rate endpoint)
    BE->>DB: Read local rate / check cache freshness
    alt Matching cached record
        DB-->>BE: Rate
        BE-->>UI: JSON result
    else Missing rate or initial synchronization
        BE->>FA: HTTPS GET /api/rates/fx or rate lookup
        FA->>SQL: Parameterized SELECT with read-only credentials
        SQL-->>FA: Requested rows
        FA-->>BE: JSON reference data
        BE->>DB: Store or update cached records
        BE-->>UI: Rate result
    end
    opt Background refresh of stale cache
        BE->>FA: GET rate data / sync request
        FA->>SQL: Read reference data
        SQL-->>FA: Updated rows
        FA-->>BE: Reference data
        BE->>DB: Apply refresh
    end`,
    outline: [
      "The task pane requests a rate from the local FastAPI service.",
      "A local SQLite cache hit is returned directly.",
      "On a miss or initial sync, FastAPI requests reference data through the Azure Function App, which performs a read-only Azure SQL query.",
      "Returned rows are cached locally; stale caches are refreshed in the background.",
    ],
  },
  {
    kind: "note",
    segments: [
      t(
        "The core local financial datasets are not sent to Azure SQL. SQLite stores shared tax and FX reference data, not a cloud copy of the client's general ledger."
      ),
    ],
  },

  heading(3, "C. Session-Gated MSI Distribution and Update Status"),

  {
    kind: "paragraph",
    segments: [
      t(
        "The application must be available for installation or upgrade even before the FastAPI executable is running. A separate cloud-managed download path addresses this bootstrap requirement."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "After signing in, the frontend requests an installer download link from Azure Functions. The Function App validates the session, stores a short-lived download-token record, and returns a brokered download URL. When followed, the proxy marks that download token as used and redirects to a time-limited Cloudflare R2 presigned object URL."
      ),
    ],
  },
  {
    kind: "mermaid",
    label: "Session-gated MSI distribution sequence",
    chart: `sequenceDiagram
    autonumber
    participant UI as Authenticated Frontend
    participant FA as Azure Function App
    participant T as Azure Table Storage
    participant R2 as Cloudflare R2
    participant WIN as Windows Installer

    UI->>FA: POST /api/download/msi-url {sessionToken, uuid}
    FA->>T: Validate session and create DownloadToken
    FA-->>UI: downloadUrl
    UI->>FA: GET /api/download/msi/{token}
    FA->>T: Check token expiry / used state, mark used
    FA->>R2: Generate presigned MSI object URL
    FA-->>UI: HTTP 302 redirect
    UI->>R2: GET signed object URL
    R2-->>UI: MSI installer
    UI->>WIN: Launch installation / upgrade`,
    outline: [
      "The authenticated frontend requests an MSI download URL from Azure Functions.",
      "The Function App validates the session and creates a short-lived download token.",
      "Following the brokered URL marks the token used and redirects to a time-limited Cloudflare R2 object URL.",
      "The installer downloads and launches.",
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("A separate "),
      c("GET /api/update/msi-status?env=prod|dev"),
      t(
        " endpoint reads update-availability and version information from Azure Table Storage. It communicates update status; it is "
      ),
      b("not"),
      t(" the executable installation/update mechanism itself."),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The MSI is code-signed, as confirmed by the project owner; the Azure proxy handles "),
      i("delivery authorization and download brokerage"),
      t(", not the Windows signing operation."),
    ],
  },

  heading(2, "5. Key Architectural Decisions"),

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
        " The browser-facing frontend calls Azure Functions directly for sign-in and session claiming, allowing a first-time user to authenticate and obtain an installer before a local service exists."
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

  heading(2, "6. Security Boundaries and Engineering Trade-offs"),

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

  heading(2, "7. Outcome"),

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
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "No quantified uptime, latency, cost-savings, or security-audit results are asserted for this case study because supporting project benchmarks have not been supplied."
      ),
    ],
  },
];
