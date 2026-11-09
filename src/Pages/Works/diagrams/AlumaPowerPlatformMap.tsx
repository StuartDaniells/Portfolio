import { ALUMAPOWER_PLATFORM_MAP } from "../../../content/alumapowerPlatformMap";
import MermaidDiagram from "./MermaidDiagram";

/**
 * Text equivalent of the landscape map: read out when the diagram is present,
 * shown in full if the renderer cannot load.
 */
const LandscapeOutline = () => (
  <div className="max-w-reading text-tiny leading-relaxed text-works-muted">
    <p className="font-medium text-works-text">
      Areas of work shown in the engineering landscape
    </p>
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      <li>
        <span className="font-medium text-works-text">
          AlumaPower engineering work
        </span>{" "}
        is shown as four areas of responsibility, not as one combined
        application or a literal infrastructure topology.
      </li>
      <li>
        <span className="font-medium text-works-text">
          Industrial R&amp;D and product development:
        </span>{" "}
        Ops Vista 2.0 remote monitoring and control, and Experiment Analysis
        repeatable data processing.
      </li>
      <li>
        <span className="font-medium text-works-text">
          Shared systems and internal operations:
        </span>{" "}
        data infrastructure (central storage, backup and recovery), and
        enterprise applications (quality, fabrication and operations).
      </li>
      <li>
        No arrows connect the four boxes because no single integration spanning
        all four has been verified; detailed system flows appear in each case
        study.
      </li>
    </ul>
  </div>
);

const AlumaPowerPlatformMap = () => (
  <>
    <h3 className="works-subhead">Engineering Landscape Overview</h3>

    <figure className="mt-4">
      <MermaidDiagram
        chart={ALUMAPOWER_PLATFORM_MAP}
        label="AlumaPower engineering landscape overview"
        outline={<LandscapeOutline />}
      />
      <figcaption className="mt-4 text-pretty text-tiny leading-relaxed text-works-muted">
        Engineering landscape: four areas of work, not one combined application
        or a literal infrastructure topology. Detailed system flows appear in
        each case study.
      </figcaption>
    </figure>
  </>
);

export default AlumaPowerPlatformMap;
