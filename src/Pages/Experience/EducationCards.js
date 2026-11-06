import { MdOutlineSchool } from "react-icons/md";
import UseData from "../../Hooks/UseData";

const EducationCards = () => {
  const { educationArray, local } = UseData();

  return (
    <section aria-labelledby="education-heading">
      <div className="flex items-center space-x-2 mb-4">
        <span aria-hidden="true" className="text-6xl text-[#F95054]">
          <MdOutlineSchool />
        </span>
        <h3 id="education-heading" className="text-5xl dark:text-white font-medium">
          Education
        </h3>
      </div>

      <div className="space-y-4">
        {educationArray.map((item) => (
          <div
            key={item.id}
            className="rounded-lg py-4 pl-5 pr-3 space-y-2 dark:border-2 dark:border-[#212425]"
            style={{
              background: `${local === "dark" ? "transparent" : item.bg}`,
            }}
          >
            <p className="text-tiny text-gray-lite dark:text-[#b7b7b7]">
              {item.date}
            </p>
            <h4 className="text-xl font-medium dark:text-white">
              {item.qualification}
            </h4>
            <p className="text-gray-lite dark:text-[#b7b7b7]">
              {item.institution}
            </p>
            <p className="text-tiny text-gray-lite dark:text-[#b7b7b7]">
              {item.location}
              {item.note ? ` · ${item.note}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationCards;
