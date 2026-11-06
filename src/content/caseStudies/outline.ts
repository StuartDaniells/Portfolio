import type { CaseStudyBlock, HeadingBlock } from "./types";

/**
 * Case-study outline: the single source of truth for section order, displayed
 * numbering, subsection lettering and the table of contents.
 *
 * Both the article body and the TOC derive from `buildOutline`, so the numbers
 * they show cannot drift apart, and excluding an internal-only section
 * automatically renumbers everything after it.
 */

export interface OutlineSubsection {
  heading: HeadingBlock;
  /** Displayed subsection letter, e.g. "A". Derived from position. */
  label: string;
  blocks: CaseStudyBlock[];
}

export interface OutlineSection {
  heading: HeadingBlock;
  /** Displayed section number, e.g. "01". Derived from position. */
  displayNumber: string;
  /** Content between the section heading and its first subsection. */
  blocks: CaseStudyBlock[];
  subsections: OutlineSubsection[];
}

const displayNumber = (index: number): string =>
  String(index + 1).padStart(2, "0");

const subsectionLabel = (index: number): string =>
  String.fromCharCode(65 + index);

export const buildOutline = (blocks: CaseStudyBlock[]): OutlineSection[] => {
  const sections: OutlineSection[] = [];

  for (const block of blocks) {
    if (block.kind === "heading" && block.level === 2) {
      sections.push({
        heading: block,
        displayNumber: displayNumber(sections.length),
        blocks: [],
        subsections: [],
      });
      continue;
    }

    const section = sections[sections.length - 1];
    if (!section) continue;

    if (block.kind === "heading" && block.level === 3) {
      section.subsections.push({
        heading: block,
        label: subsectionLabel(section.subsections.length),
        blocks: [],
      });
      continue;
    }

    const subsection = section.subsections[section.subsections.length - 1];
    if (subsection) subsection.blocks.push(block);
    else section.blocks.push(block);
  }

  return sections;
};

/** Total number of visible headings, used by the TOC's display threshold. */
export const countOutlineHeadings = (sections: OutlineSection[]): number =>
  sections.reduce(
    (total, section) => total + 1 + section.subsections.length,
    0
  );
