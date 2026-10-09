import { useEffect, useState } from "react";
import { StageLights } from "./canvas/StageLights";
import { Spotlight } from "./ui/Spotlight";
import { DeckView } from "./presentation/DeckView";
import { usePresentation } from "./presentation/presentationStore";
import { useKeyboardControls } from "./presentation/useKeyboardControls";
import { useDeepLink } from "./presentation/useDeepLink";
import { ControlDock } from "./presentation/ControlDock";
import { ProgressBar } from "./presentation/ProgressBar";
import { NotesDrawer } from "./presentation/NotesDrawer";
import { useAutoplay } from "./presentation/useAutoplay";
import { WhiteboardLayer } from "./whiteboard/WhiteboardLayer";
import { WhiteboardToolbar } from "./whiteboard/WhiteboardToolbar";
import { useWhiteboard } from "./whiteboard/whiteboardStore";
import { HelpOverlay } from "./ui/HelpOverlay";
import { ReadMode } from "./ui/ReadMode";

/**
 * The show. A vertical scroll-snap deck (DeckView) of 13 theatrical frames over
 * an ambient golden-brown stage-light backdrop, with the presenter tools
 * (speaker notes, auto-play, whiteboard, read mode, help) layered on top.
 */
export default function App() {
  const [notesOpen, setNotesOpen] = useState(false);
  const [autoplayOn, setAutoplayOn] = useState(false);
  const [whiteboardOn, setWhiteboardOn] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [readOpen, setReadOpen] = useState(false);

  useDeepLink();
  useKeyboardControls({
    onToggleNotes: () => setNotesOpen((v) => !v),
    onToggleAutoplay: () => setAutoplayOn((v) => !v),
    onToggleWhiteboard: () => setWhiteboardOn((v) => !v),
    onToggleHelp: () => setHelpOpen((v) => !v),
    onToggleRead: () => setReadOpen((v) => !v),
    onEscape: () => {
      if (helpOpen) return setHelpOpen(false), true;
      if (readOpen) return setReadOpen(false), true;
      if (whiteboardOn) return setWhiteboardOn(false), true;
      if (notesOpen) return setNotesOpen(false), true;
      return false;
    },
  });

  // Auto-play scrolls through the frames, pacing each by its own duration.
  useAutoplay(autoplayOn, () => setAutoplayOn(false));

  // The finale's prompt drops a sticky onto the current slide (and opens the WB).
  useEffect(() => {
    const onDrop = (e: Event) => {
      const detail = (e as CustomEvent<{ text?: string }>).detail;
      const frame = usePresentation.getState().index;
      useWhiteboard
        .getState()
        .addSticky(
          window.innerWidth / 2 - 130,
          window.innerHeight / 2 - 100,
          frame,
          detail?.text ?? "",
        );
      setWhiteboardOn(true);
    };
    window.addEventListener("amt:drop-sticky", onDrop);
    return () => window.removeEventListener("amt:drop-sticky", onDrop);
  }, []);

  return (
    <main className="relative h-full w-full overflow-hidden bg-bg text-white">
      {/* Ambient golden-brown stage lighting, fixed behind the deck */}
      <StageLights />

      {/* Dim golden spotlight that trails the cursor, behind the cards */}
      <Spotlight />

      {/* The scrollable slide deck */}
      <DeckView locked={whiteboardOn} />

      {/* Screen-space annotation overlay (freezes the deck while active) */}
      <WhiteboardLayer active={whiteboardOn} />

      {/* Presenter chrome */}
      <ProgressBar />
      <ControlDock
        notesOpen={notesOpen}
        onToggleNotes={() => setNotesOpen((v) => !v)}
        autoplayOn={autoplayOn}
        onToggleAutoplay={() => setAutoplayOn((v) => !v)}
        whiteboardOn={whiteboardOn}
        onToggleWhiteboard={() => setWhiteboardOn((v) => !v)}
        onToggleHelp={() => setHelpOpen((v) => !v)}
        onToggleRead={() => setReadOpen((v) => !v)}
      />

      <NotesDrawer open={notesOpen} onClose={() => setNotesOpen(false)} />
      <WhiteboardToolbar open={whiteboardOn} />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ReadMode open={readOpen} onClose={() => setReadOpen(false)} />
    </main>
  );
}
