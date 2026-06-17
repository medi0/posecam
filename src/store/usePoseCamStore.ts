import { create } from "zustand";

export type Page = "home" | "studio" | "gallery";
export type GridMode = "none" | "thirds" | "golden" | "symmetry";
export type DigiFilter =
  | "none"
  | "canon-ixus"
  | "sony-cyber"
  | "ccd-warm"
  | "y2k-flash";
export type TimerDuration = 0 | 3 | 5 | 10;
export type BurstCount = 1 | 3 | 5 | 8;

export interface OverlayState {
  image: string | null;
  opacity: number;
  scale: number;
  rotation: number;
  x: number;
  y: number;
  locked: boolean;
  flipH: boolean;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  inspirationUrl: string | null;
  timestamp: number;
  label?: string;
  burstGroup?: string;
  cleanDataUrl: string;
  overlayBaked: boolean;
}

export interface CompositionHint {
  subject: string;
  horizon: string;
  cameraHeight: string;
  cameraAngle: string;
}

export interface ShotTemplate {
  id: string;
  name: string;
  emoji: string;
  overlayImage: string | null;
  overlay: Omit<OverlayState, "image">;
  gridMode: GridMode;
  digiFilter: DigiFilter;
  mirrorPreview: boolean;
  createdAt: number;
}

interface PoseCamState {
  page: Page;
  overlay: OverlayState;
  gridMode: GridMode;
  digiFilter: DigiFilter;
  showControls: boolean;
  photos: CapturedPhoto[];
  compositionHints: CompositionHint | null;
  //added the two below to state
  saveOverlayInPhoto: boolean;
  setSaveOverlayInPhoto: (v: boolean) => void;
  // Mirror
  mirrorPreview: boolean; // flips the live feed preview (selfie-style, like Android front camera)
  mirrorCapture: boolean; // also flips the saved/captured photo, not just the preview

  // Timer
  timerDuration: TimerDuration;
  isCountingDown: boolean;
  countdownValue: number;

  // Burst
  burstCount: BurstCount;
  burstInterval: number; // ms between shots
  isBursting: boolean;
  burstProgress: number; // shots taken so far in current burst

  // Templates
  templates: ShotTemplate[];
  activeTemplateId: string | null;

  setPage: (page: Page) => void;
  setOverlayImage: (image: string | null) => void;
  setOverlayOpacity: (opacity: number) => void;
  setOverlayScale: (scale: number) => void;
  setOverlayRotation: (rotation: number) => void;
  setOverlayPosition: (x: number, y: number) => void;
  setOverlayLocked: (locked: boolean) => void;
  setOverlayFlipH: (flipH: boolean) => void;
  resetOverlay: () => void;
  setGridMode: (mode: GridMode) => void;
  setDigiFilter: (filter: DigiFilter) => void;
  toggleControls: () => void;
  addPhoto: (photo: CapturedPhoto) => void;
  deletePhoto: (id: string) => void;
  setCompositionHints: (hints: CompositionHint | null) => void;

  setMirrorPreview: (v: boolean) => void;
  setMirrorCapture: (v: boolean) => void;

  setTimerDuration: (d: TimerDuration) => void;
  setIsCountingDown: (v: boolean) => void;
  setCountdownValue: (v: number) => void;

  setBurstCount: (n: BurstCount) => void;
  setBurstInterval: (ms: number) => void;
  setIsBursting: (v: boolean) => void;
  setBurstProgress: (n: number) => void;

  saveTemplate: (name: string, emoji: string) => void;
  applyTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
}

const defaultOverlay: OverlayState = {
  image: null,
  opacity: 0.45,
  scale: 1,
  rotation: 0,
  x: 0,
  y: 0,
  locked: false,
  flipH: false,
};

const TEMPLATES_KEY = "posecam_templates_v1";

function loadTemplates(): ShotTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistTemplates(templates: ShotTemplate[]) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch {
    // storage full or unavailable — fail silently, templates stay in-memory for this session
  }
}

