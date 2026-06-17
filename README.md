# 📷 PoseCam

**Recreate any photo composition. Upload inspiration, overlay on camera, match and shoot.**

PoseCam is a PWA that helps photographers, travelers, and content creators recreate poses, framing, and compositions from reference photos in real time using a camera overlay.

---

## Features

- **Ghost Overlay** — Upload any photo (Pinterest, Instagram, gallery) and it appears semi-transparent over your live camera feed
- **Overlay Controls** — Adjust opacity, scale, rotation, and drag to reposition freely
- **Composition Analysis** — AI estimates subject placement, horizon position, camera height & angle
- **Grid Guides** — Rule of thirds, golden ratio, and symmetry overlays
- **DigiCam Filters** — Canon IXUS, Sony Cyber-shot, CCD Warm, Y2K Flash aesthetics
- **Self-Timer** — 3s / 5s / 10s countdown before the shutter fires
- **Burst Mode** — Configurable shot count (1/3/5/8) and interval between shots, with a progress indicator
- **Mirror Mode** — Flip the live preview like an Android front camera, with an independent toggle to also flip the saved photo
- **Shot Templates** — Save your overlay, grid, filter, and mirror setup as a named template (e.g. "Waterfall Pose", "Café Window Shot") and reapply it later in one tap
- **Gallery** — Save shots with side-by-side comparison to inspiration; burst shots are grouped with swipe navigation to pick the keeper
- **PWA** — Installable on mobile, works offline

---

## Stack

| Layer     | Tech                  |
| --------- | --------------------- |
| Framework | React 18 + TypeScript |
| Bundler   | Vite                  |
| Styling   | Tailwind CSS          |
| State     | Zustand               |
| Camera    | MediaDevices API      |
| Image     | Canvas API            |
| Deploy    | GitHub Pages          |

---

## Getting Started

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/posecam.git
cd posecam

# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

> **Note:** Camera requires HTTPS. `npm run dev` uses localhost (allowed), but deployed builds need HTTPS (GitHub Pages provides this automatically).

---

## Deployment (GitHub Pages)

1. Update `vite.config.ts` base to match your repo: `base: '/your-repo-name/'`
2. Run `npm run deploy`
3. In GitHub repo settings → Pages → set source to `gh-pages` branch

---

## Usage

1. **Home** — Overview and "Start Shooting" button
2. **Studio** — Main camera view
   - Tap **↑** (upload) to pick an inspiration photo
   - Inspiration appears as ghost overlay
   - Drag overlay to reposition; use sliders to adjust opacity/scale/rotation
   - Switch grids (⅓ thirds, φ golden, ⊕ symmetry)
   - Toggle DigiCam filter for nostalgic CCD look
   - Open the **Capture** tab to set a self-timer (3/5/10s), configure burst mode (shot count + interval), or enable mirror preview
   - Tap the bookmark icon to save the current setup as a **Shot Template**, or apply one you saved earlier
   - Tap shutter circle to capture (countdown and burst run automatically if enabled)
3. **Gallery** — View, compare, and download shots; burst sequences are grouped together with arrows/dots to step through and pick the best one

---

## Project Structure

```
posecam/
├── src/
│   ├── components/
│   │   ├── camera/       # ControlsPanel (overlay, grid, digicam, capture tabs)
│   │   ├── composition/  # CompositionPanel, TemplatesPanel
│   │   ├── overlay/      # GridOverlay, ImageOverlay
│   │   └── ui/           # NavBar, Slider
│   ├── hooks/
│   │   ├── useCamera.ts     # Camera stream management, front/back switch
│   │   └── useCountdown.ts  # Self-timer countdown logic
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── StudioPage.tsx
│   │   └── GalleryPage.tsx
│   ├── store/
│   │   └── usePoseCamStore.ts  # Zustand global state (overlay, mirror, timer, burst, templates)
│   └── utils/
│       └── canvasUtils.ts  # Filter application, frame capture (incl. mirror), composition analysis
├── public/
└── dist/               # Build output
```

---

## Roadmap

- [ ] MediaPipe pose skeleton overlay with % match score
- [ ] Camera Distance Indicator (needs subject/body detection — currently deferred, see note below)
- [ ] Perspective Matching / tilt detection (same dependency as above)
- [ ] Remote Photographer Mode — guide a friend's phone in real time (needs a lightweight realtime backend; deferred)
- [ ] AR perspective alignment
- [ ] Pinterest board import (multiple references)
- [ ] AI composition rating (0–100)
- [ ] Travel Shot Planner — pre-trip shot lists
- [ ] Color palette extraction from inspiration

**Note on Distance Indicator and Perspective Matching:** both depend on detecting the subject's body in the _live_ camera feed, not just the inspiration photo. The composition analysis already in this build only samples brightness regions of the inspiration image, which isn't enough to estimate live framing. Doing this properly needs a body/pose detection model (e.g. MediaPipe Pose) running on the live feed, which is a meaningfully heavier addition — it pulls in a model bundle, needs lazy-loading so first paint isn't blocked, and runs continuously rather than once per shot. Worth scoping as its own pass.

---

## License

MIT
