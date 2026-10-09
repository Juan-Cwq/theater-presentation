# The American Musical Theatre · Chapter 9

An interactive, scroll-driven presentation of the Theatre Appreciation chapter
**“From _The Black Crook_ to _Hamilton_: The Story of the American Musical Theatre.”**

It plays like a polished one-page website: 13 full-screen slide "frames" are
stacked vertically, and you simply **scroll** (wheel, trackpad, touch, scrollbar
or arrow keys) to move through the story. Each slide snaps into place, plays a
unique theatrical entrance animation (a parting curtain, blown leaves, an iris, a
light sweep…), shows a big faded **year** watermark, and sits over an ambient
golden-brown stage-light backdrop. You can also run it hands-free (auto-play),
read it as a plain article, and annotate any slide live with a built-in whiteboard.

---

## Quick start

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

### Scripts

| Script             | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR                      |
| `npm run build`    | Type-check (`tsc -b`) then build the static site to `dist/` |
| `npm run preview`  | Serve the production build locally                      |
| `npm run test`     | Run the unit tests (Vitest)                             |
| `npm run test:watch` | Watch-mode unit tests                                 |
| `npm run lint`     | Type-check only (no emit)                               |

---

## How to drive it

### Navigate
| Input                                      | Action                     |
| ------------------------------------------ | -------------------------- |
| **Scroll / trackpad / swipe / scrollbar**  | Move through the slides    |
| `→` / `↓` / `Space` / `PageDown`           | Next frame                 |
| `←` / `↑` / `PageUp`                        | Previous frame             |
| Progress dots (bottom dock)                | Jump to any frame          |
| `Esc`                                      | Close an open panel        |

### Present tools
| Key | Action                                                        |
| --- | ------------------------------------------------------------ |
| `N` | Speaker-notes drawer with an elapsed timer (3–5 min target)  |
| `P` | Auto-play (advances each frame by its own duration)          |
| `R` | Read mode — a vertical, scrollable article version           |
| `?` | Keyboard-shortcut help overlay                               |

### Whiteboard
| Key / control          | Action                                            |
| ---------------------- | ------------------------------------------------- |
| `W`                    | Toggle the whiteboard (freezes the current slide) |
| Toolbar                | Pen (3 colours, 2 nib sizes), highlighter, sticky note, text, laser pointer, eraser |
| `⌘Z` / `Ctrl Z`        | Undo                                              |
| `⇧⌘Z` / `Ctrl Y`       | Redo                                              |
| Toolbar ⬇ / ⬆          | Export / import the whiteboard as JSON            |
| Toolbar 🗑              | Clear all (with confirmation)                     |

Annotations are **scoped per slide** and **persisted to `localStorage`**, so your
ink survives a reload and only shows on the slide it was drawn on.

### Deep links
Every frame has a hash URL, e.g. `#frame-6`. Opening that URL jumps straight to the
frame; scrolling updates the hash so you can bookmark or share any slide.

---

## Deploy (static site)

The app is a pure static build (no backend) and uses a **relative base** (`base: "./"`)
plus hash-based routing, so it works on any static host.

### Netlify (recommended)
A ready-to-use [`netlify.toml`](../netlify.toml) sits at the repo root:

```toml
[build]
  base = "app"
  command = "npm run build"
  publish = "dist"
```

- **Connect the repo:** in Netlify, "Add new site → Import from Git", pick the repo,
  and the `netlify.toml` fills in the build command (`npm run build`), base
  directory (`app`) and publish directory (`app/dist`) automatically. Deploy.
- **Or drag-and-drop:** run `npm run build` and drag the `app/dist` folder onto
  the Netlify dashboard.
- **Or the CLI:**
  ```bash
  npm i -g netlify-cli
  cd app && npm run build
  netlify deploy --prod --dir dist
  ```

### Vercel
1. Import the repo. Set **Root Directory** to `app`.
2. Framework preset: **Vite** (Build `npm run build`, Output `dist`). Deploy.

