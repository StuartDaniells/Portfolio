import { Link } from "react-router-dom";
import type { CaseStudy, WorksOrganization } from "../../../content/works";

interface CaseStudyHeaderProps {
  org: WorksOrganization;
  study: CaseStudy;
}

const CaseStudyHeader = ({ org, study }: CaseStudyHeaderProps) => (
  <header>
    <Link
      to={`/home/works#${org.id}`}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-md text-tiny font-medium text-works-muted transition-colors duration-200 hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent focus-visible:ring-offset-2 focus-visible:ring-offset-works-surface motion-reduce:transition-none"
    >
      <span aria-hidden="true">&larr;</span> Back to Works
    </Link>

    <nav aria-label="Breadcrumb" className="mt-6">
      <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] uppercase tracking-[0.16em] text-works-muted">
        <li>{org.name}</li>
        <li aria-hidden="true" className="text-works-border">
          /
        </li>
        <li className="text-works-accent">Case study {study.id}</li>
      </ol>
    </nav>

    <h1 className="mt-4 font-robotoSlab text-works-h1 font-semibold text-works-text">
      {study.articleTitle}
    </h1>

    <span className="works-rule" aria-hidden="true" />

    <p className="mt-6 text-works-body text-works-muted">
      {study.takeaway}
    </p>

    <dl className="mt-7 grid gap-5 sm:grid-cols-2">
      <div>
        <dt className="works-kicker">Role</dt>
        <dd className="mt-1 text-tiny text-works-text">{org.role}</dd>
      </div>
      <div>
        <dt className="works-kicker">Focus</dt>
        <dd className="mt-1 text-tiny text-works-text">{study.focus}</dd>
      </div>
    </dl>

    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
      {study.stack.map((item) => (
        <li key={item} className="works-chip">
          {item}
        </li>
      ))}
    </ul>
  </header>
);

export default CaseStudyHeader;
