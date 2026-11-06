/**
 * Source for the verified Fangtooth platform map shown on the Works index.
 * Mirrors `fangtooth_platform_map_verified.mmd`.
 *
 * The four subgraphs are case studies, not sequential execution stages. This is
 * a portfolio-level conceptual overview, not a deployment topology or a
 * security audit.
 *
 * Verification inputs (development only - never published): section 7.1 of
 * ARCHITECTURE_WIRE_DIAGRAMS.md and ARCHITECTURE.md, AUTH_FLOW.md,
 * FRONTEND_DEPLOYMENT_GUIDE.md, README.md and api_gateway.py.
 */
export const FANGTOOTH_PLATFORM_MAP = `flowchart LR
    subgraph CS1["CASE STUDY 01 · Hybrid Excel & Local Backend"]
        UI["Excel task pane<br/>Office.js + Vue 3"]
        API["Local Python service<br/>FastAPI"]
        UI <-->|"Application requests / results"| API
    end

    subgraph CS2["CASE STUDY 02 · Configuration-Driven Analytics"]
        DSL["JSON DSL<br/>Analytical definitions"]
        QUERY["SQL generation + DuckDB<br/>Parquet financial datasets"]
        DSL --> QUERY
    end

    subgraph CS3["CASE STUDY 03 · Cloud Gateway & Security"]
        FA["Azure Functions<br/>Sign-in, session services,<br/>reference-data gateway"]
        AZSQL["Azure SQL<br/>reference rates"]
        FA <-->|"Reference-data access"| AZSQL
    end

    subgraph CS4["CASE STUDY 04 · LLM Orchestration & RAG"]
        AI["Backend AI orchestration<br/>Prompt + context assembly"]
        RAG["Document retrieval<br/>LlamaIndex + Qdrant"]
        MODELS["Inference providers<br/>Ollama / external LLMs"]
        AI -.->|"Document-grounded chat only"| RAG
        AI -->|"Model request"| MODELS
    end

    API <-->|"Deterministic queries / results"| QUERY
    UI <-->|"Sign-in and session claim"| FA
    API -.->|"Session validation / rate lookups"| FA
    API <-->|"AI requests, selected financial results,<br/>streamed responses"| AI`;
