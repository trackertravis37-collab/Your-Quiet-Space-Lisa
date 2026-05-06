import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle } from "lucide-react";

type WindowItem = {
  id: string;
  label: string;
  src: string;
  credit: string;
  license: string;
};

const WINDOWS: WindowItem[] = [
  {
    id: "window-rain",
    label: "Raindrops (soft)",
    src: "./ambience/window-rain.webm",
    credit: "FASTILY (Wikimedia Commons)",
    license: "CC BY-SA 4.0",
  },
  {
    id: "rain-city",
    label: "Rain street (city)",
    src: "./ambience/rain-city.webm",
    credit: "Shishirdasika (Wikimedia Commons)",
    license: "CC BY-SA 4.0",
  },
  {
    id: "window-close",
    label: "Raindrops (close)",
    src: "./ambience/window-close.webm",
    credit: "Frank Vincentz (Wikimedia Commons)",
    license: "CC BY-SA 3.0 / GFDL",
  },
];

function pickRandom(exceptId?: string) {
  const pool = WINDOWS.filter((w) => w.id !== exceptId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function WindowAmbience({
  title,
  lines,
  onNext,
}: {
  title: string;
  lines: string[];
  onNext: () => void;
}) {
  const [active, setActive] = useState(() => pickRandom().id);
  const item = useMemo(() => WINDOWS.find((w) => w.id === active) ?? WINDOWS[0], [active]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
        <div className="mt-3 space-y-2">
          {lines.map((l, i) => (
            <p key={i} className="text-[15px] sm:text-base leading-relaxed">
              {l}
            </p>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/25">
        <AnimatePresence mode="wait">
          <motion.video
            key={item.id}
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="h-[320px] sm:h-[380px] w-full object-cover"
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_360px_at_20%_10%,rgba(91,192,190,0.20),transparent_60%)]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/55 via-black/10 to-black/10" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-black/35 border border-border/50">
            {item.label}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            className="bg-black/20"
            onClick={() => setActive(pickRandom(item.id).id)}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            New window
          </Button>

          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onNext}>
            Next
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Video credit: {item.credit} ({item.license})
      </p>
    </div>
  );
}