### GitHub Pages
```bash
cd app
npm run build              # outputs to app/dist
npx gh-pages -d dist       # publishes dist/ to the gh-pages branch
```

### Any other host
Run `npm run build` and serve the contents of `app/dist/` as static files.

---

## Project structure

```
app/
├── index.html              # Title, 🎭 favicon, OG tags, Google Fonts
├── public/og-image.svg     # Social share image
└── src/
    ├── canvas/             # Shared stage pieces + helpers
    │   ├── StageLights.tsx # Ambient golden-brown stage-light backdrop (static)
    │   ├── geometry.ts     # Frame/act definitions + the 1600×900 card size
    │   ├── cameraStore.ts  # prefers-reduced-motion helper (+ legacy camera math)
    │   └── math.ts / math.test.ts   # Pure, unit-tested helpers
    ├── content/            # Typed slide data — edit the deck here
    │   ├── types.ts        # Discriminated-union content model (layout → blocks)
    │   └── frames.ts       # The 13 frames: text, notes, durations, year, transition
    ├── frames/             # Rendering of a frame and its 13 distinct layouts
    │   ├── FrameCard.tsx, FrameRenderer.tsx, reveal.tsx
    │   ├── FrameTransition.tsx   # The 13 unique entrance animations
    │   └── layouts/*.tsx
    ├── presentation/       # The scroll deck + presenter tools
    │   ├── DeckView.tsx           # Vertical scroll-snap deck (the main view)
    │   ├── presentationStore.ts   # Current frame + scroll-driven navigation
    │   ├── useKeyboardControls.ts, useDeepLink.ts, useAutoplay.ts
    │   ├── ControlDock.tsx, ProgressBar.tsx, NotesDrawer.tsx
    ├── whiteboard/         # The per-slide annotation layer
    │   ├── whiteboardStore.ts, types.ts, strokePath.ts
    │   ├── WhiteboardLayer.tsx, WhiteboardToolbar.tsx
    ├── ui/                 # Shared bits: HelpOverlay, ReadMode, MarqueeBulbs,
    │                       #  CountUp, IconBadge, IconButton
    └── App.tsx, main.tsx, index.css
```

### Editing the content
All copy lives in **`src/content/frames.ts`** as typed data. Each frame declares a
`layout` (one of 13), its `blocks` (shape enforced by the layout type), speaker
`notes`, an auto-play `duration`, how many in-frame `reveals` it has, a big faded
`year` watermark, and a unique entrance `transition`. Change the text there and the
layouts update automatically.

### Per-slide transitions
Each frame plays a **unique entrance animation** when it scrolls into view
(curtain, blown leaves, iris, venetian shutter, banner unfold, flip, light sweep,
split, …). They're defined in **`src/frames/FrameTransition.tsx`**; a frame picks
one via its `transition` field. All honor `prefers-reduced-motion`.

---

## Tech

- **Vite + React 18 + TypeScript** (strict)
- **Tailwind CSS** with a custom "Broadway Marquee" theme
- **Framer Motion** for the entrance transitions and panel animations
- **Zustand** for presentation and whiteboard state
- **perfect-freehand** for pressure-tapered whiteboard ink (rendered as SVG)
- **Vitest** for the pure unit tests

### Performance
The deck is a **native vertical scroll-snap container**: the browser only paints
the one or two sections in view, there is no camera transform to re-rasterise
while moving, the stage-light backdrop is painted once and never animates, and
only the active frame runs an animation. This keeps scrolling smooth even with 13
rich, full-screen slides.

---

## Accessibility & motion

- Full keyboard navigation, visible gold focus rings, and ARIA roles/labels.
- Honors **`prefers-reduced-motion`**: entrance animations and decorative motion
  are neutralized and slides simply appear.
- **Read mode** (`R`) provides a linear, screen-reader-friendly article fallback.
- No stock photography or copyrighted imagery is used — every visual (marquee
  bulbs, stage lights, badges, icons) is pure CSS/SVG.
