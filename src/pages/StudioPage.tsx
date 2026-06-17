import React, { useEffect, useRef, useCallback, useState } from 'react'
import {
  Upload, SwitchCamera, Circle, ChevronUp, ChevronDown,
  Trash2, Eye, EyeOff
} from 'lucide-react'
import { useCamera } from '../hooks/useCamera'
import { usePoseCamStore } from '../store/usePoseCamStore'
import { GridOverlay } from '../components/overlay/GridOverlay'
import { ImageOverlay } from '../components/overlay/ImageOverlay'
import { ControlsPanel } from '../components/camera/ControlsPanel'
import { CompositionPanel } from '../components/composition/CompositionPanel'
import { captureFrame, analyzeComposition } from '../utils/canvasUtils'

export function StudioPage() {
  const { videoRef, error, isReady, startCamera, flipCamera } = useCamera()
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPanel, setShowPanel] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false)

  const {
    overlay, gridMode, digiFilter, showControls,
    setOverlayImage, addPhoto, setCompositionHints, toggleControls
  } = usePoseCamStore()

  useEffect(() => {
    startCamera()
  }, [])

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      setOverlayImage(src)

      // Analyze composition
      const img = new Image()
      img.onload = () => {
        const hints = analyzeComposition(img)
        setCompositionHints(hints)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [setOverlayImage, setCompositionHints])

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || isCapturing) return
    setIsCapturing(true)

    // Flash effect
    setTimeout(() => setIsCapturing(false), 300)

    const overlayImg = overlay.image ? (() => {
      const img = new Image()
      img.src = overlay.image!
      return img
    })() : null

    const dataUrl = captureFrame(
      videoRef.current,
      overlayImg,
      overlay,
      digiFilter,
      gridMode
    )

    addPhoto({
      id: Date.now().toString(),
      dataUrl,
      inspirationUrl: overlay.image,
      timestamp: Date.now(),
    })
  }, [videoRef, overlay, digiFilter, gridMode, addPhoto, isCapturing])

  return (
    <div className="relative w-full h-full bg-black overflow-hidden" ref={containerRef}>
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Digi filter applied via CSS for preview */}
      {digiFilter !== 'none' && (
        <div className="absolute inset-0 pointer-events-none" style={{
          mixBlendMode: 'multiply',
          ...(digiFilter === 'canon-ixus' ? { background: 'rgba(255,235,190,0.08)' } :
             digiFilter === 'sony-cyber' ? { background: 'rgba(180,200,255,0.06)' } :
             digiFilter === 'ccd-warm' ? { background: 'rgba(255,210,160,0.1)' } :
             digiFilter === 'y2k-flash' ? { background: 'rgba(255,255,255,0.07)' } : {})
        }} />
      )}

      {/* Film grain for digi filters */}
      {digiFilter !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '150px' }}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center p-8">
            <p className="text-white/80 text-sm mb-3">{error}</p>
            <button onClick={() => startCamera()} className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Capture flash */}
      {isCapturing && <div className="absolute inset-0 bg-white z-50 opacity-80 pointer-events-none animate-ping" style={{animationDuration:'0.15s',animationIterationCount:1}} />}

      {/* Image overlay */}
      <ImageOverlay containerRef={containerRef} />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <GridOverlay mode={gridMode} />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between">
        <div className="glass-dark rounded-full px-3 py-1.5">
          <span className="text-white/80 text-xs font-semibold tracking-widest">POSECAM</span>
        </div>
        <button
          onClick={toggleControls}
          className="glass-dark rounded-full w-9 h-9 flex items-center justify-center"
        >
          {showControls ? <EyeOff size={15} className="text-white/80" /> : <Eye size={15} className="text-white/80" />}
        </button>
      </div>

      {/* Right side buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        <button
          onClick={flipCamera}
          className="glass-dark w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        >
          <SwitchCamera size={18} className="text-white" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="glass-dark w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        >
          <Upload size={18} className="text-white" />
        </button>
        {overlay.image && (
          <button
            onClick={() => { usePoseCamStore.getState().setOverlayImage(null); usePoseCamStore.getState().setCompositionHints(null) }}
            className="glass-dark w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        )}
      </div>

      {/* Shutter */}
      <div className="absolute bottom-20 left-0 right-0 z-30 flex flex-col items-center gap-3">
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
        >
          <div className="rounded-full border-[3px] border-gray-300 w-12 h-12" />
        </button>
      </div>

      {/* Bottom controls panel */}
      {showControls && (
        <div className="absolute bottom-36 left-0 right-0 z-30 px-4 space-y-3">
          {/* Toggle panel */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowPanel(p => !p)}
              className="glass-dark rounded-full px-4 py-1 flex items-center gap-1.5 text-white/70 text-xs"
            >
              {showPanel ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              {showPanel ? 'Hide' : 'Controls'}
            </button>
          </div>

          {showPanel && (
            <>
              <CompositionPanel />
              <ControlsPanel />
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}
