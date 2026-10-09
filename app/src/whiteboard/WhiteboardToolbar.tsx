import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Highlighter,
  StickyNote,
  Type,
  Crosshair,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { useWhiteboard, PEN_COLORS } from "./whiteboardStore";
import type { Tool } from "./types";

const TOOLS: { id: Tool; icon: typeof PenTool; label: string }[] = [
  { id: "pen", icon: PenTool, label: "Pen" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "sticky", icon: StickyNote, label: "Sticky note" },
  { id: "text", icon: Type, label: "Text" },
  { id: "laser", icon: Crosshair, label: "Laser pointer" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

function ToolButton({
  on,
  label,
  onClick,
  children,
}: {
  on?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
        on
          ? "bg-gold text-bg"
          : "text-muted-text hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div className="mx-1 h-6 w-px bg-white/10" />;

export function WhiteboardToolbar({ open }: { open: boolean }) {
  const tool = useWhiteboard((s) => s.tool);
  const color = useWhiteboard((s) => s.color);
  const size = useWhiteboard((s) => s.size);
  const setTool = useWhiteboard((s) => s.setTool);
  const setColor = useWhiteboard((s) => s.setColor);
  const setSize = useWhiteboard((s) => s.setSize);
  const undo = useWhiteboard((s) => s.undo);
  const redo = useWhiteboard((s) => s.redo);
  const clearAll = useWhiteboard((s) => s.clearAll);
  const exportJSON = useWhiteboard((s) => s.exportJSON);
  const importJSON = useWhiteboard((s) => s.importJSON);

  const fileRef = useRef<HTMLInputElement>(null);

  // Undo / redo shortcuts while the whiteboard is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, undo, redo]);

  const handleExport = () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      if (!importJSON(txt)) window.alert("Could not import: invalid whiteboard file.");
    });
    e.target.value = "";
  };

  const handleClear = () => {
    if (window.confirm("Clear the entire whiteboard? This cannot be undone easily."))
      clearAll();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-40 flex -translate-x-1/2 justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 440, damping: 38 }}
          className="pointer-events-auto flex max-w-[94vw] flex-wrap items-center justify-center gap-1 rounded-2xl border border-gold/20 bg-panel/95 px-2 py-2 shadow-card backdrop-blur-xl"
          role="toolbar"
          aria-label="Whiteboard tools"
        >
          {TOOLS.map((t) => (
            <ToolButton
              key={t.id}
              on={tool === t.id}
              label={t.label}
              onClick={() => setTool(t.id)}
            >
              <t.icon size={18} />
            </ToolButton>
          ))}

          <Divider />

          {/* Colours */}
          {PEN_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Ink colour ${c}`}
              aria-pressed={color === c}
              className={`h-7 w-7 rounded-full transition-transform ${
                color === c ? "scale-110 ring-2 ring-white" : "ring-1 ring-white/20"
              }`}
              style={{ background: c }}
            />
          ))}

          <Divider />

          {/* Sizes */}
          <ToolButton on={size === "thin"} label="Thin nib" onClick={() => setSize("thin")}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </ToolButton>
          <ToolButton
            on={size === "thick"}
            label="Thick nib"
            onClick={() => setSize("thick")}
          >
            <span className="h-3.5 w-3.5 rounded-full bg-current" />
          </ToolButton>

          <Divider />

          <ToolButton label="Undo (⌘Z)" onClick={undo}>
            <Undo2 size={18} />
          </ToolButton>
          <ToolButton label="Redo (⇧⌘Z)" onClick={redo}>
            <Redo2 size={18} />
          </ToolButton>

          <Divider />

          <ToolButton label="Export whiteboard" onClick={handleExport}>
            <Download size={18} />
          </ToolButton>
          <ToolButton label="Import whiteboard" onClick={() => fileRef.current?.click()}>
            <Upload size={18} />
          </ToolButton>
          <ToolButton label="Clear all" onClick={handleClear}>
            <Trash2 size={18} />
          </ToolButton>

          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
