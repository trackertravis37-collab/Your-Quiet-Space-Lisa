import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Layer = { speed: number; opacity: number; color: string; y: number };

const LAYERS: Layer[] = [
  { speed: 0.15, opacity: 0.35, color: "rgba(91,192,190,0.20)", y: 72 },
  { speed: 0.3, opacity: 0.35, color: "rgba(255,255,255,0.10)", y: 96 },
  { speed: 0.55, opacity: 0.28, color: "rgba(91,192,190,0.14)", y: 126 },
  { speed: 0.9, opacity: 0.18, color: "rgba(255,255,255,0.08)", y: 156 },
];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function ShortTripMini({
  title,
  text,
  onNext,
}: {
  title: string;
  text: string[];
  onNext: () => void;
}) {
  const [x, setX] = useState(0);
  const leftHeld = useRef(false);
  const rightHeld = useRef(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") leftHeld.current = true;
      if (e.key === "ArrowRight") rightHeld.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") leftHeld.current = false;
      if (e.key === "ArrowRight") rightHeld.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const dir = (rightHeld.current ? 1 : 0) - (leftHeld.current ? 1 : 0);
      if (dir !== 0) setX((p) => clamp(p + dir * 3.2, -520, 520));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, []);

  const onTouchStart = (dir: -1 | 1) => {
    if (dir === -1) leftHeld.current = true;
    if (dir === 1) rightHeld.current = true;
  };
  const onTouchEnd = () => {
    leftHeld.current = false;
    rightHeld.current = false;
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
        <div className="mt-3 space-y-2">
          {text.map((l, i) => (
            <p key={i} className="text-[15px] sm:text-base leading-relaxed">
              {l}
            </p>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/25">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_360px_at_70%_10%,rgba(91,192,190,0.22),transparent_60%)]" />

        {/* stars */}
        <motion.div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.22) 0 1px, transparent 2px),radial-gradient(circle at 78% 16%, rgba(255,255,255,0.18) 0 1px, transparent 2px),radial-gradient(circle at 56% 38%, rgba(255,255,255,0.12) 0 1px, transparent 2px),radial-gradient(circle at 34% 62%, rgba(255,255,255,0.11) 0 1px, transparent 2px),radial-gradient(circle at 86% 72%, rgba(255,255,255,0.10) 0 1px, transparent 2px)",
          }}
          animate={{ x: x * 0.06 }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        />

        {/* parallax hills */}
        {LAYERS.map((l, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: 220,
              transform: `translateY(${l.y}px)`,
              background:
                `radial-gradient(900px 320px at 50% 100%, ${l.color}, transparent 60%),` +
                `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.65) 100%)`,
              opacity: l.opacity,
            }}
            animate={{ x: x * l.speed }}
            transition={{ type: "spring", stiffness: 30, damping: 20 }}
          />
        ))}

        {/* little train */}
        <motion.div
          className="absolute bottom-[64px] left-1/2 -translate-x-1/2"
          animate={{ x: x * 0.65 }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        >
          <div className="h-6 w-16 rounded-md bg-white/15 border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.35)]" />
          <div className="mt-1 h-1 w-20 bg-white/10 rounded-full" />
        </motion.div>

        <div className="relative h-[320px] sm:h-[360px]">
          <div className="absolute inset-0" />

          {/* touch controls */}
          <div className="absolute inset-0 grid grid-cols-2">
            <button
              type="button"
              aria-label="Move left"
              className="opacity-0"
              onPointerDown={() => onTouchStart(-1)}
              onPointerUp={onTouchEnd}
              onPointerCancel={onTouchEnd}
              onPointerLeave={onTouchEnd}
            />
            <button
              type="button"
              aria-label="Move right"
              className="opacity-0"
              onPointerDown={() => onTouchStart(1)}
              onPointerUp={onTouchEnd}
              onPointerCancel={onTouchEnd}
              onPointerLeave={onTouchEnd}
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Hold left/right to move. (Or press ← / →.)
            </p>
            <Button className={cn("bg-primary text-primary-foreground hover:bg-primary/90")} onClick={onNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
