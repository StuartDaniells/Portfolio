import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Modal from "react-modal";

/**
 * Click-to-zoom overlay for Mermaid architecture diagrams.
 *
 * Reuses `react-modal` (already a project dependency) so the diagram can be
 * enlarged, zoomed with the wheel or the controls, and panned by dragging.
 * The overlay is self-contained: no changes are made to the page layout or to
 * other components, and closing returns focus to the element that opened it.
 */

const MIN_SCALE = 0.25;
const MAX_SCALE = 6;

interface Point {
  x: number;
  y: number;
}

/** Reads the diagram's natural dimensions from its SVG viewBox. */
const parseViewBox = (svg: string): { w: number; h: number } | null => {
  const match = svg.match(/viewBox=["']([^"']+)["']/);
  if (!match) return null;
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4) return null;
  const [, , w, h] = parts;
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return null;
  }
  return { w, h };
};

interface DiagramLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  /** Accessible name for the enlarged diagram. */
  label: string;
  /** Rendered SVG markup to enlarge. */
  svg: string;
}

const DiagramLightbox = ({
  isOpen,
  onClose,
  label,
  svg,
}: DiagramLightboxProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ start: Point; tx: number; ty: number } | null>(null);
  const [view, setView] = useState({ scale: 1, tx: 0, ty: 0 });
  const [dragging, setDragging] = useState(false);

  const natural = useMemo(() => parseViewBox(svg), [svg]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      Modal.setAppElement(document.getElementById("root") ?? document.body);
    }
  }, []);

  const fit = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || !natural) return;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    if (!vw || !vh) return;
    const scale = Math.min(vw / natural.w, vh / natural.h, 1);
    setView({
      scale,
      tx: (vw - natural.w * scale) / 2,
      ty: (vh - natural.h * scale) / 2,
    });
  }, [natural]);

  useEffect(() => {
    if (!isOpen) return;
    fit();
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [isOpen, fit]);

  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    setView((current) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor));
      const k = next / current.scale;
      return {
        scale: next,
        tx: cx - (cx - current.tx) * k,
        ty: cy - (cy - current.ty) * k,
      };
    });
  }, []);

  const zoomCenter = (factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, factor);
  };

  // Attach wheel zoom natively: React registers wheel handlers as passive on
  // the root, which prevents preventDefault() from suppressing page scroll.
  useEffect(() => {
    if (!isOpen) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const delta =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      zoomAt(
        event.clientX - rect.left,
        event.clientY - rect.top,
        delta < 0 ? 1.15 : 1 / 1.15
      );
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [isOpen, zoomAt]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      start: { x: event.clientX, y: event.clientY },
      tx: view.tx,
      ty: view.ty,
    };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setView((current) => ({
      ...current,
      tx: drag.tx + (event.clientX - drag.start.x),
      ty: drag.ty + (event.clientY - drag.start.y),
    }));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const contentStyle: React.CSSProperties = natural
    ? {
        width: natural.w,
        height: natural.h,
        transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
        transformOrigin: "0 0",
      }
    : { width: "fit-content", maxWidth: "none" };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      shouldReturnFocusAfterClose
      style={{
        overlay: {
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          backgroundColor: "rgba(17, 17, 17, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        },
        content: {
          position: "relative",
          inset: "auto",
          display: "flex",
          flexDirection: "column",
          width: "min(96vw, 1200px)",
          height: "min(90vh, 800px)",
          margin: 0,
          padding: 0,
          border: "none",
          borderRadius: "1rem",
          background: "transparent",
          overflow: "hidden",
        },
      }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-works-border bg-works-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-works-border px-4 py-3">
          <h2
            id="diagram-lightbox-title"
            className="truncate font-robotoSlab text-sm font-semibold text-works-text md:text-base"
          >
            {label}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enlarged diagram"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-works-border text-works-muted transition-colors duration-200 hover:border-works-accent hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              &times;
            </span>
          </button>
        </div>

        {/* Zoom/pan viewport */}
        <div
          ref={viewportRef}
          role="group"
          aria-label={`Enlarged diagram: ${label}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => zoomCenter(1.5)}
          className={`min-h-0 flex-1 overflow-hidden bg-[#ffffff] dark:bg-[#161616] ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          } select-none`}
          style={{ touchAction: "none" }}
        >
          <div
            className="diagram-lightbox-svg-wrap origin-top-left"
            style={contentStyle}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <style>{`.diagram-lightbox-svg-wrap svg { display: block; width: 100%; height: 100%; max-width: none !important; }`}</style>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 border-t border-works-border px-4 py-3">
          <button
            type="button"
            onClick={() => zoomCenter(1 / 1.25)}
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-works-border text-lg text-works-muted transition-colors duration-200 hover:border-works-accent hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent"
          >
            <span aria-hidden="true">&minus;</span>
          </button>
          <button
            type="button"
            onClick={fit}
            aria-label="Reset zoom"
            className="min-w-[4.5rem] rounded-lg border border-works-border px-3 py-2 text-tiny font-medium tabular-nums text-works-muted transition-colors duration-200 hover:border-works-accent hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent"
          >
            {Math.round(view.scale * 100)}%
          </button>
          <button
            type="button"
            onClick={() => zoomCenter(1.25)}
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-works-border text-lg text-works-muted transition-colors duration-200 hover:border-works-accent hover:text-works-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-works-accent"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <p className="px-4 pb-3 text-center text-[0.6875rem] text-works-muted">
          Scroll to zoom · drag to pan · press Esc to close
        </p>
      </div>
    </Modal>
  );
};

export default DiagramLightbox;
