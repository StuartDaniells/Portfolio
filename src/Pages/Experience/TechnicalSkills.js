import { FiCode } from "react-icons/fi";
import UseData from "../../Hooks/UseData";

const TechnicalSkills = () => {
  const { skillGroupArray } = UseData();

  return (
    <section aria-labelledby="technical-skills-heading">
      <div className="flex items-center space-x-2 mb-4">
        <span aria-hidden="true" className="text-6xl text-[#F95054]">
          <FiCode />
        </span>
        <h3
          id="technical-skills-heading"
          className="text-5xl dark:text-white font-medium"
        >
          Technical Skills
        </h3>
      </div>

      <div className="space-y-4">
        {skillGroupArray.map((group) => (
          <div key={group.id}>
            <p className="mb-2 text-tiny font-semibold uppercase tracking-wide text-gray-lite dark:text-color-910">
              {group.category}
            </p>
            <ul className="flex flex-wrap gap-2">
              {group.terms.map((term) => (
                <li key={term}>
                  <span className="resume-btn">{term}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalSkills;
