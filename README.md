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
- **Gallery** — Save shots with side-by-side comparison to inspiration
- **PWA** — Installable on mobile, works offline

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Camera | MediaDevices API |
| Image | Canvas API |
| Deploy | GitHub Pages |

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
   - Tap shutter circle to capture
3. **Gallery** — View, compare, and download shots

---

## Project Structure

```
posecam/
├── src/
│   ├── components/
│   │   ├── camera/       # ControlsPanel
│   │   ├── composition/  # CompositionPanel
│   │   ├── overlay/      # GridOverlay, ImageOverlay
│   │   └── ui/           # NavBar, Slider
│   ├── hooks/
│   │   └── useCamera.ts  # Camera stream management
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── StudioPage.tsx
│   │   └── GalleryPage.tsx
│   ├── store/
│   │   └── usePoseCamStore.ts  # Zustand global state
│   └── utils/
│       └── canvasUtils.ts  # Filter application, frame capture, composition analysis
├── public/
└── dist/               # Build output
```

---

## Roadmap

- [ ] MediaPipe pose skeleton overlay with % match score
- [ ] AR perspective alignment
- [ ] Pinterest board import (multiple references)
- [ ] Shot template system ("Nohkalikai viewpoint", "Shillong café aesthetic")
- [ ] AI composition rating (0–100)
- [ ] Friends Mode — remote guide another photographer
- [ ] Travel Shot Planner — pre-trip shot lists
- [ ] Color palette extraction from inspiration

---

## License

MIT
