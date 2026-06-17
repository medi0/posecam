import { DigiFilter } from '../store/usePoseCamStore'

export function applyDigiFilter(ctx: CanvasRenderingContext2D, w: number, h: number, filter: DigiFilter) {
  if (filter === 'none') return
  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2]

    if (filter === 'canon-ixus') {
      // Warm, slightly overexposed, soft
      r = Math.min(255, r * 1.12 + 10)
      g = Math.min(255, g * 1.05 + 5)
      b = Math.min(255, b * 0.92)
      // Slight grain
      const grain = (Math.random() - 0.5) * 8
      r = Math.min(255, Math.max(0, r + grain))
      g = Math.min(255, Math.max(0, g + grain * 0.8))
      b = Math.min(255, Math.max(0, b + grain * 0.6))
    } else if (filter === 'sony-cyber') {
      // Vivid, saturated, cool
      const avg = (r + g + b) / 3
      r = Math.min(255, avg + (r - avg) * 1.3)
      g = Math.min(255, avg + (g - avg) * 1.25)
      b = Math.min(255, avg + (b - avg) * 1.35 + 8)
    } else if (filter === 'ccd-warm') {
      // CCD warm tones
      r = Math.min(255, r * 1.08 + 15)
      g = Math.min(255, g * 1.02 + 5)
      b = Math.min(255, b * 0.88 - 5)
      // Slight bloom on highlights
      if (r > 200) r = Math.min(255, r + 10)
    } else if (filter === 'y2k-flash') {
      // Flash overexposure
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      const boost = lum > 180 ? 1.18 : 1.04
      r = Math.min(255, r * boost + 12)
      g = Math.min(255, g * boost + 8)
      b = Math.min(255, b * boost)
      // Chromatic aberration effect (simple)
      if (i % 80 === 0) {
        d[i] = Math.min(255, d[i] + 4)
        d[i + 2] = Math.min(255, d[i + 2] - 4)
      }
    }

    d[i] = r; d[i + 1] = g; d[i + 2] = b
  }
  ctx.putImageData(imageData, 0, 0)
}

export function captureFrame(
  video: HTMLVideoElement,
  overlayImage: HTMLImageElement | null,
  overlayState: { opacity: number; scale: number; rotation: number; x: number; y: number; flipH: boolean },
  filter: DigiFilter,
  gridMode: string,
  mirrorCapture: boolean = false
): string {
  const canvas = document.createElement('canvas')
  const vw = video.videoWidth || 1280
  const vh = video.videoHeight || 720
  canvas.width = vw
  canvas.height = vh
  const ctx = canvas.getContext('2d')!

  // Draw video (mirrored horizontally if requested, to match an Android-style selfie preview)
  ctx.save()
  if (mirrorCapture) {
    ctx.translate(vw, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(video, 0, 0, vw, vh)
  ctx.restore()

  // Apply filter
  applyDigiFilter(ctx, vw, vh, filter)

  // Draw overlay (drawn after the mirror restore, so it stays correctly oriented
  // regardless of whether the underlying camera frame was flipped)
  if (overlayImage && overlayState.opacity > 0) {
    ctx.save()
    ctx.globalAlpha = overlayState.opacity
    const cx = vw / 2 + overlayState.x
    const cy = vh / 2 + overlayState.y
    ctx.translate(cx, cy)
    ctx.rotate((overlayState.rotation * Math.PI) / 180)
    ctx.scale(overlayState.flipH ? -overlayState.scale : overlayState.scale, overlayState.scale)
    ctx.drawImage(overlayImage, -vw / 2, -vh / 2, vw, vh)
    ctx.restore()
  }

  return canvas.toDataURL('image/jpeg', 0.92)
}

export function analyzeComposition(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width || 320
  canvas.height = img.height || 240
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const w = canvas.width, h = canvas.height
  const data = ctx.getImageData(0, 0, w, h).data

  // Sample brightness regions to guess subject placement
  const topBright = avgBrightness(data, w, h, 0, 0, w, h / 3)
  const midBright = avgBrightness(data, w, h, 0, h / 3, w, (2 * h) / 3)
  const botBright = avgBrightness(data, w, h, 0, (2 * h) / 3, w, h)

  const leftBright = avgBrightness(data, w, h, 0, 0, w / 3, h)
  const midHBright = avgBrightness(data, w, h, w / 3, 0, (2 * w) / 3, h)
  const rightBright = avgBrightness(data, w, h, (2 * w) / 3, 0, w, h)

  const subject = leftBright > rightBright + 15 ? 'Left third' :
    rightBright > leftBright + 15 ? 'Right third' : 'Center'

  const horizon = topBright > botBright + 20 ? 'Lower third' :
    botBright > topBright + 20 ? 'Upper third' : 'Middle'

  const cameraHeight = topBright > botBright + 30 ? 'High angle' :
    botBright > topBright + 30 ? 'Low angle' : 'Eye level'

  const edgeBright = (topBright + botBright) / 2
  const cameraAngle = Math.abs(leftBright - rightBright) > 25 ? 'Tilted' : 'Straight'

  return { subject, horizon, cameraHeight, cameraAngle }
}

function avgBrightness(
  data: Uint8ClampedArray, w: number, h: number,
  x0: number, y0: number, x1: number, y1: number
): number {
  let sum = 0, count = 0
  for (let y = Math.floor(y0); y < Math.floor(y1); y += 4) {
    for (let x = Math.floor(x0); x < Math.floor(x1); x += 4) {
      const idx = (y * w + x) * 4
      sum += 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
      count++
    }
  }
  return count > 0 ? sum / count : 0
}
