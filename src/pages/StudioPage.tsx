import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Upload,
  SwitchCamera,
  ChevronUp,
  ChevronDown,
  Trash2,
  Eye,
  EyeOff,
  Bookmark,
  FlipHorizontal2,
} from "lucide-react";
import { useCamera } from "../hooks/useCamera";
import { useCountdown } from "../hooks/useCountdown";
import { usePoseCamStore } from "../store/usePoseCamStore";
import { GridOverlay } from "../components/overlay/GridOverlay";
import { ImageOverlay } from "../components/overlay/ImageOverlay";
import { ControlsPanel } from "../components/camera/ControlsPanel";
import { CompositionPanel } from "../components/composition/CompositionPanel";
import { TemplatesPanel } from "../components/composition/TemplatesPanel";
import { captureFrame, analyzeComposition } from "../utils/canvasUtils";

export function StudioPage() {
  const { videoRef, error, isReady, startCamera, flipCamera } = useCamera();
  const { start: startCountdown, cancel: cancelCountdown } = useCountdown();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [activePanel, setActivePanel] = useState<"controls" | "templates">(
    "controls",
  );
  const [isFlashing, setIsFlashing] = useState(false);

  const {
    overlay,
    gridMode,
    digiFilter,
    showControls,
    setOverlayImage,
    addPhoto,
    setCompositionHints,
    toggleControls,
    mirrorPreview,
    mirrorCapture,
    timerDuration,
    isCountingDown,
    countdownValue,
    burstCount,
    burstInterval,
    isBursting,
    burstProgress,
    setIsBursting,
    setBurstProgress,
  } = usePoseCamStore();

  useEffect(() => {
    startCamera();
    return () => cancelCountdown();
  }, []);

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setOverlayImage(src);

        const img = new Image();
        img.onload = () => {
          const hints = analyzeComposition(img);
          setCompositionHints(hints);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [setOverlayImage, setCompositionHints],
  );

  // Takes a single frame and saves it. mirrorCapture is read fresh from the
  // store each time rather than captured in a closure, since burst sequences
  // run over multiple seconds.
  const takeSingleShot = useCallback(
    (burstGroup?: string) => {
      if (!videoRef.current) return;
      const state = usePoseCamStore.getState();

      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 180);

      const overlayImg = state.overlay.image
        ? (() => {
            const img = new Image();
            img.src = state.overlay.image!;
            return img;
          })()
        : null;

      const dataUrl = captureFrame(
        videoRef.current,
        overlayImg,
        state.overlay,
        state.digiFilter,
        state.gridMode,
        state.mirrorPreview && state.mirrorCapture,
      );

      addPhoto({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        dataUrl,
        inspirationUrl: state.overlay.image,
        timestamp: Date.now(),
        burstGroup,
      });
    },
    [videoRef, addPhoto],
  );

  // Runs the burst sequence: burstCount shots, burstInterval ms apart.
  const runBurst = useCallback(() => {
    const state = usePoseCamStore.getState();
    const count = state.burstCount;
    const interval = state.burstInterval;
    const groupId = count > 1 ? `burst-${Date.now()}` : undefined;

    setIsBursting(true);
    setBurstProgress(0);

    let shotsTaken = 0;
    const fireShot = () => {
      takeSingleShot(groupId);
      shotsTaken += 1;
      setBurstProgress(shotsTaken);
      if (shotsTaken < count) {
        setTimeout(fireShot, interval);
      } else {
        setTimeout(() => {
          setIsBursting(false);
          setBurstProgress(0);
        }, 200);
      }
    };
    fireShot();
  }, [takeSingleShot, setIsBursting, setBurstProgress]);

  // Entry point for the shutter button: applies the self-timer (if set),
  // then fires either a single shot or a burst sequence.
  const handleShutterPress = useCallback(() => {
    if (isCountingDown || isBursting) return;
    startCountdown(timerDuration, () => {
      runBurst();
    });
  }, [isCountingDown, isBursting, timerDuration, startCountdown, runBurst]);

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      ref={containerRef}
    >
      {/* Camera feed — mirrored horizontally when mirrorPreview is on, like an Android front camera */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: mirrorPreview ? "scaleX(-1)" : "none" }}
        autoPlay
        muted
        playsInline
      />

      {/* Digi filter applied via CSS for preview */}
      {digiFilter !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            mixBlendMode: "multiply",
            ...(digiFilter === "canon-ixus"
              ? { background: "rgba(255,235,190,0.08)" }
              : digiFilter === "sony-cyber"
                ? { background: "rgba(180,200,255,0.06)" }
                : digiFilter === "ccd-warm"
                  ? { background: "rgba(255,210,160,0.1)" }
                  : digiFilter === "y2k-flash"
                    ? { background: "rgba(255,255,255,0.07)" }
                    : {}),
          }}
        />
      )}

      {/* Film grain for digi filters */}
      {digiFilter !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "150px",
          }}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center p-8">
            <p className="text-white/80 text-sm mb-3">{error}</p>
            <button
              onClick={() => startCamera()}
              className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Capture flash */}
      {isFlashing && (
        <div
          className="absolute inset-0 bg-white z-50 pointer-events-none"
          style={{ opacity: 0.75 }}
        />
      )}

      {/* Countdown overlay */}
      {isCountingDown && countdownValue > 0 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <span
            key={countdownValue}
            className="text-white font-bold drop-shadow-2xl"
            style={{ fontSize: "7rem", animation: "pulse 1s ease-out" }}
          >
            {countdownValue}
          </span>
        </div>
      )}

      {/* Burst progress indicator */}
      {isBursting && burstCount > 1 && (
        <div className="absolute top-16 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="glass-dark rounded-full px-4 py-1.5 flex items-center gap-1.5">
            {Array.from({ length: burstCount }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i < burstProgress ? "bg-accent-400" : "bg-white/25"
                }`}
              />
            ))}
            <span className="text-white/70 text-[10px] font-medium ml-1">
              {burstProgress}/{burstCount}
            </span>
          </div>
        </div>
      )}

      {/* Image overlay */}
      <ImageOverlay containerRef={containerRef} />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <GridOverlay mode={gridMode} />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between">
        <div className="glass-dark rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-white/80 text-xs font-semibold tracking-widest">
            POSECAM
          </span>
          {mirrorPreview && (
            <FlipHorizontal2 size={11} className="text-accent-300" />
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActivePanel("templates");
              setShowPanel(true);
            }}
            className="glass-dark rounded-full w-9 h-9 flex items-center justify-center"
          >
            <Bookmark size={14} className="text-white/80" />
          </button>
          <button
            onClick={toggleControls}
            className="glass-dark rounded-full w-9 h-9 flex items-center justify-center"
          >
            {showControls ? (
              <EyeOff size={15} className="text-white/80" />
            ) : (
              <Eye size={15} className="text-white/80" />
            )}
          </button>
        </div>
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
            onClick={() => {
              usePoseCamStore.getState().setOverlayImage(null);
              usePoseCamStore.getState().setCompositionHints(null);
            }}
            className="glass-dark w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        )}
      </div>

      {/* Shutter */}
      <div className="absolute bottom-20 left-0 right-0 z-30 flex flex-col items-center gap-3">
        <button
          onClick={handleShutterPress}
          disabled={isCountingDown || isBursting}
          className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-60"
        >
          <div
            className={`rounded-full border-[3px] w-12 h-12 ${isBursting ? "border-accent-400" : "border-gray-300"}`}
          />
        </button>
        {(timerDuration > 0 || burstCount > 1) &&
          !isCountingDown &&
          !isBursting && (
            <p className="text-white/60 text-[10px] font-medium glass-dark rounded-full px-2.5 py-0.5">
              {timerDuration > 0 ? `${timerDuration}s timer` : ""}
              {timerDuration > 0 && burstCount > 1 ? " · " : ""}
              {burstCount > 1 ? `burst ×${burstCount}` : ""}
            </p>
          )}
      </div>

      {/* Bottom panel */}
      {showControls && (
        <div className="absolute bottom-36 left-0 right-0 z-30 px-4 space-y-3">
          <div className="flex justify-center">
            <button
              onClick={() => setShowPanel((p) => !p)}
              className="glass-dark rounded-full px-4 py-1 flex items-center gap-1.5 text-white/70 text-xs"
            >
              {showPanel ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              {showPanel ? "Hide" : "Controls"}
            </button>
          </div>

          {showPanel && (
            <>
              {activePanel === "templates" ? (
                <TemplatesPanel onClose={() => setActivePanel("controls")} />
              ) : (
                <>
                  <CompositionPanel />
                  <ControlsPanel />
                </>
              )}
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
  );
}
