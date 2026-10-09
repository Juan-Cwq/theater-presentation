import { useCallback, useEffect, useRef, useState } from "react";
import { useWhiteboard } from "./whiteboardStore";
import { strokeToPath } from "./strokePath";
import { usePresentation } from "../presentation/presentationStore";
import type { StickyElement, TextElement } from "./types";

/**
 * Screen-space whiteboard overlay for the scroll deck.
 *
 * When active it covers the viewport and freezes the deck (the current slide
 * stays put), letting you annotate whatever is on screen. Every element is
 * tagged with the current frame, so ink only shows on the slide it was drawn
 * on. Coordinates are plain viewport pixels relative to the capture surface.
 */

interface LaserPoint {
  x: number;
  y: number;
  t: number;
}

export function WhiteboardLayer({ active }: { active: boolean }) {
  const elements = useWhiteboard((s) => s.elements);
  const tool = useWhiteboard((s) => s.tool);
  const color = useWhiteboard((s) => s.color);
  const sizeKey = useWhiteboard((s) => s.size);
  const frame = usePresentation((s) => s.index);

  const surfaceRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const erasing = useRef(false);
  const pts = useRef<number[][]>([]);
  const [liveStroke, setLiveStroke] = useState<string | null>(null);
  const [laser, setLaser] = useState<LaserPoint[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const strokeSize = sizeKey === "thick" ? 10 : 4;

  /** Pointer → viewport-local coordinates (relative to the capture surface). */
  const toLocal = useCallback((clientX: number, clientY: number) => {
    const rect = surfaceRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  /** Find the topmost element on the current frame hit by a point. */
  const hitTest = useCallback(
    (wx: number, wy: number): string | null => {
      const list = useWhiteboard
        .getState()
        .elements.filter((el) => el.frame === frame);
      for (let i = list.length - 1; i >= 0; i--) {
        const el = list[i];
        if (el.type === "stroke") {
          const r = el.size / 2 + 12;
          for (const [px, py] of el.points) {
            if ((px - wx) ** 2 + (py - wy) ** 2 <= r * r) return el.id;
          }
        } else if (el.type === "sticky") {
          if (wx >= el.x && wx <= el.x + 260 && wy >= el.y && wy <= el.y + 200)
            return el.id;
        } else {
          if (wx >= el.x - 10 && wx <= el.x + 360 && wy >= el.y - 10 && wy <= el.y + 70)
            return el.id;
        }
      }
      return null;
    },
    [frame],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active || e.button !== 0) return;
    const { x, y } = toLocal(e.clientX, e.clientY);
    const store = useWhiteboard.getState();

    if (tool === "pen" || tool === "highlighter") {
      drawing.current = true;
      pts.current = [[x, y, e.pressure || 0.5]];
      surfaceRef.current?.setPointerCapture(e.pointerId);
      setLiveStroke(strokeToPath(pts.current, strokeSize, tool === "highlighter"));
    } else if (tool === "eraser") {
      erasing.current = true;
      surfaceRef.current?.setPointerCapture(e.pointerId);
      const id = hitTest(x, y);
      if (id) store.eraseElement(id);
    } else if (tool === "laser") {
      surfaceRef.current?.setPointerCapture(e.pointerId);
      setLaser([{ x, y, t: performance.now() }]);
    } else if (tool === "sticky") {
      const id = store.addSticky(x - 130, y - 100, frame);
      setEditingId(id);
    } else if (tool === "text") {
      const id = store.addText(x, y - 20, frame);
      setEditingId(id);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    if (drawing.current) {
      const { x, y } = toLocal(e.clientX, e.clientY);
      pts.current.push([x, y, e.pressure || 0.5]);
      setLiveStroke(strokeToPath(pts.current, strokeSize, tool === "highlighter"));
    } else if (erasing.current) {
      const { x, y } = toLocal(e.clientX, e.clientY);
      const id = hitTest(x, y);
      if (id) useWhiteboard.getState().eraseElement(id);
    } else if (tool === "laser" && e.buttons === 1) {
      const { x, y } = toLocal(e.clientX, e.clientY);
      setLaser((prev) => [...prev.slice(-24), { x, y, t: performance.now() }]);
    }
  };

  const onPointerUp = () => {
    if (drawing.current) {
      drawing.current = false;
      if (pts.current.length > 1) {
        useWhiteboard.getState().addStroke({
          frame,
          kind: tool === "highlighter" ? "highlighter" : "pen",
          color,
          size: strokeSize,
          points: pts.current,
        });
      }
      pts.current = [];
      setLiveStroke(null);
    }
    erasing.current = false;
  };

  // Fade out the laser trail.
  useEffect(() => {
    if (laser.length === 0) return;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      setLaser((prev) => prev.filter((p) => now - p.t < 650));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [laser.length === 0]);

  const drawingTool =
    tool === "pen" || tool === "highlighter" || tool === "eraser" || tool === "laser";
  const cursor =
    tool === "eraser"
      ? "cell"
      : tool === "text"
        ? "text"
        : drawingTool
          ? "crosshair"
          : "default";

  // Only annotations for the current slide are shown.
  const visible = elements.filter((el) => el.frame === frame);

  return (
    <div
      aria-hidden={!active}
      className="absolute inset-0 z-20"
      style={{ pointerEvents: "none" }}
    >
      {/* Capture surface (behind the ink/notes) */}
      <div
        ref={surfaceRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          pointerEvents: active ? "auto" : "none",
          cursor,
          touchAction: "none",
        }}
      />

      {/* Committed strokes + live stroke + laser */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 31, pointerEvents: "none", overflow: "visible" }}
      >
        {visible.map((el) =>
          el.type === "stroke" ? (
            <path
              key={el.id}
              d={strokeToPath(el.points, el.size, el.kind === "highlighter")}
              fill={el.color}
              fillOpacity={el.kind === "highlighter" ? 0.32 : 1}
              style={el.kind === "highlighter" ? { mixBlendMode: "screen" } : undefined}
            />
          ) : null,
        )}
        {liveStroke && (
          <path
            d={liveStroke}
            fill={color}
            fillOpacity={tool === "highlighter" ? 0.32 : 1}
            style={tool === "highlighter" ? { mixBlendMode: "screen" } : undefined}
          />
        )}
        {laser.map((p, i) => {
          const age = (performance.now() - p.t) / 650;
          const r = i === laser.length - 1 ? 9 : 5;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={r}
              fill="#FF3B4E"
              opacity={Math.max(0, 1 - age)}
              style={{ filter: "drop-shadow(0 0 8px #FF3B4E)" }}
            />
          );
        })}
      </svg>

      {/* Sticky notes + text */}
      {visible.map((el) =>
        el.type === "sticky" ? (
          <StickyNote
            key={el.id}
            el={el}
            interactive={active && tool === "sticky"}
            editing={editingId === el.id}
            onEdit={() => setEditingId(el.id)}
            onBlur={() => setEditingId((id) => (id === el.id ? null : id))}
          />
        ) : el.type === "text" ? (
          <TextNote
            key={el.id}
            el={el}
            interactive={active && tool === "text"}
            editing={editingId === el.id}
            onEdit={() => setEditingId(el.id)}
            onBlur={() => setEditingId((id) => (id === el.id ? null : id))}
          />
        ) : null,
      )}
    </div>
  );
}

function StickyNote({
  el,
  interactive,
  editing,
  onEdit,
  onBlur,
}: {
  el: StickyElement;
  interactive: boolean;
  editing: boolean;
  onEdit: () => void;
  onBlur: () => void;
}) {
  const update = useWhiteboard((s) => s.updateElementText);
  return (
    <div
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: 260,
        minHeight: 200,
        zIndex: 32,
        pointerEvents: interactive ? "auto" : "none",
      }}
      onDoubleClick={onEdit}
    >
      <div
        className="flex h-full min-h-[200px] w-[260px] flex-col rounded-[14px] p-4 shadow-card"
        style={{
          background: "linear-gradient(160deg, #F6E7B4, #E7C873)",
          transform: "rotate(-1.4deg)",
          color: "#2A2016",
        }}
      >
        {editing ? (
          <textarea
            autoFocus
            defaultValue={el.text}
            onChange={(e) => update(el.id, e.target.value)}
            onBlur={onBlur}
            className="h-full min-h-[168px] w-full resize-none bg-transparent font-serif text-[22px] leading-snug outline-none"
            placeholder="Type a note…"
          />
        ) : (
          <p className="whitespace-pre-wrap font-serif text-[22px] leading-snug">
            {el.text || "Double-click to edit"}
          </p>
        )}
      </div>
    </div>
  );
}

function TextNote({
  el,
  interactive,
  editing,
  onEdit,
  onBlur,
}: {
  el: TextElement;
  interactive: boolean;
  editing: boolean;
  onEdit: () => void;
  onBlur: () => void;
}) {
  const update = useWhiteboard((s) => s.updateElementText);
  return (
    <div
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        zIndex: 32,
        pointerEvents: interactive ? "auto" : "none",
      }}
      onDoubleClick={onEdit}
    >
      {editing ? (
        <input
          autoFocus
          defaultValue={el.text}
          onChange={(e) => update(el.id, e.target.value)}
          onBlur={onBlur}
          className="min-w-[280px] bg-transparent font-serif text-[40px] outline-none"
          style={{ color: el.color }}
          placeholder="Type…"
        />
      ) : (
        <span className="font-serif text-[40px]" style={{ color: el.color }}>
          {el.text || "Text"}
        </span>
      )}
    </div>
  );
}
