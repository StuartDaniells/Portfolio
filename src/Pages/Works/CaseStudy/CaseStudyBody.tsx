import { Fragment } from "react";
import {
  type CaseStudyBlock,
  type InlineSegment,
} from "../../../content/caseStudies/types";
import { buildOutline } from "../../../content/caseStudies/outline";
import MermaidDiagram from "../diagrams/MermaidDiagram";

/**
 * Renders extracted case-study content. Content is typed data (no Markdown
 * parsing); inline formatting is handled by `Segments`.
 */

const Segments = ({ segments }: { segments: InlineSegment[] }) => (
  <>
    {segments.map((segment, index) => {
      if (segment.code) {
        return (
          <code
            key={index}
            className="rounded bg-works-card px-1.5 py-0.5 font-mono text-[0.85em] text-works-route"
          >
            {segment.text}
          </code>
        );
      }
      if (segment.href) {
        return (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-works-accent underline decoration-works-border underline-offset-2 transition-colors duration-200 hover:decoration-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent focus-visible:ring-offset-2 focus-visible:ring-offset-works-surface motion-reduce:transition-none"
          >
            {segment.text}
          </a>
        );
      }
      if (segment.strong) {
        return (
          <strong key={index} className="font-semibold text-works-text">
            {segment.text}
          </strong>
        );
      }
      if (segment.em) {
        return <em key={index}>{segment.text}</em>;
      }
      return <Fragment key={index}>{segment.text}</Fragment>;
    })}
  </>
);

const Paragraph = ({ segments }: { segments: InlineSegment[] }) => (
  <p className="mt-5 text-works-body text-works-muted">
    <Segments segments={segments} />
  </p>
);

const List = ({
  ordered,
  items,
}: {
  ordered: boolean;
  items: InlineSegment[][];
}) => {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      className={`mt-5 space-y-2 text-works-body text-works-muted ${
        ordered ? "list-decimal pl-6" : "list-disc pl-6"
      }`}
    >
      {items.map((item, index) => (
        <li key={index}>
          <Segments segments={item} />
        </li>
      ))}
    </ListTag>
  );
};

const Table = ({
  headers,
  rows,
}: {
  headers: InlineSegment[][];
  rows: InlineSegment[][][];
}) => (
  <div className="mt-6 overflow-x-auto">
    <table className="w-full border-collapse text-left text-tiny">
      <thead>
        <tr>
          {headers.map((cell, index) => (
            <th
              key={index}
              className="border-b border-works-border px-3 py-2 align-top font-semibold text-works-text"
            >
              <Segments segments={cell} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border-b border-works-border px-3 py-2 align-top text-works-muted"
              >
                <Segments segments={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Note = ({ segments }: { segments: InlineSegment[] }) => (
  <p className="mt-5 text-tiny italic leading-relaxed text-works-muted">
    <Segments segments={segments} />
  </p>
);

const Code = ({ code }: { code: string }) => (
  <pre className="mt-5 overflow-x-auto rounded-xl border border-works-border bg-works-card p-4 font-mono text-tiny leading-relaxed text-works-text">
    <code>{code}</code>
  </pre>
);

const Mermaid = ({
  chart,
  label,
  caption,
  outline,
}: {
  chart: string;
  label: string;
  caption?: string;
  outline: string[];
}) => (
  <figure className="mt-7">
    <MermaidDiagram chart={chart} label={label} outline={outline} />
    {caption ? (
      <figcaption className="mt-4 text-pretty text-tiny leading-relaxed text-works-muted">
        {caption}
      </figcaption>
    ) : null}
  </figure>
);

const BlockRenderer = ({ block }: { block: CaseStudyBlock }) => {
  switch (block.kind) {
    // Section and subsection headings are structural: `CaseStudyBody` renders
    // them from the shared outline so they carry generated numbering.
    case "heading":
      return null;
    case "paragraph":
      return <Paragraph segments={block.segments} />;
    case "list":
      return <List ordered={block.ordered} items={block.items} />;
    case "table":
      return <Table headers={block.headers} rows={block.rows} />;
    case "mermaid":
      return (
        <Mermaid
          chart={block.chart}
          label={block.label}
          caption={block.caption}
          outline={block.outline}
        />
      );
    case "code":
      return <Code code={block.code} />;
    case "note":
      return <Note segments={block.segments} />;
  }
};

interface CaseStudyBodyProps {
  blocks: CaseStudyBlock[];
}

/**
 * Carries a pre-renumbering anchor id (e.g. "4-three-integration-workflows")
 * so older deep links still scroll to the right place. It is empty and
 * aria-hidden, so no duplicate heading is ever displayed.
 */
const LegacyAnchor = ({ id }: { id?: string }) =>
  id ? <span id={id} aria-hidden="true" /> : null;

/**
 * Groups content into sections using the shared outline, preserving the
 * approved "Section NN / heading" rhythm with hairline dividers. Numbers and
 * subsection letters are derived from position in the selected (public or
 * internal) section collection, never hard-coded in the content.
 */
const CaseStudyBody = ({ blocks }: CaseStudyBodyProps) => {
  const sections = buildOutline(blocks);

  return (
    <div>
      {sections.map((section) => (
        <section
          key={section.heading.id}
          id={section.heading.id}
          aria-labelledby={`${section.heading.id}-heading`}
          className="scroll-mt-24 border-t border-works-border py-9 first:border-t-0 first:pt-0"
        >
          <LegacyAnchor id={section.heading.legacyId} />

          <p className="works-kicker">Section {section.displayNumber}</p>

          <h2
            id={`${section.heading.id}-heading`}
            className="mt-2 font-robotoSlab text-works-h2 font-medium text-works-text"
          >
            {section.heading.text}
          </h2>

          {section.blocks.map((block, blockIndex) => (
            <BlockRenderer key={blockIndex} block={block} />
          ))}

          {section.subsections.map((subsection) => (
            <Fragment key={subsection.heading.id}>
              <LegacyAnchor id={subsection.heading.legacyId} />

              <h3
                id={subsection.heading.id}
                className="mt-9 scroll-mt-24 font-robotoSlab text-works-h3 font-medium text-works-text"
              >
                {subsection.label}. {subsection.heading.text}
              </h3>

              {subsection.blocks.map((block, blockIndex) => (
                <BlockRenderer key={blockIndex} block={block} />
              ))}
            </Fragment>
          ))}
        </section>
      ))}
    </div>
  );
};

export default CaseStudyBody;
