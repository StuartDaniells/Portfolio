import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Height of the fixed mobile header, so anchor targets are not hidden
 * underneath it when jumping to an organization section.
 */
const HEADER_OFFSET = 96;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Restores sane scroll position on client-side navigation and resolves
 * `/home/works#fangtooth` style hash links, which React Router does not
 * handle on its own.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (target) {
        const top =
          target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(top, 0), behavior });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
