import { useEffect, useRef, useState, useCallback } from 'react'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isReady, setIsReady] = useState(false)

  const startCamera = useCallback(async (facing: 'user' | 'environment' = facingMode) => {
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
      setIsReady(false)
      setError(null)
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsReady(true)
        }
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
      console.error(err)
    }
  }, [facingMode, stream])

  const flipCamera = useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    startCamera(next)
  }, [facingMode, startCamera])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setIsReady(false)
  }, [stream])

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [stream])

  return { videoRef, stream, error, isReady, facingMode, startCamera, flipCamera, stopCamera }
}
