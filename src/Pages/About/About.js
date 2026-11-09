import { FaEnvelopeOpenText, FaMapMarkerAlt } from "react-icons/fa";
// Shared legacy sheet: the react-modal overlay styles and `.linked`, which the
// header uses for its active item. It is currently loaded through this page only.
import "../../Share/Style.css";
// import Footer from "../../Share/Footer";
import UseData from "../../Hooks/UseData";
import AboutCard from "./AboutCard";
import PageTitle from "../../Share/PageTitle";

const contactInfo = [
  {
    id: "email",
    label: "Email",
    value: "stuart@stuartdaniells.com",
    href: "mailto:stuart@stuartdaniells.com",
    icon: <FaEnvelopeOpenText />,
    iconClass: "text-green",
  },
  {
    id: "location",
    label: "Location",
    value: "Kitchener, Ontario, Canada",
    icon: <FaMapMarkerAlt />,
    iconClass: "text-orange-lite",
  },
];

const About = () => {
  const { local, serviceArray } = UseData();
  return (
    <>
      <PageTitle title="About"></PageTitle>
      {/* End pagetitle */}

      <section>
        <div className="container lg:rounded-2xl bg-white dark:bg-[#111111]  px-4 sm:px-5 md:px-10 lg:px-20">
          <div data-aos="fade">
            <div className="py-12">
              {/* Page Title */}
              <h2 className="after-effect after:left-32 mt-12 lg:mt-0">
                About
              </h2>

              {/* Expertise + contact details */}
              <div className="grid grid-cols-1 items-start gap-8 pt-6 md:gap-10 md:pt-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <h3 className="mb-3 text-[clamp(1.5rem,2.4vw,2rem)] font-medium dark:text-white">
                    Expertise
                  </h3>
                  <p className="max-w-[65ch] text-pretty leading-7 text-gray-lite dark:text-color-910">
                    My work sits at the intersection of software architecture, cloud systems, data engineering, and applied AI. 
                    With over six years of software engineering experience spanning industrial telemetry, supply chain information systems, and financial analytics. I focus on translating complex operational requirements into secure, scalable, and maintainable software.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-xl bg-color-810 p-6 dark:border-2 dark:border-[#212425] dark:bg-transparent md:p-7">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-lite dark:text-color-910">
                      Contact
                    </p>
                    <ul className="space-y-4">
                      {contactInfo.map((info) => (
                        <li className="flex items-start" key={info.id}>
                          <span
                            aria-hidden="true"
                            className={`${info.iconClass} dark:bg-color-990 shadow-icon mr-2.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-2xl`}
                          >
                            {info.icon}
                          </span>
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs text-gray-lite dark:text-color-910">
                              {info.label}
                            </p>
                            <p className="break-words text-[15px] font-medium dark:text-white">
                              {info.href ? (
                                <a
                                  className="rounded-sm transition-colors duration-300 hover:text-[#FA5252] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 focus-visible:ring-offset-color-810 dark:focus-visible:ring-offset-[#111111]"
                                  href={info.href}
                                >
                                  {info.value}
                                </a>
                              ) : (
                                info.value
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-12">
              <h3 className="text-[35px] dark:text-white font-medium pb-5">
                What I Do
              </h3>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 sm:gap-8">
                {/* Capability cards */}

                {serviceArray.map((item) => (
                  <AboutCard key={item.id} item={item} local={local} />
                ))}
              </div>
            </div>

            {/* Common Footer call here */}
            {/* <Footer className="bg-white dark:bg-transparent" /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
