import { b, c, heading, i, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for Case Study 03.
 *
 * Imported exclusively by `registry.internal.ts`. Public builds never reference
 * this module, so none of this prose, its subsections, or its three Mermaid
 * sources reach `build/`.
 */
export const internalSections: InternalSectionGroup[] = [
  {
    afterSectionId: "the-engineering-challenge",
    blocks: [
      heading(2, "Three Integration Workflows", "4-three-integration-workflows"),

      heading(
        3,
        "Authentication and Session Lifecycle",
        "a-authentication-and-session-lifecycle"
      ),

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

      heading(
        3,
        "Centralized Tax and FX Reference Data",
        "b-centralized-tax-and-fx-reference-data"
      ),

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

      heading(
        3,
        "Session-Gated MSI Distribution and Update Status",
        "c-session-gated-msi-distribution-and-update-status"
      ),

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
          t(
            "The MSI is code-signed, as confirmed by the project owner; the Azure proxy handles "
          ),
          i("delivery authorization and download brokerage"),
          t(", not the Windows signing operation."),
        ],
      },
    ],
  },
];
