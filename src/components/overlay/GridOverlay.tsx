import React from 'react'
import { GridMode } from '../../store/usePoseCamStore'

interface GridOverlayProps {
  mode: GridMode
}

export function GridOverlay({ mode }: GridOverlayProps) {
  if (mode === 'none') return null

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {mode === 'thirds' && (
        <>
          {/* Vertical lines */}
          <line x1="33.33" y1="0" x2="33.33" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
          <line x1="66.66" y1="0" x2="66.66" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
          {/* Horizontal lines */}
          <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
          <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="rgba(255,255,255,0.35)" strokeWidth="0.3" />
          {/* Intersection dots */}
          {[33.33, 66.66].map(x => [33.33, 66.66].map(y => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" fill="rgba(255,255,255,0.7)" />
          )))}
        </>
      )}
      {mode === 'golden' && (
        <>
          {/* Golden ratio ~61.8% */}
          <line x1="38.2" y1="0" x2="38.2" y2="100" stroke="rgba(255,215,100,0.45)" strokeWidth="0.3" />
          <line x1="61.8" y1="0" x2="61.8" y2="100" stroke="rgba(255,215,100,0.45)" strokeWidth="0.3" />
          <line x1="0" y1="38.2" x2="100" y2="38.2" stroke="rgba(255,215,100,0.45)" strokeWidth="0.3" />
          <line x1="0" y1="61.8" x2="100" y2="61.8" stroke="rgba(255,215,100,0.45)" strokeWidth="0.3" />
          {/* Phi symbol hint */}
          <text x="1" y="4" fontSize="3" fill="rgba(255,215,100,0.6)" fontFamily="serif">φ</text>
        </>
      )}
      {mode === 'symmetry' && (
        <>
          {/* Center cross */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(150,200,255,0.5)" strokeWidth="0.35" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(150,200,255,0.5)" strokeWidth="0.35" />
          {/* Diagonal guides */}
          <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(150,200,255,0.2)" strokeWidth="0.2" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(150,200,255,0.2)" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="1.2" fill="rgba(150,200,255,0.7)" />
        </>
      )}
    </svg>
  )
}
