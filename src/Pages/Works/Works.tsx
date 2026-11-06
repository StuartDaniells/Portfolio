import { alumapower, fangtooth, worksOrganizations } from "../../content/works";
import Footer from "../../Share/Footer";
import PageMeta from "../../Share/PageMeta";
import OrganizationSection from "./OrganizationSection";
import PlatformMap from "./diagrams/PlatformMap";

const WORKS_DESCRIPTION =
  "Engineering case studies: the platform architecture, decisions and trade-offs behind financial analytics, serverless infrastructure and applied AI systems.";

/** Two-digit index for an organization, following registry order. */
const ordinal = (orgId: string): string =>
  String(worksOrganizations.findIndex((org) => org.id === orgId) + 1).padStart(
    2,
    "0"
  );

const Works = () => {
  return (
    <main>
      <PageMeta title="Works" description={WORKS_DESCRIPTION} />

      <section className="bg-white lg:rounded-2xl dark:bg-[#111111]">
        <div data-aos="fade">
          <div className="container px-4 sm:px-5 md:px-10 lg:px-[60px]">
            <div className="py-12">
              {/* Page header */}
              <div className="mt-12 lg:mt-0">
                <p className="works-kicker">Engineering work</p>

                <h1 className="mt-4 text-balance font-robotoSlab text-works-h1 font-semibold text-works-text">
                  Systems I&rsquo;ve architected and built
                </h1>

                <span className="works-rule" aria-hidden="true" />

                <p className="mt-6 text-pretty text-works-body text-works-muted">
                  Explore the challenges, decisions and trade-offs behind each of them.
                  <br />
                  Each organization below contains an architectural overview and a grid of its case
                  studies.
                </p>
              </div>

              <div className="mt-14 space-y-16 md:mt-16 md:space-y-20">
                <OrganizationSection
                  org={fangtooth}
                  number={ordinal(fangtooth.id)}
                  subtitle=""
                  cardsHeading="Explore the Architecture"
                >
                  <PlatformMap />
                </OrganizationSection>

                <OrganizationSection
                  org={alumapower}
                  number={ordinal(alumapower.id)}
                  emptyNote="Written case studies for this organization are still in preparation."
                />
              </div>
            </div>
          </div>

          <Footer className="bg-[#F8FBFB] dark:bg-[#212425]" />
        </div>
      </section>
    </main>
  );
};

export default Works;
