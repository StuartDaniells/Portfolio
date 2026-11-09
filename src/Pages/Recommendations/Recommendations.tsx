import { recommendations } from "../../content/recommendations";
import UseData from "../../Hooks/UseData";
import Footer from "../../Share/Footer";
import PageMeta from "../../Share/PageMeta";
import RecommendationCard from "./RecommendationCard";

const RECOMMENDATIONS_DESCRIPTION =
  "Written recommendations from colleagues, managers and clients Stuart Daniells has worked with.";

const Recommendations = () => {
  const { local } = UseData();

  return (
    <main>
      <PageMeta
        title="Recommendations"
        description={RECOMMENDATIONS_DESCRIPTION}
      />

      <section className="bg-white lg:rounded-2xl dark:bg-[#111111]">
        <div data-aos="fade">
          <div className="container px-4 sm:px-5 md:px-10 lg:px-[60px]">
            <div className="py-12">
              {/* Page header */}
              <div className="mt-12 lg:mt-0">
                <h2 className="after-effect text-[clamp(1.75rem,6.5vw,2.5rem)] after:left-96">
                  Recommendations
                </h2>

                <p className="mt-8 max-w-[65ch] text-pretty text-[15px] leading-7 text-gray-lite dark:text-color-910">
                  Perspectives from colleagues and professionals I&rsquo;ve
                  worked with.
                </p>
              </div>

              {/* Two-column rows line their footers up via the card's desktop
                  `min-h`; `items-start` stops a row stretching its siblings, so
                  expanding one card grows only that card. */}
              <ul className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-7">
                {recommendations.map((recommendation) => (
                  <li key={recommendation.id} className="min-w-0">
                    <RecommendationCard
                      recommendation={recommendation}
                      local={local}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Footer className="bg-[#F8FBFB] dark:bg-[#212425]" />
        </div>
      </section>
    </main>
  );
};

export default Recommendations;
