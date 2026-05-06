import { useEffect, useRef } from "react";
import { usePrefersReducedMotion, useRafLoop } from "@/lib/quietHooks";

type Drop = { x: number; y: number; l: number; s: number; a: number };

export default function RainCurtain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const drops = useRef<Drop[]>([]);

  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const count = Math.max(40, Math.floor((rect.width * rect.height) / 9000));
    drops.current = new Array(count).fill(0).map(() => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      l: 10 + Math.random() * 18,
      s: 140 + Math.random() * 220,
      a: 0.08 + Math.random() * 0.12,
    }));
  };

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    init();
  };

  useEffect(() => {
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const draw = (dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const t = Math.min(33, dt) / 1000;

    ctx.lineWidth = 1;
    for (const d of drops.current) {
      d.y += d.s * t;
      d.x += 18 * t;
      if (d.y > rect.height + 30) {
        d.y = -30;
        d.x = Math.random() * rect.width;
      }
      if (d.x > rect.width + 30) d.x = -30;

      ctx.strokeStyle = `rgba(210,230,255,${d.a})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 6, d.y - d.l);
      ctx.stroke();
    }
  };

  useRafLoop(draw, active && !reduced);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none -z-10 transition-opacity duration-1000"
      style={{ opacity: active ? 1 : 0 }}
    />
  );
}
