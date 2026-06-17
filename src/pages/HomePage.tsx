import React from 'react'
import { Camera, Layers, Zap, Image } from 'lucide-react'
import { usePoseCamStore } from '../store/usePoseCamStore'

const STEPS = [
  {
    n: '01',
    icon: <Image size={22} className="text-accent-500" />,
    title: 'Upload inspiration',
    desc: 'Save any photo from Pinterest, Instagram, or your gallery',
  },
  {
    n: '02',
    icon: <Layers size={22} className="text-accent-500" />,
    title: 'Ghost overlay',
    desc: 'Your reference appears semi-transparent over the live camera',
  },
  {
    n: '03',
    icon: <Camera size={22} className="text-accent-500" />,
    title: 'Match & shoot',
    desc: 'Align yourself, dial in the composition, and capture',
  },
]

const FEATURES = [
  { icon: '⅓', label: 'Rule of thirds', desc: 'Composition grids' },
  { icon: 'φ', label: 'Golden ratio', desc: 'Proportional guide' },
  { icon: '📷', label: 'DigiCam', desc: 'CCD & IXUS filters' },
  { icon: '🔒', label: 'Lock overlay', desc: 'Freeze & shoot' },
]

export function HomePage() {
  const { setPage } = usePoseCamStore()

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-cream-100" style={{paddingBottom: '72px'}}>
      {/* Hero */}
      <div className="relative bg-warm-600 overflow-hidden" style={{minHeight: '55vh'}}>
        {/* Decorative overlay photo mockup */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-32 h-44 rounded-2xl bg-white/30 rotate-[-6deg]" />
          <div className="absolute top-8 left-8 w-32 h-44 rounded-2xl border-2 border-white/50 rotate-[-6deg] overflow-hidden flex items-end pb-2 pl-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
          </div>
          <div className="absolute top-12 right-8 w-32 h-44 rounded-2xl bg-accent-400/40 rotate-[4deg]" />
        </div>
        
        <div className="relative z-10 px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 mb-6">
            <Zap size={12} className="text-accent-300" />
            <span className="text-white/80 text-xs font-medium tracking-wide">Camera Overlay Assistant</span>
          </div>
          
          <h1 className="text-white font-bold leading-tight mb-4" style={{fontSize: 'clamp(2rem,8vw,3rem)'}}>
            Shoot like your<br />
            <em className="not-italic text-accent-300">inspiration.</em>
          </h1>
          
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xs">
            Upload any photo — Pinterest, Instagram, your camera roll — and recreate the exact pose, framing, and composition.
          </p>
          
          <button
            onClick={() => setPage('studio')}
            className="bg-white text-warm-600 font-semibold px-8 py-3.5 rounded-full shadow-xl text-sm active:scale-95 transition-transform"
          >
            Start Shooting
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="px-6 py-10">
        <p className="text-[10px] font-semibold tracking-widest text-warm-400 uppercase mb-5">How it works</p>
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-400/15 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-warm-400 font-mono font-bold">{step.n}</span>
                  <h3 className="text-warm-600 font-semibold text-sm">{step.title}</h3>
                </div>
                <p className="text-warm-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="px-6 pb-10">
        <p className="text-[10px] font-semibold tracking-widest text-warm-400 uppercase mb-4">Features</p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="font-semibold text-warm-600 text-sm">{f.label}</p>
              <p className="text-warm-400 text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div className="mx-6 mb-4 bg-warm-600 rounded-3xl p-6 text-center">
        <p className="text-white font-bold text-lg mb-1">Ready to recreate it?</p>
        <p className="text-white/60 text-xs mb-4">Works on mobile, PWA, and desktop</p>
        <button
          onClick={() => setPage('studio')}
          className="bg-accent-400 text-white font-semibold px-7 py-2.5 rounded-full text-sm"
        >
          Open Camera Studio →
        </button>
      </div>
    </div>
  )
}
