import { useCallback, useRef } from "react";
import { usePoseCamStore } from "../store/usePoseCamStore";

/**
 * Runs a countdown from `seconds` to 0, updating countdownValue in the store
 * each second, then invokes onComplete. Returns a `start` function and a
 * `cancel` function to abort mid-countdown (e.g. if the user navigates away).
 */
export function useCountdown() {
  const { setIsCountingDown, setCountdownValue } = usePoseCamStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsCountingDown(false);
    setCountdownValue(0);
  }, [setIsCountingDown, setCountdownValue]);

  const start = useCallback(
    (seconds: number, onComplete: () => void) => {
      if (seconds <= 0) {
        onComplete();
        return;
      }
      cancelledRef.current = false;
      setIsCountingDown(true);
      let remaining = seconds;
      setCountdownValue(remaining);

      const tick = () => {
        if (cancelledRef.current) return;
        remaining -= 1;
        if (remaining <= 0) {
          setCountdownValue(0);
          setIsCountingDown(false);
          onComplete();
          return;
        }
        setCountdownValue(remaining);
        timeoutRef.current = setTimeout(tick, 1000);
      };
      timeoutRef.current = setTimeout(tick, 1000);
    },
    [setIsCountingDown, setCountdownValue],
  );

  return { start, cancel };
}
