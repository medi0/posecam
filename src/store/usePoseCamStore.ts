import { create } from 'zustand'

export type Page = 'home' | 'studio' | 'gallery'
export type GridMode = 'none' | 'thirds' | 'golden' | 'symmetry'
export type DigiFilter = 'none' | 'canon-ixus' | 'sony-cyber' | 'ccd-warm' | 'y2k-flash'

export interface OverlayState {
  image: string | null
  opacity: number
  scale: number
  rotation: number
  x: number
  y: number
  locked: boolean
  flipH: boolean
}

export interface CapturedPhoto {
  id: string
  dataUrl: string
  inspirationUrl: string | null
  timestamp: number
  label?: string
}

export interface CompositionHint {
  subject: string
  horizon: string
  cameraHeight: string
  cameraAngle: string
}

interface PoseCamState {
  page: Page
  overlay: OverlayState
  gridMode: GridMode
  digiFilter: DigiFilter
  showControls: boolean
  photos: CapturedPhoto[]
  compositionHints: CompositionHint | null
  setPage: (page: Page) => void
  setOverlayImage: (image: string | null) => void
  setOverlayOpacity: (opacity: number) => void
  setOverlayScale: (scale: number) => void
  setOverlayRotation: (rotation: number) => void
  setOverlayPosition: (x: number, y: number) => void
  setOverlayLocked: (locked: boolean) => void
  setOverlayFlipH: (flipH: boolean) => void
  resetOverlay: () => void
  setGridMode: (mode: GridMode) => void
  setDigiFilter: (filter: DigiFilter) => void
  toggleControls: () => void
  addPhoto: (photo: CapturedPhoto) => void
  deletePhoto: (id: string) => void
  setCompositionHints: (hints: CompositionHint | null) => void
}

const defaultOverlay: OverlayState = {
  image: null, opacity: 0.45, scale: 1, rotation: 0, x: 0, y: 0, locked: false, flipH: false,
}

export const usePoseCamStore = create<PoseCamState>((set) => ({
  page: 'home',
  overlay: defaultOverlay,
  gridMode: 'thirds',
  digiFilter: 'none',
  showControls: true,
  photos: [],
  compositionHints: null,
  setPage: (page) => set({ page }),
  setOverlayImage: (image) => set((s) => ({ overlay: { ...s.overlay, image, x: 0, y: 0, scale: 1, rotation: 0 } })),
  setOverlayOpacity: (opacity) => set((s) => ({ overlay: { ...s.overlay, opacity } })),
  setOverlayScale: (scale) => set((s) => ({ overlay: { ...s.overlay, scale } })),
  setOverlayRotation: (rotation) => set((s) => ({ overlay: { ...s.overlay, rotation } })),
  setOverlayPosition: (x, y) => set((s) => ({ overlay: { ...s.overlay, x, y } })),
  setOverlayLocked: (locked) => set((s) => ({ overlay: { ...s.overlay, locked } })),
  setOverlayFlipH: (flipH) => set((s) => ({ overlay: { ...s.overlay, flipH } })),
  resetOverlay: () => set({ overlay: defaultOverlay }),
  setGridMode: (gridMode) => set({ gridMode }),
  setDigiFilter: (digiFilter) => set({ digiFilter }),
  toggleControls: () => set((s) => ({ showControls: !s.showControls })),
  addPhoto: (photo) => set((s) => ({ photos: [photo, ...s.photos] })),
  deletePhoto: (id) => set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),
  setCompositionHints: (compositionHints) => set({ compositionHints }),
}))
