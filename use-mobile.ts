import { useEffect, useMemo, useRef } from "react";
import { usePrefersReducedMotion, useRafLoop } from "@/lib/quietHooks";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

export default function Starfield({ density = 85 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const particles = useRef<Particle[]>([]);

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(40, Math.floor((rect.width * rect.height) / 13000));
    const n = Math.round((count * density) / 100);
    particles.current = new Array(n).fill(0).map(() => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      r: 0.7 + Math.random() * 1.6,
      a: 0.18 + Math.random() * 0.28,
    }));
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

    const drift = Math.min(33, dt) * 0.001;

    // dots
    for (const p of particles.current) {
      p.x += p.vx * rect.width * drift;
      p.y += p.vy * rect.height * drift;
      if (p.x < -10) p.x = rect.width + 10;
      if (p.x > rect.width + 10) p.x = -10;
      if (p.y < -10) p.y = rect.height + 10;
      if (p.y > rect.height + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // faint connections
    for (let i = 0; i < particles.current.length; i++) {
      const a = particles.current[i];
      for (let j = i + 1; j < particles.current.length; j++) {
        const b = particles.current[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const alpha = (1 - Math.sqrt(d2) / 120) * 0.08;
          ctx.strokeStyle = `rgba(91,192,190,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  };

  useRafLoop(draw, !reduced);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none -z-10"
      style={{ opacity: 0.9 }}
    />
  );
}
