import { memo, useEffect, useRef, useState, type ReactNode } from "react";

type Status = "loading" | "ready" | "error";

/** Keeps each mermaid.render() identifier unique across theme switches. */
let renderCount = 0;

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() =>
      setIsDark(root.classList.contains("dark"))
    );
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

/**
 * Coral-accent theme mapped onto the palette already used by the site.
 * Case-study zones get a tonal fill and a teal outline so they read as
 * distinct groups instead of dissolving into the panel background.
 */
const themeVariables = (isDark: boolean) => ({
  fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
  fontSize: "14px",
  background: "transparent",
  // Nodes: cards sitting on a tinted case-study zone.
  mainBkg: isDark ? "#212425" : "#ffffff",
  nodeBorder: "#fa5252",
  primaryColor: isDark ? "#212425" : "#ffffff",
  primaryTextColor: isDark ? "#f3f6f6" : "#1c1c1c",
  primaryBorderColor: "#fa5252",
  secondaryColor: isDark ? "#212425" : "#ffffff",
  secondaryTextColor: isDark ? "#f3f6f6" : "#1c1c1c",
  secondaryBorderColor: "#fa5252",
  tertiaryColor: isDark ? "#212425" : "#ffffff",
  tertiaryTextColor: isDark ? "#f3f6f6" : "#1c1c1c",
  tertiaryBorderColor: "#fa5252",
  textColor: isDark ? "#f3f6f6" : "#1c1c1c",
  titleColor: isDark ? "#f3f6f6" : "#1c1c1c",
  lineColor: "#6ab5b9",
  // Case-study zones.
  clusterBkg: isDark ? "#161616" : "#e9f0f1",
  clusterBorder: "rgba(106, 181, 185, 0.85)",
  edgeLabelBackground: isDark ? "#161616" : "#e9f0f1",
});

interface MermaidDiagramProps {
  chart: string;
  /** Accessible name for the diagram region. */
  label: string;
  /**
   * Text equivalent: a bullet list of strings or a custom node. Hidden from
   * sight when the diagram renders; shown in full if rendering fails.
   */
  outline: string[] | ReactNode;
}

/**
 * Renders a Mermaid source string to SVG scaled to the available width, so the
 * whole map is visible without horizontal scrolling. Falls back to a readable
 * text outline if the renderer fails.
 */
const MermaidDiagram = memo(function MermaidDiagram({
  chart,
  label,
  outline,
}: MermaidDiagramProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const isDark = useIsDarkMode();

  // Lazy-mount: only render the diagram once it is near the viewport.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(mount);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    const mount = mountRef.current;
    if (!mount) return;

    setStatus("loading");

    void (async () => {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: themeVariables(isDark),
          flowchart: {
            // Scale to the container so the map always fits the viewport.
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
            nodeSpacing: 24,
            rankSpacing: 36,
            padding: 8,
            wrappingWidth: 140,
          },
        });

        const id = `case-study-diagram-${++renderCount}`;
        const { svg } = await mermaid.render(id, chart);

        if (cancelled) return;

        // Mermaid renders through a temporary node that it cleans up itself;
        // removing by id here would delete the diagram we just inserted.
        mount.innerHTML = svg;
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        console.error("Unable to render the platform map", error);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView, chart, isDark]);

  return (
    <div className="rounded-2xl border border-works-border bg-works-card">
      <div role="group" aria-label={label} className="p-3 md:p-5">
        <div
          ref={mountRef}
          aria-hidden="true"
          className="works-mermaid w-full"
        />
        {status === "loading" ? (
          <p className="text-tiny text-works-muted">
            Loading architecture diagram&hellip;
          </p>
        ) : null}
      </div>

      <div
        className={
          status === "error" ? "border-t border-works-border p-5" : "sr-only"
        }
      >
        {Array.isArray(outline) ? (
          <ul className="max-w-reading list-disc space-y-1.5 pl-5 text-tiny leading-relaxed text-works-muted">
            {outline.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          outline
        )}
      </div>
    </div>
  );
});

export default MermaidDiagram;
