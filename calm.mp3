import { useEffect, useMemo, useRef, useState } from "react";

export function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function useRafLoop(callback: (dt: number) => void, enabled: boolean) {
  const cb = useRef(callback);
  cb.current = callback;

  const raf = useRef<number | null>(null);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const tick = (t: number) => {
      const p = prev.current ?? t;
      const dt = t - p;
      prev.current = t;
      cb.current(dt);
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      prev.current = null;
    };
  }, [enabled]);
}

export function useTimeOfDay() {
  return useMemo(() => {
    const h = new Date().getHours();
    return h >= 5 && h < 12 ? "morning" : "night";
  }, []);
}
