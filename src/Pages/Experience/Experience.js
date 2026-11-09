// import Footer from "../../Share/Footer";
import PageTitle from "../../Share/PageTitle";
import EducationCards from "./EducationCards";
import ExperienceTimeline from "./ExperienceTimeline";
import TechnicalSkills from "./TechnicalSkills";

const Experience = () => {
  return (
    <main>
      <PageTitle title="Experience"></PageTitle>
      {/* End pagetitle */}

      <section className="bg-white  lg:rounded-2xl dark:bg-[#111111]">
        <div data-aos="fade">
          <div className="container  sm:px-5 md:px-10 lg:px-20">
            <div className="py-12 px-4">
              {/*page title here */}
              <p className="mb-3 mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-gray-lite dark:text-color-910 lg:mt-0">
                6+ Years · 4 Roles · 3 Countries
              </p>
              <h2 className="after-effect after:left-64 mb-4">
                Experience
              </h2>
              {/* <p className="mb-10 max-w-[42rem] leading-7 text-gray-lite dark:text-color-910">
                Designing and building software platforms, data pipelines, and
                AI-enabled applications: from architecture to implementation.
              </p> */}

              <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:gap-x-10">
                {/* timeline is the dominant column */}
                <div className="col-span-12 lg:col-span-7">
                  <ExperienceTimeline />
                </div>

                {/* skills then education, stacks after the timeline on mobile */}
                <div className="col-span-12 space-y-10 lg:col-span-5">
                  <TechnicalSkills />
                  <EducationCards />
                </div>
              </div>
            </div>
          </div>
          {/* End experience */}

          {/* call footer */}
          {/* <Footer className="bg-white dark:bg-transparent" /> */}
        </div>
      </section>
    </main>
  );
};

export default Experience;
