import { b, c, heading, i, t, type CaseStudyBlock } from "./types";

/**
 * AlumaPower Case Study 01 - Ops Vista 2.0 industrial telemetry.
 * Public sections transcribed from the approved source document. The
 * terminal internal verification notes live in `internal/alumapower-01.internal.ts`
 * and are excluded from public builds.
 */
export const body: CaseStudyBlock[] = [
  heading(2, "Overview"),

  {
    kind: "paragraph",
    segments: [
      t(
        "I helped design, build, and evolve Ops Vista, a cloud connected monitoring and control platform for experimental power systems. It replaced fragmented terminal-based telemetry monitoring and manual data handoffs with an interface for live sensor readings, remote equipment controls, and access to historical experiments."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The architectural challenge extended beyond displaying charts: "),
      b(
        "multiple hardware controllers transmitted high frequency data, binary telemetry under changing firmware and subsystem specifications, and different research and product development teams had distinct decoding, storage and data persistence requirements"
      ),
      t(
        ". Engineering teams needed to inspect live information without continuously decoding and storing every historical measurement, while preserving the original observations for later investigation. Horizontal research cells and vertical product development cells also used different communication/encoding requirements and needed independent deployment and scaling."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "My primary contribution was connecting these requirements into a service oriented design:   Python services, a managed WebSocket fan out layer, a raw analytical data store, selective   persistence, and reusable, metadata driven Vue screens. It was about "
      ),
      b("choosing boundaries and data representations to support changing hardware"),
      t(", not simply assembling cloud services together."),
    ],
  },

  heading(2, "Architecture and data flow"),
  {
    kind: "mermaid",
    label: "Ops Vista 2.0 deployment and data flow",
    chart: `flowchart TB
    HW["SCM hardware<br/>Multiple subsystems and sensors<br/>Device-origin timestamps"]
    BROKER["MQTT broker<br/>Telemetry and control topics"]
    ROUTE{"Hardware family"}

    subgraph HC["Horizontal-cell service boundary · Azure App Service Plan A"]
      H["Horizontal Python App Service<br/>Protocol-specific parsing · queues · decoding"]
    end
    subgraph VC["Vertical-cell service boundary · Azure App Service Plan B"]
      V["Vertical Python App Service<br/>Protocol-specific parsing · queues · decoding"]
    end

    ADX[("Azure Data Explorer / Kusto<br/>Raw telemetry · system of record")]
    MONGO[("MongoDB Atlas<br/>Selected decoded experiments / analysis datasets")]
    PUB["Azure Web PubSub<br/>Groups / WebSocket fan out"]
    UI["Ops Vista · Vue client<br/>Live meters · historical queries · controls"]
    GRAF["Grafana / engineering analysis<br/>Historical KQL and configured live views"]
    FUNC["Shared Azure Functions<br/>Connection tokens · request/command gateway"]

    HW -->|"Timestamped binary packets"| BROKER
    BROKER -->|"MQTT subscriptions"| ROUTE
    ROUTE --> H
    ROUTE --> V
    H -->|"Batch raw frames"| ADX
    V -->|"Batch raw frames"| ADX
    H -->|"Decoded live payloads"| PUB
    V -->|"Decoded live payloads"| PUB
    PUB -->|"Group-based delivery"| UI
    ADX -->|"Selected time ranges for decoding"| H
    ADX -->|"Selected time ranges for decoding"| V
    H -->|"Persist requested decoded results"| MONGO
    V -->|"Persist requested decoded results"| MONGO
    MONGO -->|"Prepared records"| UI
    ADX -->|"KQL / time-series history"| GRAF
    UI -->|"Token / control requests"| FUNC
    FUNC -->|"Encoded commands via MQTT"| BROKER
    BROKER -->|"Control topics"| HW`,
    outline: [
      "SCM hardware sends timestamped binary packets to an MQTT broker.",
      "The broker routes telemetry by hardware family to one of two Python App Services: horizontal-cell or vertical-cell, each on its own App Service Plan.",
      "Both services batch raw frames into Azure Data Explorer (Kusto), the durable raw system of record.",
      "Both services publish decoded live payloads to Azure Web PubSub, which fans them out to the Vue client by group.",
      "Requested historical ranges are pulled from ADX, decoded, and persisted to MongoDB Atlas for prepared records shown in the UI.",
      "A shared Azure Function App handles connection tokens and control requests, sending encoded commands back through the MQTT broker to the hardware.",
      "Grafana analyzes historical Kusto data; its live views use whatever integration paths are configured for that deployment.",
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Reading the diagram:"),
      t(" Each hardware family has its own processing/deployment boundary; the diagram does not mean that one message passes through "),
      i("both"),
      t(
        " services. The services share architectural responsibilities, but not necessarily identical codecs, schemas, subscriptions, configuration, or autoscale thresholds. Web PubSub distributes application facing live updates; ADX is the durable raw store; MongoDB contains decoded selections rather than a continuously materialized copy of every raw reading. Grafana can analyze historical Kusto data, with live views using the integration paths configured for their deployment."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("What arrived from hardware."),
      t(
        " The SCM boards sent timestamps together with raw sensor payloads. There could be multiple simultaneous SCMs, each containing several subsystems and sensors. A representative individual sensor reported at roughly "
      ),
      b("150–250 ms intervals"),
      t(
        ", but sensor transmissions were not guaranteed to align. The backend could also record ingestion times for operational reasons."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      b("Two intentionally different processing modes."),
      t(
        " For live monitoring, the service decoded the relevant incoming data and published a compact representation to client groups. For historical analysis, a requested interval could be retrieved from Kusto, decoded for the purpose at hand and stored in MongoDB Atlas for downstream analysis. Experiments with no analytical relevance did not need their entire raw history permanently decoded into MongoDB. The reviewed horizontal source also supports experiment triggered decoded logging; the important architectural rule is "
      ),
      b("selective persistence"),
      t(
        ", not a claim that decoding happens only after a historical user request."
      ),
    ],
  },

  heading(2, "The challenge"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Initially, operators used MQTT command-line subscriptions and files to interpret data as it arrived. The volume and velocity made it difficult to locate relevant values or construct comparable experimental views. Manual processing and repeated export of raw observations consumed engineering time. In an early Web SCM phase, an ingestion gap was detected by comparing data recorded at different points, including retained MQTT logs and persisted records. The corrective move to Azure Data Explorer "
      ),
      b("preceded Ops Vista 2.0.")
    ],
  },

  heading(3, "Architectural evolution (not a single release)"),

  {
    kind: "mermaid",
    label: "SCM to Ops Vista 2.0 evolution",
    chart: `flowchart LR
    C["Early Web SCM<br/>CLI-assisted monitoring and controls"]
    I["Ingestion investigation<br/>Data gaps identified across logs and storage"]
    A["Early storage revision<br/>Raw telemetry moved to ADX"]
    O["Ops Vista 2.0<br/>Schema driven UI and service boundaries"]
    H["Horizontal service<br/>Separate App Service Plan"]
    V["Vertical service<br/>Separate App Service Plan"]
    C --> I --> A --> O
    O --> H
    O --> V`,
    outline: [
      "Early Web SCM provided CLI-assisted monitoring and controls.",
      "An ingestion investigation identified data gaps across logs and storage.",
      "An early storage revision moved raw telemetry to Azure Data Explorer.",
      "Ops Vista 2.0 introduced schema driven UI and service boundaries.",
      "From 2.0, horizontal and vertical services run on separate App Service Plans.",
      "The storage incident and initial ADX adoption belong to the earlier Web SCM evolution, not the 2.0 release.",
    ],
  },

  {
    kind: "paragraph",
    segments: [
      i(
        "The storage incident and initial ADX adoption belong to the earlier Web SCM evolution. The later 2.0 change addressed system boundaries, live delivery, device diversity and development agility."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The later challenge was "),
      b("agility under hardware change"),
      t(
        ". New sensors and subsystems arrived as hardware and firmware changed. Rebuilding individual interface screens and deploying an entire backend for each schema adjustment was a poor fit for frequent engineering iteration. Horizontal and vertical battery systems also differed in protocol and decoding rules; their operational needs and number of deployed units were not necessarily the same."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "At the same time, broadcasting all incoming data at full rate to every browser would make the UI and network carry detail that users did not need, and storing every reading in a decoded transactional collection would create needless transformation and storage work. An idle connection issue also interrupted delivery to some live view consumers until a heartbeat mechanism was introduced."
      ),
    ],
  },

  heading(2, "The architectural decision"),

  heading(3, "Preserve raw truth, compute derived views selectively"),
  {
    kind: "paragraph",
    segments: [
      b("Azure Data Explorer (Kusto)"),
      t(
        " was chosen as the analytical store for raw, high frequency telemetry. It preserved original device readings, their device timestamps, and the ability to retrieve historical windows for re-decoding when processing logic or questions changed. "
      ),
      b("MongoDB Atlas"),
      t(
        " served a different purpose: holding decoded, structured data when required for specific experiments, repeat access, or application workflows. Kusto was the analytical (OLAP oriented) store, "
      ),
      b("not an OLTP database"),
      t(
        ", and MongoDB was not represented as the primary storage for every high rate raw packet."
      ),
    ],
  },

  heading(3, "Separate   runtimes, not every small function"),
  {
    kind: "paragraph",
    segments: [
      t("I separated horizontal and vertical decoding into "),
      b("distinct Python Azure App Services on different App Service Plans"),
      t(
        ". Their primary reason for separation was the hardware protocol and encoding/decoding differences. This also established distinct deployment and autoscaling boundaries, with threshold triggered scale behaviour configured per environment. Within each service, related responsibilities could be combined: MQTT subscription, raw Kusto ingestion, live processing, and requested decoding. That reduced the number of standalone per SCM services while preserving isolation across hardware families."
      ),
    ],
  },

  heading(3, "Use a browser facing distribution layer"),
  {
    kind: "paragraph",
    segments: [
      t("Each service consumed MQTT messages and published suitable live output to "),
      b("Azure Web PubSub groups"),
      t(
        ". Vue clients subscribed to the appropriate group rather than each browser maintaining a direct broker integration. Web PubSub was selected for managed WebSocket delivery and client integration, "
      ),
      b("not because MQTT is intrinsically impossible to use from browsers"),
      t(
        ". The shared Azure Function App handled connection-token generation and remote-control/encoding requests. The broker continued to serve the hardware-facing MQTT side."
      ),
    ],
  },

  heading(3, "Use Protocol Buffers as both a contract and a transport format"),
  {
    kind: "paragraph",
    segments: [
      t(
        "Protobuf definitions specified typed payload structures and supported compact serialization. The definitions also contained sensor metadata such as labels and units; the Azure App Service extracted that metadata and delivered it to the Vue interface. This supported reusable metering components that could adapt to additional sensor groups after schema and application deployment, rather than creating an unrelated new page and mapping logic for each sensor."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t(
        "The configuration/schema approach complemented short release cycles and CI/CD: teams could introduce new firmware-defined subsystems by updating contracts and compatible services rather than constructing bespoke monitoring pages for every sensor set. Node-RED was also used as a supporting integration/operations tool; it is not drawn as a required stage for every message."
      ),
    ],
  },

  heading(3, "Keep liveness, buffering and recovery explicit"),
  {
    kind: "paragraph",
    segments: [
      t(
        "Per-SCM processing and bounded queues separated incoming traffic from batched writes and less frequent client updates. The horizontal service README documents per-SCM workers, batching, state snapshots and periodic live fan out; the precise timing and feature parity vary by release. Following an observed idle-stream issue, a "
      ),
      b("five-minute application heartbeat"),
      t(
        " was added and resolved the symptom in the deployment discussed. That is a targeted operational improvement, not evidence of guaranteed delivery, zero packet loss or continuous uptime."
      ),
    ],
  },

  heading(2, "Why this design"),

  {
    kind: "table",
    headers: [
      [t("Decision")],
      [t("Alternative / limitation considered")],
      [t("Engineering rationale")],
    ],
    rows: [
      [
        [t("Retain original data in ADX")],
        [t("Permanently decode every packet into MongoDB")],
        [
          t(
            "Keep a reusable raw record; transform only the ranges and experiments that need analysis"
          ),
        ],
      ],
      [
        [t("Two App Services / Plans")],
        [t("One shared decoder service for different cell families")],
        [
          t(
            "Avoid codec coupling and enable family specific deployments and autoscaling"
          ),
        ],
      ],
      [
        [t("Shared worker processes per SCM")],
        [t("One Azure service per controller")],
        [
          t(
            "Reduce repeated service setup while retaining isolation within the processing model"
          ),
        ],
      ],
      [
        [t("PubSub groups for the UI")],
        [t("Direct MQTT connections for each front-end consumer")],
        [
          t(
            "Centralize browser facing real time distribution and simplify client integration"
          ),
        ],
      ],
      [
        [t("Protobuf-driven UI metadata")],
        [t("Hand-build every sensor page")],
        [
          t(
            "Evolve sensor contracts and metering components together with fewer duplicated screens"
          ),
        ],
      ],
      [
        [t("Batched raw ingestion and paced client updates")],
        [t("Forward/store every reading immediately to every downstream system")],
        [
          t(
            "Balance analytical fidelity, UI usability, processing overhead and data freshness"
          ),
        ],
      ],
    ],
  },

  {
    kind: "paragraph",
    segments: [
      t("The important trade-off is not that any one technology is always fastest. It is that the "),
      b("data path reflects how the information is consumed"),
      t(
        ": preserve original observations, stream a usable live projection, and persist structured historical selections on purpose."
      ),
    ],
  },

  heading(2, "Trade-offs"),

  {
    kind: "paragraph",
    segments: [
      t(
        "This architecture introduced coordination among cloud plans, the MQTT broker, functions, database connections, Protobuf schemas, frontend versions and WebSocket groups. Separate scale boundaries do not eliminate shared dependencies or guarantee that scaling is free of duplicate broker subscriptions; MQTT consumer ownership and concurrency must be designed deliberately. Batching introduces a persistence-latency window. Selective historical decoding trades computation on demand for avoiding a permanently expanded decoded dataset. Proto changes require compatibility discipline, not just a redeploy. Heartbeats reduce one idle-time failure mode but do not substitute for end-to-end delivery acknowledgement or loss monitoring."
      ),
    ],
  },

  heading(2, "Outcome"),

  {
    kind: "paragraph",
    segments: [
      t(
        "Ops Vista 2.0 brought live industrial monitoring, equipment interaction and historical analysis into a common application. Engineering teams could consume meaningful telemetry without reading continuous terminal output, retrieve raw historical periods for targeted decoding, and work from structured sensor definitions as devices changed. Separate horizontal and vertical service plans supported independent release cycles and threshold-based scale decisions, while the raw/decoded storage split avoided treating every experiment as a permanent MongoDB transformation job."
      ),
    ],
  },
  {
    kind: "paragraph",
    segments: [
      t("The platform also supported real time monitoring and customer facing demonstrations across the product's earlier evolution. The contribution demonstrated here is "),
      b(
        "systems level judgment across protocol boundaries, storage choices, deployment isolation, transport, and developer iteration."
      )
    ],
  },
];
