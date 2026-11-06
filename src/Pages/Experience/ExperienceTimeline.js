import UseData from "../../Hooks/UseData";

const ExperienceTimeline = () => {
  const { experienceRoleArray, local } = UseData();

  return (
    <section aria-labelledby="professional-experience-heading">
      <h3
        id="professional-experience-heading"
        className="text-[35px] dark:text-white font-medium mb-6"
      >
        Professional Experience
      </h3>

      <ol>
        {experienceRoleArray.map((role, index) => {
          const isLastRole = index === experienceRoleArray.length - 1;
          const hasDetail = role.highlights.length > 0;

          return (
            <li key={role.id} className="relative pl-8 pb-8 last:pb-0">
              {/* vertical connector between markers */}
              {!isLastRole && (
                <span
                  aria-hidden="true"
                  className="absolute left-[5px] top-7 h-[calc(100%-1.75rem)] w-px bg-[#E3E3E3] dark:bg-[#2A2A2A]"
                />
              )}

              {/* timeline status marker, decorative only */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-6 h-3 w-3 rounded-full ${
                  role.isCurrent
                    ? "bg-gradient-to-r from-[#FA5252] to-[#DD2476] ring-4 ring-[#FA5252]/15"
                    : "border-2 border-[#C9D2DA] bg-white dark:border-[#3A3A3A] dark:bg-[#111111]"
                }`}
              />

              <article
                className={
                  hasDetail
                    ? "rounded-lg p-5 dark:border-2 dark:border-[#212425]"
                    : "pt-1"
                }
                style={
                  hasDetail && role.bg
                    ? {
                        background: `${
                          local === "dark" ? "transparent" : role.bg
                        }`,
                      }
                    : undefined
                }
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h4
                    className={`${
                      hasDetail ? "text-2xl" : "text-xl"
                    } font-medium dark:text-white`}
                  >
                    {role.company}
                  </h4>
                  {role.isCurrent && (
                    <span className="rounded-full bg-[#FA5252]/10 px-2.5 py-1 text-xs font-semibold text-[#C2185B] dark:bg-[#FA5252]/15 dark:text-[#FF9BB2]">
                      Current
                    </span>
                  )}
                </div>

                <p className="mt-1 font-medium text-gray-lite dark:text-color-910">
                  {role.title}
                </p>

                <p className="mt-1 text-tiny text-gray-lite dark:text-color-910">
                  {role.date} <span aria-hidden="true">·</span> {role.location}
                </p>

                {hasDetail && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-gray-lite dark:text-[#A6A6A6]">
                    {role.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ExperienceTimeline;
