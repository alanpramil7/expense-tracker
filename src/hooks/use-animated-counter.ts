import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useAnimatedCounter(
  target: number,
  duration = 1200,
  decimals = 0
): number {
  const [current, setCurrent] = useState<number>(0);
  const previousTarget = useRef(0);
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = previousTarget.current;
    const to = target;
    previousTarget.current = target;

    if (from === to) {
      setCurrent(to);
      return;
    }

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const value = from + (to - from) * easedProgress;
      setCurrent(Number(value.toFixed(decimals)));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration, decimals]);

  return current;
}
