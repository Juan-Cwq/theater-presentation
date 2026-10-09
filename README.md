# Theater Presentation

An interactive, scroll-driven presentation of the Theatre Appreciation chapter
**“From _The Black Crook_ to _Hamilton_: The Story of the American Musical Theatre.”**

It plays like a polished one-page website: 13 full-screen slides stacked
vertically that you move through by **scrolling**. Each slide snaps into place,
plays a unique theatrical entrance animation (parting curtain, blown leaves,
iris, light sweep…), shows a big faded **year** watermark, and sits over an
ambient golden-brown stage-light backdrop. Includes speaker notes with a timer,
hands-free auto-play, a plain-article read mode, and a per-slide whiteboard.

The app lives in [`app/`](./app) — see **[`app/README.md`](./app/README.md)** for
full docs (run, build, keyboard shortcuts, content editing, deploy).

## Quick start

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

## Deploy

Static build (Vite), deployable anywhere. A ready-to-use
[`netlify.toml`](./netlify.toml) is included — connect this repo in Netlify (or
drag-and-drop `app/dist`) and it deploys as-is.

## Tech

Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · Zustand ·
perfect-freehand · Vitest.
