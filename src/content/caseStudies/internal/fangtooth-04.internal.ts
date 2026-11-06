import { b, c, heading, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for Case Study 04.
 *
 * Imported exclusively by `registry.internal.ts`. Public builds never reference
 * this module, so none of this prose, its endpoint table, or its Mermaid source
 * reaches `build/`.
 */
export const internalSections: InternalSectionGroup[] = [
  {
    afterSectionId: "financial-data-context-distinct-from-rag",
    blocks: [
      heading(
        2,
        "Backend Orchestration & Streaming Lifecycle",
        "6-backend-orchestration-streaming-lifecycle"
      ),

      {
        kind: "paragraph",
        segments: [
          t(
            "The Python API gateway controls the chat lifecycle: validates the request, locates the engagement/company workspace, resolves selected financial sources, determines the connector and model, assembles conversation context, streams inference results, and persists the exchange."
          ),
        ],
      },
      {
        kind: "mermaid",
        label: "Backend orchestration and streaming lifecycle sequence",
        chart: `sequenceDiagram
    autonumber
    participant UI as Excel AI Chat UI
    participant API as FastAPI API Gateway
    participant DB as SQLite Thread Store
    participant FIN as Financial Query Formulator
    participant RAG as RAG Retrieval / Inference
    participant Q as Qdrant
    participant O as Ollama
    participant EXT as External LLM Provider

    UI->>API: POST /api/fangtooth_ai/stream_chat
    API->>DB: Resolve workspace / create or load thread
    opt Selected financial sources
        API->>FIN: resolveChatSources(source selectors)
        FIN-->>API: Structured data + completeness + errors
    end
    API->>DB: Load bounded prior conversation (if enabled)
    DB-->>API: Relevant recent messages

    alt Fangtooth self-hosted model, RAG enabled
        API->>RAG: stream_chat() with selected data and history
        RAG->>Q: Similarity search with optional file filter
        Q-->>RAG: Retrieved passages
        Note over RAG,O: Assemble system prompt, data, passages,
        Note over RAG,O: recent history and current message
        RAG->>O: Stream selected chat model
        O-->>RAG: Content / optional reasoning deltas
        RAG-->>API: Normalized content / reasoning events
    else Fangtooth self-hosted model, RAG disabled
        API->>RAG: stream_chat() without retrieval
        RAG->>O: Stream current message with structured context
        O-->>RAG: Content / optional reasoning deltas
        RAG-->>API: Normalized events
    else External AI provider
        Note over API,EXT: No Qdrant retrieval on this route
        API->>EXT: System prompt + bounded history + inline supported file text + structured data
        EXT-->>API: Provider-native streaming response
    end

    API-->>UI: SSE chat.completion.chunk events
    API->>DB: Persist user message and assistant response
    API-->>UI: Final chunk + [DONE]`,
        outline: [
          "The chat UI posts to the streaming endpoint; the gateway resolves the workspace and thread.",
          "Selected financial sources are resolved deterministically and attached with completeness and errors.",
          "The self-hosted path retrieves from Qdrant and streams from Ollama; RAG can be disabled.",
          "The external provider path skips Qdrant and streams provider-native responses.",
          "The UI receives normalized SSE chunks, and the exchange is persisted.",
        ],
      },
      {
        kind: "note",
        segments: [
          t(
            "The sequence is an architectural simplification of the implemented chat route. On the Ollama branch, "
          ),
          c("rag/retrieve.py"),
          t(
            " owns both retrieval and inference. The UI receives normalized SSE events; "
          ),
          c("AI Insights"),
          t(" uses a different token-oriented SSE contract."),
        ],
      },
      {
        kind: "paragraph",
        segments: [b("Representative endpoints")],
      },
      {
        kind: "table",
        headers: [
          [b("API (production prefix shown)")],
          [b("Function")],
        ],
        rows: [
          [
            [c("GET /api/fangtooth_ai/workspace_thread_names")],
            [t("Retrieve or provision workspace and list threads.")],
          ],
          [
            [c("POST /api/fangtooth_ai/upload_docs")],
            [
              t(
                "Upload and ingest documents or retain images for chat-time handling."
              ),
            ],
          ],
          [
            [c("POST /api/fangtooth_ai/stream_chat")],
            [
              t(
                "Build context, route the selected model, and stream AI Chat responses."
              ),
            ],
          ],
          [
            [c("POST /api/fangtooth_ai/workspace_thread_chat_history")],
            [t("Retrieve persisted thread messages.")],
          ],
          [
            [c("POST /api/ai-insights/analyze")],
            [
              t(
                "Run configured AI Insights analysis with provider-specific streaming."
              ),
            ],
          ],
          [
            [c("GET /api/ai-insights/connectors/models")],
            [t("Enumerate configured provider/model options.")],
          ],
        ],
      },
    ],
  },
];
