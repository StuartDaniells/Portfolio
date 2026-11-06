import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description?: string;
}

const SITE_SUFFIX = "Stuart Daniells Portfolio";

const SITE_NAME = "Stuart Daniells";

/**
 * Sets the document title and, when a description is supplied, updates the
 * existing description/Open Graph/Twitter tags declared in `index.html`.
 * Tags are updated in place - this never creates duplicates.
 */
const PageMeta = ({ title, description }: PageMetaProps) => {
  useEffect(() => {
    document.title = `${title} - ${SITE_SUFFIX}`;

    if (!description) return;

    const fullTitle = `${title} - ${SITE_SUFFIX}`;
    const targets: Array<[string, string]> = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', fullTitle],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', fullTitle],
      ['meta[name="twitter:description"]', description],
    ];

    targets.forEach(([selector, content]) => {
      const tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (tag) tag.setAttribute("content", content);
    });
  }, [title, description]);

  return null;
};

export { SITE_NAME };
export default PageMeta;
