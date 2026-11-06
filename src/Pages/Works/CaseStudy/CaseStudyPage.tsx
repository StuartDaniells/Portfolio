import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { getCaseStudyBody } from "../../../content/caseStudies";
import { getOrganization, getStudy } from "../../../content/works";
import Footer from "../../../Share/Footer";
import PageMeta from "../../../Share/PageMeta";
import CaseStudyBody from "./CaseStudyBody";
import CaseStudyHeader from "./CaseStudyHeader";
import CaseStudyToc from "./CaseStudyToc";
import PreviousNextNav from "./PreviousNextNav";

const PageShell = ({ children }: { children: ReactNode }) => (
  <main>
    <section className="bg-white lg:rounded-2xl dark:bg-[#111111]">
      <div data-aos="fade">
        <div className="container px-4 sm:px-5 md:px-10 lg:px-[60px]">
          <div className="py-12">{children}</div>
        </div>
        <Footer className="bg-[#F8FBFB] dark:bg-[#212425]" />
      </div>
    </section>
  </main>
);

const Fallback = ({ title, message }: { title: string; message: string }) => (
  <PageShell>
    <PageMeta title={title} description={message} />

    <div className="mt-12 max-w-reading lg:mt-0">
      <p className="works-kicker">Works</p>

      <h1 className="mt-4 font-robotoSlab text-works-h2 font-semibold text-works-text">
        {title}
      </h1>

      <span className="works-rule" aria-hidden="true" />

      <p className="mt-5 text-works-body text-works-muted">{message}</p>

      <Link
        to="/home/works"
        className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-md bg-gradient-to-r from-[#FA5252] to-[#DD2476] px-5 py-2.5 text-tiny font-medium text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent focus-visible:ring-offset-2 focus-visible:ring-offset-works-surface motion-reduce:transition-none"
      >
        <span aria-hidden="true">&larr;</span> Back to Works
      </Link>
    </div>
  </PageShell>
);

const CaseStudyPage = () => {
  const { orgSlug, studySlug } = useParams<{
    orgSlug: string;
    studySlug: string;
  }>();

  const org = getOrganization(orgSlug);
  const study = getStudy(orgSlug, studySlug);
  const body = study ? getCaseStudyBody(study.slug) : undefined;

  if (!org || !study || !body) {
    return (
      <Fallback
        title="Case study not found"
        message="That chapter does not exist. The Works index lists every published case study."
      />
    );
  }

  return (
    <PageShell>
      <PageMeta title={study.articleTitle} description={study.teaser} />

      <CaseStudyHeader org={org} study={study} />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-12">
        <CaseStudyToc blocks={body} />

        <div className="min-w-0">
          <CaseStudyBody blocks={body} />

          <PreviousNextNav study={study} />
        </div>
      </div>
    </PageShell>
  );
};

export default CaseStudyPage;
