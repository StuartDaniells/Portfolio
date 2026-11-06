import { Link } from "react-router-dom";
import { canOpenStudy, studyPath, type CaseStudy } from "../../content/works";

interface CaseStudyCardProps {
  study: CaseStudy;
}

/**
 * A single case-study card. The whole card is one link (no nested interactive
 * elements) and there is no illustration: the architecture appears once, in
 * the platform map above. Drafts that are not openable render as a plain
 * container with an "in preparation" note instead of a dead link.
 */
const CaseStudyCard = ({ study }: CaseStudyCardProps) => {
  const linkable = canOpenStudy(study);

  const body = (
    <>
      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-works-muted">
        Case study {study.id}
      </span>

      <h3 className="mt-3 text-works-h3 font-medium text-works-text">
        {study.title}
      </h3>
      <p className="mt-2 text-tiny leading-relaxed text-works-muted">
        {study.teaser}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {study.stack.map((item) => (
          <li key={item} className="works-chip">
            {item}
          </li>
        ))}
      </ul>

      <span
        className={`mt-auto pt-6 text-tiny font-medium ${
          linkable ? "text-works-accent" : "text-works-muted"
        }`}
      >
        {linkable ? (
          <>
            Explore Case Study <span aria-hidden="true">&rarr;</span>
          </>
        ) : (
          "In preparation"
        )}
      </span>
    </>
  );

  if (!linkable) {
    return <div className="works-card">{body}</div>;
  }

  return (
    <Link
      to={studyPath(study)}
      aria-label={`Explore case study: ${study.title}`}
      className="works-card works-card-interactive"
    >
      {body}
    </Link>
  );
};

export default CaseStudyCard;
