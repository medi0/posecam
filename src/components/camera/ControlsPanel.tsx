import React, { useState } from 'react'
import { Sliders, Grid3X3, Zap, Lock, Unlock, FlipHorizontal, RotateCcw, X } from 'lucide-react'
import { usePoseCamStore, GridMode, DigiFilter } from '../../store/usePoseCamStore'
import { Slider } from '../ui/Slider'

const GRID_OPTIONS: { id: GridMode; label: string }[] = [
  { id: 'none', label: 'Off' },
  { id: 'thirds', label: '⅓' },
  { id: 'golden', label: 'φ' },
  { id: 'symmetry', label: '⊕' },
]

const FILTER_OPTIONS: { id: DigiFilter; label: string; emoji: string }[] = [
  { id: 'none', label: 'Natural', emoji: '○' },
  { id: 'canon-ixus', label: 'IXUS', emoji: '📷' },
  { id: 'sony-cyber', label: 'Cyber', emoji: '🔵' },
  { id: 'ccd-warm', label: 'CCD', emoji: '🟡' },
  { id: 'y2k-flash', label: 'Flash', emoji: '⚡' },
]

type Tab = 'overlay' | 'grid' | 'digicam'

export function ControlsPanel() {
  const {
    overlay, gridMode, digiFilter,
    setOverlayOpacity, setOverlayScale, setOverlayRotation,
    setOverlayLocked, setOverlayFlipH, resetOverlay,
    setGridMode, setDigiFilter,
  } = usePoseCamStore()

  const [activeTab, setActiveTab] = useState<Tab>('overlay')

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'overlay', icon: <Sliders size={14} />, label: 'Overlay' },
    { id: 'grid', icon: <Grid3X3 size={14} />, label: 'Grid' },
    { id: 'digicam', icon: <Zap size={14} />, label: 'DigiCam' },
  ]

  return (
    <div className="glass-dark rounded-2xl overflow-hidden shadow-2xl">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id ? 'text-white border-b-2 border-accent-400' : 'text-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'overlay' && (
          <>
            <Slider label="Opacity" value={Math.round(overlay.opacity * 100)} min={0} max={100}
              onChange={v => setOverlayOpacity(v / 100)} format={v => `${v}%`} />
            <Slider label="Scale" value={Math.round(overlay.scale * 100)} min={30} max={250}
              onChange={v => setOverlayScale(v / 100)} format={v => `${v}%`} />
            <Slider label="Rotate" value={overlay.rotation} min={-180} max={180}
              onChange={setOverlayRotation} format={v => `${v}°`} />
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setOverlayLocked(!overlay.locked)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  overlay.locked ? 'bg-accent-500/80 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                {overlay.locked ? <Lock size={12} /> : <Unlock size={12} />}
                {overlay.locked ? 'Locked' : 'Lock'}
              </button>
              <button
                onClick={() => setOverlayFlipH(!overlay.flipH)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  overlay.flipH ? 'bg-accent-500/80 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                <FlipHorizontal size={12} />
                Flip
              </button>
              <button
                onClick={resetOverlay}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-white/10 text-white/70"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>
          </>
        )}

        {activeTab === 'grid' && (
          <div className="grid grid-cols-4 gap-2">
            {GRID_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setGridMode(opt.id)}
                className={`py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  gridMode === opt.id ? 'bg-white text-gray-900' : 'bg-white/10 text-white/70'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'digicam' && (
          <div className="grid grid-cols-5 gap-1.5">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setDigiFilter(opt.id)}
                className={`flex flex-col items-center py-2.5 rounded-lg text-center transition-colors ${
                  digiFilter === opt.id ? 'bg-white text-gray-900' : 'bg-white/10 text-white/70'
                }`}
              >
                <span className="text-lg leading-none mb-0.5">{opt.emoji}</span>
                <span className="text-[10px] font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
