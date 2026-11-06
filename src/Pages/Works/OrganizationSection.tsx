import type { ReactNode } from "react";
import { visibleStudies, type WorksOrganization } from "../../content/works";
import CaseStudyGrid from "./CaseStudyGrid";

interface OrganizationSectionProps {
  org: WorksOrganization;
  /** Two-digit organization index shown in the masthead gutter, e.g. "01". */
  number?: string;
  /** Replaces the registry summary as the section subtitle. */
  subtitle?: string;
  /** Optional subsection heading above the card grid, e.g. "Explore the Architecture". */
  cardsHeading?: string;
  /** Diagram (or other block) that carries its own subsection heading. */
  children?: ReactNode;
  emptyNote?: string;
}

const OrganizationSection = ({
  org,
  number,
  subtitle,
  cardsHeading,
  children,
  emptyNote,
}: OrganizationSectionProps) => {
  const studies = visibleStudies(org);

  return (
    <section id={org.id} aria-labelledby={`${org.id}-heading`} className="scroll-mt-28">
      {/* Masthead: index numeral in the gutter, then role and organization
          against a coral spine. Decorative - not part of the outline. */}
      <div className="flex items-start gap-4 md:gap-6">
        {number ? (
          <span
            aria-hidden="true"
            className="select-none font-robotoSlab text-[2rem] font-semibold leading-none tabular-nums text-works-muted/35 md:text-[2.75rem]"
          >
            {number}
          </span>
        ) : null}

        <div className="min-w-0 border-l-2 border-works-accent pl-4 md:pl-5">
          <p className="works-kicker">{org.role}</p>

          <h2
            id={`${org.id}-heading`}
            className="mt-2 text-balance font-robotoSlab text-works-h2 font-semibold text-works-text"
          >
            {org.name}
          </h2>
        </div>
      </div>

      <p className="mt-6 text-pretty text-works-body text-works-muted">
        {subtitle ?? org.summary}
      </p>

      {children ? <div className="mt-10">{children}</div> : null}

      {cardsHeading ? (
        <h3 className="works-subhead mt-14">{cardsHeading}</h3>
      ) : null}

      <CaseStudyGrid studies={studies} emptyNote={emptyNote} />
    </section>
  );
};

export default OrganizationSection;
