import { b, c, heading, i, t, type InternalSectionGroup } from "../types";

/**
 * Internal-only sections for AlumaPower Case Study 01.
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
            b("Owner-confirmed final deployment versus archived code:"),
            t(
              " The owner explicitly confirmed that "
            ),
            b(
              "both horizontal and vertical deployed App Services had the relevant active paths"
            ),
            t(" (MQTT receive, raw ADX ingestion, live streaming, and selected/on-demand decode). The "),
            c("ap_sw_ops_vista_vertical_decoder/readme.md"),
            t(" in the provided "),
            c("ops-vista-2.0.0-workspace.7z"),
            t(" instead documents an "),
            b("earlier snapshot"),
            t(
              " where live Protobuf/Web PubSub and Mongo decoding were commented out. Treat the owner's statement as deployment evidence and the archive as source evidence for that snapshot; do not claim this archived commit itself implemented the final enabled vertical paths."
            ),
          ],
          [
            b("Horizontal source:"),
            t(" "),
            c("ap_sw_ops_vista_horizontal_decoder/readme.md"),
            t(
              " documents per SCM raw ADX batches, live Protobuf streaming, conditional decoded experiment logging, queue bounds, file-system state caching and connection maintenance. This confirms distinct "
            ),
            b("live decode"),
            t(" and "),
            b("historical / experiment persistence"),
            t(
              " behaviours. Avoid saying there is no live decoding until someone requests a historical interval."
            ),
          ],
          [
            b("Hardware timestamps:"),
            t(
              " The owner's architecture explanation says the SCM sends a timestamp and raw data; some archived code/readmes also add arrival UTC timestamps. Verify exact field names and provenance before making timestamp-precision claims."
            ),
          ],
          [
            b("Rate:"),
            t(" ~150–250 ms is an owner-estimated "),
            i("per individual sensor"),
            t(
              " interval, not one SCM-wide message rate or a throughput benchmark. Never multiply by unverified numbers of active SCMs to fabricate aggregate events/sec."
            ),
          ],
          [
            b("Protocol metadata:"),
            t(" Owner confirms "),
            c(".proto"),
            t(
              " definitions included labels/units and the backend delivered that metadata to Vue. Exact generation/reflection/serialization details have not been demonstrated in the archived code; phrase at architectural level."
            ),
          ],
          [
            b("Redis:"),
            t(
              " Not included in the main architecture because its active role in this deployed flow is not sufficiently substantiated by the examined service READMEs. Do not insert a Redis box based solely on a skills-list mention."
            ),
          ],
          [
            b("Live Grafana path:"),
            t(
              " Owner describes real time frontends that include Grafana-oriented consumers. Archive and diagram evidence also supports historical Grafana→ADX queries. Do not assert that Grafana natively subscribed to Web PubSub without verifying the adapter/plugin mechanism; the public diagram avoids that claim."
            ),
          ],
          [
            b("Heartbeat:"),
            t(
              " Owner confirms a five-minute application heartbeat resolved an idle-stream issue. README MQTT keepalive/status threads may be related but are not necessarily the "
            ),
            i("same"),
            t(" mechanism; do not equate them without source confirmation."),
          ],
          [
            b("Autoscaling:"),
            t(
              " Separate App Service Plans and threshold triggered autoscaling are owner-confirmed. Specific trigger percentages, instance count, scale-rule implementation and independent capacity limits were not provided."
            ),
          ],
          [
            b("Earlier evolution:"),
            t(
              " Cosmos retention/ingest discrepancy and ADX transition occurred before Ops Vista 2.0. Earlier Web SCM Purolator pilot is not a 2.0 delivery benchmark."
            ),
          ],
          [
            b("Confidentiality:"),
            t(
              " Sanitise any animation, video, screen capture and diagram; no private MQTT topics, identifiers, credentials, customer telemetry, actual control sequences, network IPs or private repository links."
            ),
          ],
          [
            b("Unsupported metrics:"),
            t(
              " Never publish billing figures, relative bandwidth percentages, absolute message loss, system uptime/SLA, latency guarantees or unmeasured throughput gains. Architecture/cost awareness is appropriate; financial impact claims are not."
            ),
          ],
        ],
      },
    ],
  },
];
