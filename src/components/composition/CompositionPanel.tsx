import React from 'react'
import { Eye, Compass, Camera, Layers } from 'lucide-react'
import { usePoseCamStore } from '../../store/usePoseCamStore'

const ICON_MAP: Record<string, React.ReactNode> = {
  subject: <Layers size={13} />,
  horizon: <Eye size={13} />,
  cameraHeight: <Camera size={13} />,
  cameraAngle: <Compass size={13} />,
}

const LABEL_MAP: Record<string, string> = {
  subject: 'Subject',
  horizon: 'Horizon',
  cameraHeight: 'Height',
  cameraAngle: 'Angle',
}

export function CompositionPanel() {
  const { compositionHints } = usePoseCamStore()
  if (!compositionHints) return null

  const entries = Object.entries(compositionHints) as [string, string][]

  return (
    <div className="glass-dark rounded-2xl p-3 shadow-xl">
      <p className="text-[10px] text-white/50 font-medium tracking-widest uppercase mb-2.5 px-1">Composition</p>
      <div className="grid grid-cols-2 gap-2">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-white/8 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-accent-400">{ICON_MAP[key]}</span>
            <div>
              <p className="text-[9px] text-white/40 font-medium leading-none">{LABEL_MAP[key]}</p>
              <p className="text-xs text-white font-semibold mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
