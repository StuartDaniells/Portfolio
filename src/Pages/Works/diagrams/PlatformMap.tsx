import { FANGTOOTH_PLATFORM_MAP } from "../../../content/fangtoothPlatformMap";
import MermaidDiagram from "./MermaidDiagram";

/**
 * Text equivalent of the map: read out when the diagram is present, shown in
 * full if the renderer cannot load.
 */
const PlatformMapOutline = () => (
  <div className="max-w-reading text-tiny leading-relaxed text-works-muted">
    <p className="font-medium text-works-text">
      Connections shown in the platform map
    </p>
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      <li>
        <span className="font-medium text-works-text">
          Case study 01 &mdash; Hybrid Excel &amp; Local Backend:
        </span>{" "}
        the Excel task pane (Office.js + Vue 3) exchanges application requests
        and results with a locally deployed FastAPI service.
      </li>
      <li>
        <span className="font-medium text-works-text">
          Case study 02 &mdash; Configuration-Driven Analytics:
        </span>{" "}
        a JSON DSL of analytical definitions is compiled into SQL and executed
        by DuckDB over local Parquet financial datasets.
      </li>
      <li>
        <span className="font-medium text-works-text">
          Case study 03 &mdash; Cloud Gateway &amp; Security:
        </span>{" "}
        Azure Functions provides sign-in, session services and a reference-data
        gateway, exchanging reference rates with Azure SQL.
      </li>
      <li>
        <span className="font-medium text-works-text">
          Case study 04 &mdash; LLM Orchestration &amp; RAG:
        </span>{" "}
        backend AI orchestration assembles prompt and context, calls document
        retrieval (LlamaIndex + Qdrant) only for document-grounded chat, and
        sends model requests to Ollama or external providers.
      </li>
      <li>
        <span className="font-medium text-works-text">
          Between case studies:
        </span>{" "}
        the local service exchanges deterministic queries and results with the
        analytics engine; the task pane claims sign-in and session with Azure
        Functions; the local service can call Azure Functions for session
        validation and rate lookups; and the local service exchanges AI
        requests, selected financial results and streamed responses with AI
        orchestration.
      </li>
      <li>
        The four zones are case studies, not sequential execution stages.
        Services such as Qdrant and the model providers may receive AI-related
        data, so AI processing is not entirely local.
      </li>
    </ul>
  </div>
);

const PlatformMap = () => (
  <>
    <h3 className="works-subhead">Platform Architecture Overview</h3>

    <figure className="mt-4">
      <MermaidDiagram
        chart={FANGTOOTH_PLATFORM_MAP}
        label="Fangtooth platform architecture overview"
        outline={<PlatformMapOutline />}
      />
      <figcaption className="mt-4 text-pretty text-tiny leading-relaxed text-works-muted">
        The architecture overview shows how the platform components interact.
        Explore each case study below for the technical decisions and trade-offs.
      </figcaption>
    </figure>
  </>
);

export default PlatformMap;
