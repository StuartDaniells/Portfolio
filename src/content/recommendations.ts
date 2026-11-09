/**
 * Recommendations content registry.
 *
 * Written LinkedIn endorsements, stored locally so the page renders without
 * authentication, embeds or any network call. The array order below is the
 * display order on `/home/recommendations`; `order` is the label shown on the
 * card. Wording is reproduced verbatim from the source recommendations.
 *
 * No photographs are stored or shown - names and professional context only.
 */

export interface Recommendation {
  /** Stable slug used for React keys and accessible ids. */
  id: string;
  /** Two-digit display index, in reading order. */
  order: string;
  name: string;
  /** Professional title or headline where one is available. */
  headline?: string;
  /** How the recommender worked with Stuart. */
  relationship: string;
  /** ISO date for `<time dateTime>`. */
  date: string;
  /** Human-readable date, matching the recommendation. */
  dateLabel: string;
  /** Featured quotation shown before expanding. */
  excerpt: string;
  /** Complete recommendation, one entry per paragraph. */
  body: string[];
  /** Pastel card tint, light theme only. */
  bg: string;
}

/**
 * Every card links to the same public recommendations page. There is no
 * per-recommendation deep link, so the link must not imply otherwise.
 */
export const LINKEDIN_RECOMMENDATIONS_URL =
  "https://www.linkedin.com/in/stuart-daniells/details/recommendations/?detailScreenTabIndex=0";

export const recommendations: Recommendation[] = [
  {
    id: "amr-abdallah",
    order: "01",
    name: "Amr Abdallah",
    headline:
      "Solutions Architect | Senior Software Engineering Lead at AlumaPower",
    relationship: "Direct manager",
    date: "2026-05-03",
    dateLabel: "May 3, 2026",
    excerpt:
      "He takes full ownership of the features he builds, combining a strong attention to detail with the ability to system architect scalable solutions.",
    body: [
      "Having led Stuart on the development team, I can attest that he is an important member and a highly capable engineer. He takes full ownership of the features he builds, combining a strong attention to detail with the ability to system architect scalable solutions. He has a sharp eye for how individual components fit into a larger ecosystem, ensuring that every build is robust and future-proof.",
      "Beyond his technical contributions, Stuart is a dedicated team player who excels at cross-functional collaboration. He connects well with other teams across the organization, effectively bridging technical requirements with broader business goals. His ability to communicate complex concepts clearly and work harmoniously with different departments ensures project alignment and success. Stuart’s technical vision, reliability, and collaborative mindset make him a significant asset to any organization.",
    ],
    bg: "#FCF4FF",
  },
  {
    id: "galina-briskin",
    order: "02",
    name: "Galina Briskin",
    relationship: "Client",
    date: "2022-10-30",
    dateLabel: "October 30, 2022",
    excerpt:
      "Stuart has developed algorithms which automates test data processing and reduces processing time from an hour to a second.",
    body: [
      "Stuart has developed algorithms which automates test data processing and reduces processing time from an hour to a second. He possesses strong technical knowledge, motivation, and focus and successfully balances his work with completing his degree. Stuart will bring incredible value to a company with his combination of hardware and software engineering knowledge, strong interpersonal skills and outstanding working attitude.",
    ],
    bg: "#EEFBFF",
  },
  {
    id: "rajveersinh-raol",
    order: "03",
    name: "Rajveersinh Raol",
    headline: "Embedded Systems Technical Lead | Industrial IoT",
    relationship: "Senior colleague",
    date: "2026-04-17",
    dateLabel: "April 17, 2026",
    excerpt:
      "He consistently demonstrated strong technical skills and played a key role in delivering multiple projects involving ground-up development.",
    body: [
      "I had the pleasure of working with Stuart for a couple of years, and it was a great experience. He consistently demonstrated strong technical skills and played a key role in delivering multiple projects involving ground-up development. Stuart brings a thoughtful approach to problem-solving and is reliable when it comes to executing complex tasks. I would highly recommend him for any team looking for a capable and dependable engineer",
    ],
    bg: "#FFF0F0",
  },
  {
    id: "parastoo-mouchani",
    order: "04",
    name: "Parastoo Mouchani",
    headline:
      "Research and Development Scientist | Materials Engineering | Clean Tech",
    relationship: "Colleague",
    date: "2026-03-31",
    dateLabel: "March 31, 2026",
    excerpt:
      "His work streamlined workflows, improved data access, and reduced manual effort across the team.",
    body: [
      "I worked with Stuart for a year and consistently benefited from the systems and tools he built, even outside direct collaboration. His work streamlined workflows, improved data access, and reduced manual effort across the team.",
      "What set him apart is his ability to quickly understand operational problems and turn them into scalable, practical solutions that drive real efficiency.",
    ],
    bg: "#FEFAF0",
  },
];
