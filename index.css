import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import hugBear from "@/assets/hug-character.png";

export default function HugScene({
  title,
  lines,
  cta,
  onComplete,
}: {
  title: string;
  lines: string[];
  cta: string;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "hugging" | "done">("intro");

  useEffect(() => {
    if (phase !== "hugging") return;
    const t = window.setTimeout(() => setPhase("done"), 2400);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/15 p-5 sm:p-6">
      {/* soft spotlight */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(450px_240px_at_50%_20%,rgba(91,192,190,0.24),transparent_65%)]" />

      <div className="relative">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
            <div className="mt-3 space-y-2">
              {lines.map((l, i) => (
                <p key={i} className="text-[15px] sm:text-base leading-relaxed">
                  {l}
                </p>
              ))}
            </div>
          </div>

          <div className="relative h-[260px] w-full max-w-[360px]">
            {/* Hug overlay tint */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "hugging" ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background:
                  "radial-gradient(380px 260px at 50% 55%, rgba(255,240,220,0.35), rgba(91,192,190,0.10), transparent 70%)",
              }}
            />

            <motion.img
              src={hugBear}
              alt="A comforting hug"
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-[260px] sm:w-[290px] select-none"
              )}
              initial={{ scale: 0.96, opacity: 0.0, y: 8 }}
              animate={
                phase === "intro"
                  ? { scale: 1, opacity: 1, y: 0 }
                  : phase === "hugging"
                    ? { scale: 1.65, opacity: 1, y: 0 }
                    : { scale: 1.18, opacity: 1, y: 0 }
              }
              transition={{ duration: phase === "hugging" ? 2.2 : 1.0, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.div
              className="absolute inset-0 rounded-2xl border border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            />
          </div>

          {phase === "intro" ? (
            <Button
              onClick={() => setPhase("hugging")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            >
              {cta}
            </Button>
          ) : null}

          {phase === "hugging" ? (
            <p className="text-xs text-muted-foreground">…just a second.</p>
          ) : null}

          {phase === "done" ? (
            <Button
              onClick={onComplete}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            >
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
