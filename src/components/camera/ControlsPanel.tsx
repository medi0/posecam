import React, { useState } from 'react'
import { Sliders, Grid3X3, Zap, Lock, Unlock, FlipHorizontal, RotateCcw, Timer, Layers3, FlipHorizontal2, Check } from 'lucide-react'
import { usePoseCamStore, GridMode, DigiFilter, TimerDuration, BurstCount } from '../../store/usePoseCamStore'
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

const TIMER_OPTIONS: TimerDuration[] = [0, 3, 5, 10]
const BURST_OPTIONS: BurstCount[] = [1, 3, 5, 8]

type Tab = 'overlay' | 'grid' | 'digicam' | 'capture'

export function ControlsPanel() {
  const {
    overlay, gridMode, digiFilter,
    setOverlayOpacity, setOverlayScale, setOverlayRotation,
    setOverlayLocked, setOverlayFlipH, resetOverlay,
    setGridMode, setDigiFilter,
    mirrorPreview, mirrorCapture, setMirrorPreview, setMirrorCapture,
    timerDuration, setTimerDuration,
    burstCount, setBurstCount, burstInterval, setBurstInterval,
    saveOverlayInPhoto, setSaveOverlayInPhoto,
  } = usePoseCamStore()

  const [activeTab, setActiveTab] = useState<Tab>('overlay')

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'overlay', icon: <Sliders size={14} />, label: 'Overlay' },
    { id: 'grid', icon: <Grid3X3 size={14} />, label: 'Grid' },
    { id: 'digicam', icon: <Zap size={14} />, label: 'DigiCam' },
    { id: 'capture', icon: <Timer size={14} />, label: 'Capture' },
  ]

  return (
    <div className="glass-dark rounded-2xl overflow-hidden shadow-2xl">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
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

        {activeTab === 'capture' && (
          <>
            {/* Timer */}
            <div>
              <p className="flex items-center gap-1.5 text-[10px] text-white/50 font-medium tracking-widest uppercase mb-2">
                <Timer size={11} /> Self-timer
              </p>
              <div className="grid grid-cols-4 gap-2">
                {TIMER_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTimerDuration(t)}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      timerDuration === t ? 'bg-white text-gray-900' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {t === 0 ? 'Off' : `${t}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Burst */}
            <div>
              <p className="flex items-center gap-1.5 text-[10px] text-white/50 font-medium tracking-widest uppercase mb-2">
                <Layers3 size={11} /> Burst — {burstCount === 1 ? 'off' : `${burstCount} shots`}
              </p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {BURST_OPTIONS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBurstCount(b)}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      burstCount === b ? 'bg-white text-gray-900' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {b === 1 ? 'Off' : `×${b}`}
                  </button>
                ))}
              </div>
              {burstCount > 1 && (
                <Slider
                  label="Interval between shots"
                  value={burstInterval}
                  min={150}
                  max={1200}
                  step={50}
                  onChange={setBurstInterval}
                  format={v => `${v}ms`}
                />
              )}
            </div>

            {/* Mirror */}
            <div>
              <p className="flex items-center gap-1.5 text-[10px] text-white/50 font-medium tracking-widest uppercase mb-2">
                <FlipHorizontal2 size={11} /> Mirror
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMirrorPreview(!mirrorPreview)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    mirrorPreview ? 'bg-accent-500/80 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Mirror preview
                </button>
                <button
                  onClick={() => setMirrorCapture(!mirrorCapture)}
                  disabled={!mirrorPreview}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-30 ${
                    mirrorCapture ? 'bg-accent-500/80 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Mirror saved photo
                </button>
              </div>
              <p className="text-[10px] text-white/35 mt-1.5 leading-relaxed">
                Preview mirroring flips your live view like an Android selfie camera. Turn on "Mirror saved photo" too if you want the captured shot to match what you saw, rather than the true unflipped camera frame.
              </p>
            </div>

            {/* Save reference overlay — default OFF. Preview always shows the
                overlay; this only controls whether it's baked into the saved file. */}
            <div>
              <p className="text-[10px] text-white/50 font-medium tracking-widest uppercase mb-2">
                On capture
              </p>
              <button
                onClick={() => setSaveOverlayInPhoto(!saveOverlayInPhoto)}
                className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-lg bg-white/10 text-left"
              >
                <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  saveOverlayInPhoto ? 'bg-accent-400' : 'bg-white/15'
                }`}>
                  {saveOverlayInPhoto ? <Check size={11} className="text-white" /> : null}
                </span>
                <span className="text-xs text-white/80 font-medium">Save reference overlay in photo</span>
              </button>
              <p className="text-[10px] text-white/35 mt-1.5 leading-relaxed">
                Off by default — your saved photo is the clean camera shot only, even though the overlay stays visible while you're framing. Turn this on if you want the overlay baked into the file itself. Either way, you can compare the result against your inspiration afterward in the Gallery.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
