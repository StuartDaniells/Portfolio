/**
 * Case-study content model.
 *
 * Long-form content is authored as typed blocks + inline segments. There is no
 * runtime Markdown loading or parsing anywhere: content files are evaluated
 * once at build/dev time and rendered directly by the case-study body renderer.
 */

export interface InlineSegment {
  text: string;
  /** Render in a <strong>. */
  strong?: boolean;
  /** Render in an <em>. */
  em?: boolean;
  /** Render as inline code. */
  code?: boolean;
  /** Render as a link. */
  href?: string;
}

export interface HeadingBlock {
  kind: "heading";
  level: 2 | 3;
  /**
   * Stable, URL-safe anchor id derived from the heading text only. Never
   * derived from the displayed section number, because numbering is recomputed
   * per build when internal-only sections are excluded.
   */
  id: string;
  text: string;
  /**
   * Pre-stable-id anchor (e.g. "4-three-integration-workflows") kept so older
   * deep links still resolve. Rendered as an empty alias element, never as a
   * second visible heading.
   */
  legacyId?: string;
}

export interface ParagraphBlock {
  kind: "paragraph";
  segments: InlineSegment[];
}

export interface ListBlock {
  kind: "list";
  ordered: boolean;
  items: InlineSegment[][];
}

export interface TableBlock {
  kind: "table";
  headers: InlineSegment[][];
  rows: InlineSegment[][][];
}

export interface MermaidBlock {
  kind: "mermaid";
  chart: string;
  /** Accessible name for the diagram region. */
  label: string;
  caption?: string;
  /** Text equivalent shown if the diagram cannot render. */
  outline: string[];
}

export interface CodeBlock {
  kind: "code";
  language: string;
  code: string;
}

export interface NoteBlock {
  kind: "note";
  segments: InlineSegment[];
}

export type CaseStudyBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | MermaidBlock
  | CodeBlock
  | NoteBlock;

/* ---- Segment constructors: keep authoring terse without a parser. ---- */

export const t = (text: string): InlineSegment => ({ text });
export const b = (text: string): InlineSegment => ({ text, strong: true });
export const i = (text: string): InlineSegment => ({ text, em: true });
export const c = (text: string): InlineSegment => ({ text, code: true });
export const l = (text: string, href: string): InlineSegment => ({ text, href });

/** Deterministic URL-safe slug used for heading anchors. */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Heading block builder. `legacyId` is optional and only used for old links. */
export const heading = (
  level: 2 | 3,
  text: string,
  legacyId?: string
): HeadingBlock => ({
  kind: "heading",
  level,
  id: slugify(text),
  text,
  ...(legacyId && legacyId !== slugify(text) ? { legacyId } : {}),
});

/**
 * Registry contract shared by `registry.public.ts` and `registry.internal.ts`.
 * Both modules expose exactly this shape, which is what lets Vite swap one for
 * the other via `resolve.alias` without any call-site changes.
 */
export type CaseStudyBodies = Record<string, CaseStudyBlock[]>;

export interface CaseStudyRegistry {
  caseStudyBodies: CaseStudyBodies;
  getCaseStudyBody: (slug: string) => CaseStudyBlock[] | undefined;
}

export const makeRegistry = (bodies: CaseStudyBodies): CaseStudyRegistry => ({
  caseStudyBodies: bodies,
  getCaseStudyBody: (slug: string) => bodies[slug],
});

/**
 * A block group that only exists in internal builds.
 */
export interface InternalSectionGroup {
  /**
   * Stable id of the public section this group originally followed. Using a
   * stable id (never a position) keeps the split resilient to reordering and
   * to the numbering changes that happen when sections are excluded.
   */
  afterSectionId: string;
  blocks: CaseStudyBlock[];
}

/**
 * Re-inserts internal-only block groups into a public body at the position
 * recorded by `afterSectionId`. Used only by `registry.internal.ts`.
 */
export const mergeInternalSections = (
  blocks: CaseStudyBlock[],
  groups: InternalSectionGroup[]
): CaseStudyBlock[] => {
  if (groups.length === 0) return blocks;

  const merged: CaseStudyBlock[] = [];
  let pending = [...groups];
  let currentSectionId: string | null = null;

  const flushFor = (sectionId: string | null) => {
    const due = pending.filter((group) => group.afterSectionId === sectionId);
    if (due.length === 0) return;
    pending = pending.filter((group) => group.afterSectionId !== sectionId);
    for (const group of due) merged.push(...group.blocks);
  };

  for (const block of blocks) {
    if (block.kind === "heading" && block.level === 2) {
      flushFor(currentSectionId);
      currentSectionId = block.id;
    }
    merged.push(block);
  }

  flushFor(currentSectionId);

  if (pending.length > 0) {
    throw new Error(
      `[case-studies] Internal section groups reference unknown sections: ${pending
        .map((group) => group.afterSectionId)
        .join(", ")}. Update afterSectionId in src/content/caseStudies/internal/.`
    );
  }

  return merged;
};
