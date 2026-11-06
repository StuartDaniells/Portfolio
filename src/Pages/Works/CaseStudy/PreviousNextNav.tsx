import { Link } from "react-router-dom";
import { adjacentStudies, studyPath, type CaseStudy } from "../../../content/works";

interface PreviousNextNavProps {
  study: CaseStudy;
}

const PreviousNextNav = ({ study }: PreviousNextNavProps) => {
  const { previous, next } = adjacentStudies(study);
  if (!previous && !next) return null;

  const linkClass =
    "flex min-h-[44px] flex-col justify-center rounded-xl border border-works-border bg-works-card px-4 py-3 transition-colors duration-200 hover:border-works-accent hover:bg-works-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent focus-visible:ring-offset-2 focus-visible:ring-offset-works-surface motion-reduce:transition-none";

  return (
    <nav
      aria-label="Case study navigation"
      className="mt-10 grid gap-4 border-t border-works-border pt-9 sm:grid-cols-2"
    >
      {previous ? (
        <Link to={studyPath(previous)} className={linkClass}>
          <span className="text-[0.75rem] uppercase tracking-[0.16em] text-works-muted">
            <span aria-hidden="true">&larr;</span> Previous case study
          </span>
          <span className="mt-1 text-tiny font-medium text-works-text">
            {previous.id} &middot; {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link to={studyPath(next)} className={`${linkClass} sm:text-right`}>
          <span className="text-[0.75rem] uppercase tracking-[0.16em] text-works-muted">
            Next case study <span aria-hidden="true">&rarr;</span>
          </span>
          <span className="mt-1 text-tiny font-medium text-works-text">
            {next.id} &middot; {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
};

export default PreviousNextNav;
