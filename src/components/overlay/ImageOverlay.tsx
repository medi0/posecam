import React, { useRef, useCallback } from 'react'
import { usePoseCamStore } from '../../store/usePoseCamStore'

interface ImageOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>
}

export function ImageOverlay({ containerRef }: ImageOverlayProps) {
  const { overlay, setOverlayPosition } = usePoseCamStore()
  const dragRef = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0 })

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (overlay.locked) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, ox: overlay.x, oy: overlay.y }
  }, [overlay.locked, overlay.x, overlay.y])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setOverlayPosition(dragRef.current.ox + dx, dragRef.current.oy + dy)
  }, [setOverlayPosition])

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false
  }, [])

  if (!overlay.image) return null

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div
        className={`absolute inset-0 ${overlay.locked ? '' : 'pointer-events-auto cursor-move'}`}
        style={{
          transform: `translate(${overlay.x}px, ${overlay.y}px) scale(${overlay.scale}) rotate(${overlay.rotation}deg) scaleX(${overlay.flipH ? -1 : 1})`,
          opacity: overlay.opacity,
          transformOrigin: 'center center',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <img
          src={overlay.image}
          alt="Overlay"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
      </div>
    </div>
  )
}
