const AboutCard = ({ item, local }) => {
  return (
    <div
      style={{ background: `${local === "dark" ? "transparent" : item?.bg}` }}
      className="about-box dark:bg-transparent h-full items-start transition-colors duration-300 motion-reduce:transition-none dark:hover:border-[#E93B81]"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center text-[28px]"
        style={{ color: item?.color }}
      >
        {item?.icon}
      </span>

      <div className="min-w-0 space-y-2 break-words">
        <h3 className="dark:text-white text-xl font-semibold">{item?.title}</h3>
        <p className="text-[15px] leading-7 text-gray-lite dark:text-[#A6A6A6]">
          {item?.des}
        </p>
      </div>
    </div>
  );
};
export default AboutCard;
