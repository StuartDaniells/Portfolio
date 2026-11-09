/**
 * Source for the AlumaPower engineering-landscape map shown on the Works index.
 *
 * This is an organization-level conceptual overview: four areas of engineering
 * work, not one combined application or a literal infrastructure topology.
 * No arrows are drawn among the four boxes because no single integration
 * spanning all four has been verified. Detailed system flows live in each
 * case study.
 *
 * Laid out top-down so the four areas sit side by side in one horizontal row
 * rather than stacking into a tall column. Dagre places the first-declared
 * cluster leftmost, so FOUNDATIONS is declared before RND to keep the areas
 * reading 01-04 left to right; swapping these blocks flips the two groups.
 */
export const ALUMAPOWER_PLATFORM_MAP = `flowchart TB
    ORG["AlumaPower<br/>Engineering work"]
    subgraph FOUNDATIONS["Shared systems and internal operations"]
      DATA["03 · Data infrastructure<br/>Central storage · backup · recovery"]
      APPS["04 · Enterprise applications<br/>Quality · fabrication · operations"]
    end
    subgraph RND["Industrial R&D and product development"]
      OPS["01 · Ops Vista 2.0<br/>Remote monitoring and control"]
      EX["02 · Experiment Analysis<br/>Repeatable data processing"]
    end
    ORG --> OPS
    ORG --> EX
    ORG --> DATA
    ORG --> APPS`;
