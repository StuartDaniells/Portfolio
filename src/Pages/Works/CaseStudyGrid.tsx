import type { CaseStudy } from "../../content/works";
import CaseStudyCard from "./CaseStudyCard";

interface CaseStudyGridProps {
  studies: CaseStudy[];
  emptyNote?: string;
}

const CaseStudyGrid = ({ studies, emptyNote }: CaseStudyGridProps) => {
  if (studies.length === 0) {
    return emptyNote ? (
      <p className="mt-6 max-w-reading text-tiny leading-relaxed text-works-muted">
        {emptyNote}
      </p>
    ) : null;
  }

  return (
    <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-7">
      {studies.map((study) => (
        <li key={study.slug} className="min-w-0">
          <CaseStudyCard study={study} />
        </li>
      ))}
    </ul>
  );
};

export default CaseStudyGrid;
