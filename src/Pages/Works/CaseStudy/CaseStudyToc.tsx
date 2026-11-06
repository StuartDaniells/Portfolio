import { Link } from "react-router-dom";
import type { CaseStudyBlock, HeadingBlock } from "../../../content/caseStudies/types";

interface CaseStudyTocProps {
  blocks: CaseStudyBlock[];
}

/**
 * Optional on-page contents, derived from the article's own headings.
 * Shown from 768px, sticky only at desktop widths. Uses router links so the
 * shared ScrollToTop handler can apply the header offset consistently.
 */
const CaseStudyToc = ({ blocks }: CaseStudyTocProps) => {
  const headings = blocks.filter(
    (block): block is HeadingBlock => block.kind === "heading"
  );
  if (headings.length < 3) return null;

  let sectionNumber = 0;

  return (
    <nav aria-labelledby="case-study-toc-heading" className="hidden md:block">
      <div className="lg:sticky lg:top-24">
        <p id="case-study-toc-heading" className="works-kicker">
          On this page
        </p>
        <ol className="mt-4 space-y-1.5 border-l border-works-border pl-4">
          {headings.map((heading) => {
            if (heading.level === 2) sectionNumber += 1;
            const number =
              heading.level === 2
                ? String(sectionNumber).padStart(2, "0")
                : null;

            return (
              <li
                key={heading.id}
                className={heading.level === 3 ? "pl-3" : undefined}
              >
                <Link
                  to={`#${heading.id}`}
                  className="flex items-baseline gap-2 rounded-sm py-1 text-tiny leading-snug text-works-muted transition-colors duration-200 hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent focus-visible:ring-offset-2 focus-visible:ring-offset-works-surface motion-reduce:transition-none"
                >
                  {number ? (
                    <span
                      className="text-[0.6875rem] tabular-nums"
                      aria-hidden="true"
                    >
                      {number}
                    </span>
                  ) : null}
                  {heading.text}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default CaseStudyToc;