export const usePoseCamStore = create<PoseCamState>((set, get) => ({
  page: "home",
  overlay: defaultOverlay,
  gridMode: "thirds",
  digiFilter: "none",
  showControls: true,
  photos: [],
  compositionHints: null,
  saveOverlayInPhoto: false,
  setSaveOverlayInPhoto: (v) => set({ saveOverlayInPhoto: v }),

  mirrorPreview: false,
  mirrorCapture: false,

  timerDuration: 0,
  isCountingDown: false,
  countdownValue: 0,

  burstCount: 1,
  burstInterval: 500,
  isBursting: false,
  burstProgress: 0,

  templates: loadTemplates(),
  activeTemplateId: null,

  setPage: (page) => set({ page }),

  setOverlayImage: (image) =>
    set((s) => ({
      overlay: { ...s.overlay, image, x: 0, y: 0, scale: 1, rotation: 0 },
      activeTemplateId: null,
    })),

  setOverlayOpacity: (opacity) =>
    set((s) => ({ overlay: { ...s.overlay, opacity } })),
  setOverlayScale: (scale) =>
    set((s) => ({ overlay: { ...s.overlay, scale } })),
  setOverlayRotation: (rotation) =>
    set((s) => ({ overlay: { ...s.overlay, rotation } })),
  setOverlayPosition: (x, y) =>
    set((s) => ({ overlay: { ...s.overlay, x, y } })),
  setOverlayLocked: (locked) =>
    set((s) => ({ overlay: { ...s.overlay, locked } })),
  setOverlayFlipH: (flipH) =>
    set((s) => ({ overlay: { ...s.overlay, flipH } })),
  resetOverlay: () => set({ overlay: defaultOverlay, activeTemplateId: null }),
  setGridMode: (gridMode) => set({ gridMode }),
  setDigiFilter: (digiFilter) => set({ digiFilter }),
  toggleControls: () => set((s) => ({ showControls: !s.showControls })),
  addPhoto: (photo) => set((s) => ({ photos: [photo, ...s.photos] })),
  deletePhoto: (id) =>
    set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),
  setCompositionHints: (compositionHints) => set({ compositionHints }),

  setMirrorPreview: (mirrorPreview) => set({ mirrorPreview }),
  setMirrorCapture: (mirrorCapture) => set({ mirrorCapture }),

  setTimerDuration: (timerDuration) => set({ timerDuration }),
  setIsCountingDown: (isCountingDown) => set({ isCountingDown }),
  setCountdownValue: (countdownValue) => set({ countdownValue }),

  setBurstCount: (burstCount) => set({ burstCount }),
  setBurstInterval: (burstInterval) => set({ burstInterval }),
  setIsBursting: (isBursting) => set({ isBursting }),
  setBurstProgress: (burstProgress) => set({ burstProgress }),

  saveTemplate: (name, emoji) => {
    const s = get();
    const template: ShotTemplate = {
      id: Date.now().toString(),
      name,
      emoji,
      overlayImage: s.overlay.image,
      overlay: {
        opacity: s.overlay.opacity,
        scale: s.overlay.scale,
        rotation: s.overlay.rotation,
        x: s.overlay.x,
        y: s.overlay.y,
        locked: s.overlay.locked,
        flipH: s.overlay.flipH,
      },
      gridMode: s.gridMode,
      digiFilter: s.digiFilter,
      mirrorPreview: s.mirrorPreview,
      createdAt: Date.now(),
    };
    const templates = [template, ...s.templates];
    persistTemplates(templates);
    set({ templates, activeTemplateId: template.id });
  },

  applyTemplate: (id) => {
    const s = get();
    const t = s.templates.find((t) => t.id === id);
    if (!t) return;
    set({
      overlay: { ...t.overlay, image: t.overlayImage },
      gridMode: t.gridMode,
      digiFilter: t.digiFilter,
      mirrorPreview: t.mirrorPreview,
      activeTemplateId: t.id,
      compositionHints: null,
    });
  },

  deleteTemplate: (id) => {
    const s = get();
    const templates = s.templates.filter((t) => t.id !== id);
    persistTemplates(templates);
    set({
      templates,
      activeTemplateId: s.activeTemplateId === id ? null : s.activeTemplateId,
    });
  },
}));
