import { useEffect, useState } from "react";

export function useCountUp(
  target: number,
  duration = 1600,
  enabled = true,
  decimals = 0
): string {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    setValue(0);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setValue(current);
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled]);

  return value.toFixed(decimals);
}
