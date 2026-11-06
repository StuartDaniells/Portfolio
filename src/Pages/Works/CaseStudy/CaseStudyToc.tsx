import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { CaseStudyBlock } from "../../../content/caseStudies/types";
import {
  buildOutline,
  countOutlineHeadings,
} from "../../../content/caseStudies/outline";

interface CaseStudyTocProps {
  blocks: CaseStudyBlock[];
}

const linkClass =
  "flex items-baseline gap-2 rounded-sm py-1 text-tiny leading-snug text-works-muted transition-colors duration-200 hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent focus-visible:ring-offset-2 focus-visible:ring-offset-works-surface motion-reduce:transition-none";

/**
 * Optional on-page contents, derived from the same outline the article body
 * renders - so numbers, subsection letters and order always match the visible
 * headings, including after internal-only sections are removed from a build.
 * Shown from 768px, sticky only at desktop widths. Uses router links so the
 * shared ScrollToTop handler can apply the header offset consistently.
 */
const CaseStudyToc = ({ blocks }: CaseStudyTocProps) => {
  const sections = buildOutline(blocks);
  if (countOutlineHeadings(sections) < 3) return null;

  return (
    <nav aria-labelledby="case-study-toc-heading" className="hidden md:block">
      <div className="lg:sticky lg:top-24">
        <p id="case-study-toc-heading" className="works-kicker">
          On this page
        </p>
        <ol className="mt-4 space-y-1.5 border-l border-works-border pl-4">
          {sections.map((section) => (
            <Fragment key={section.heading.id}>
              <li>
                <Link to={`#${section.heading.id}`} className={linkClass}>
                  <span
                    className="text-[0.6875rem] tabular-nums"
                    aria-hidden="true"
                  >
                    {section.displayNumber}
                  </span>
                  {section.heading.text}
                </Link>
              </li>

              {section.subsections.map((subsection) => (
                <li key={subsection.heading.id} className="pl-3">
                  <Link to={`#${subsection.heading.id}`} className={linkClass}>
                    {subsection.label}. {subsection.heading.text}
                  </Link>
                </li>
              ))}
            </Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default CaseStudyToc;
