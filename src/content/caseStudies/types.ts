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
  /** Stable, URL-safe anchor id. */
  id: string;
  text: string;
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

/** Heading block builder. */
export const heading = (level: 2 | 3, text: string): HeadingBlock => ({
  kind: "heading",
  level,
  id: slugify(text),
  text,
});
