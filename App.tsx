import { useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX } from "lucide-react";

type MixerValue = {
  rain: number; // 0..1
  wind: number;
  fire: number;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function makeNoiseBuffer(ctx: AudioContext, seconds: number, color: "white" | "brown") {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(1, length, rate);
  const data = buffer.getChannelData(0);

  if (color === "white") {
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * 0.8;
  } else {
    // brown noise
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }

  return buffer;
}

export default function SoundMixer({
  title = "Sound room",
  subtitle = "Mix a little atmosphere.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [mix, setMix] = useState<MixerValue>({ rain: 0.25, wind: 0.12, fire: 0.0 });

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const gainsRef = useRef<{ rain?: GainNode; wind?: GainNode; fire?: GainNode }>({});
  const fireCrackleRef = useRef<{ interval?: number; gain?: GainNode; ctx?: AudioContext }>({});

  const started = useMemo(() => !!ctxRef.current, [enabled]);

  const start = async () => {
    if (ctxRef.current) {
      setEnabled(true);
      return;
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.75;
    master.connect(ctx.destination);

    const makeLayer = (color: "white" | "brown", type: "rain" | "wind" | "fire") => {
      const src = ctx.createBufferSource();
      src.buffer = makeNoiseBuffer(ctx, 2.5, color);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === "rain") {
        filter.type = "bandpass";
        filter.frequency.value = 2500;
        filter.Q.value = 0.8;
      } else if (type === "wind") {
        filter.type = "lowpass";
        filter.frequency.value = 420;
        filter.Q.value = 0.7;
      } else {
        filter.type = "bandpass";
        filter.frequency.value = 950;
        filter.Q.value = 0.9;
      }

      const gain = ctx.createGain();
      gain.gain.value = 0;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      src.start();

      return gain;
    };

    gainsRef.current.rain = makeLayer("white", "rain");
    gainsRef.current.wind = makeLayer("brown", "wind");
    gainsRef.current.fire = makeLayer("white", "fire");

    // fire crackles: tiny random pops
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0;
    crackleGain.connect(master);
    fireCrackleRef.current.gain = crackleGain;
    fireCrackleRef.current.ctx = ctx;

    fireCrackleRef.current.interval = window.setInterval(() => {
      const fireAmt = clamp01(mix.fire);
      if (fireAmt < 0.05) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 1200 + Math.random() * 2600;
      g.gain.value = 0;
      o.connect(g);
      g.connect(crackleGain);

      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08 * fireAmt, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.start(t);
      o.stop(t + 0.09);
    }, 220);

    ctxRef.current = ctx;
    masterRef.current = master;

    setEnabled(true);
  };

  const stop = () => {
    setEnabled(false);
  };

  // apply levels
  useEffect(() => {
    const g = gainsRef.current;
    if (!g.rain || !g.wind || !g.fire) return;
    g.rain.gain.value = enabled ? clamp01(mix.rain) * 0.55 : 0;
    g.wind.gain.value = enabled ? clamp01(mix.wind) * 0.45 : 0;
    g.fire.gain.value = enabled ? clamp01(mix.fire) * 0.35 : 0;

    if (fireCrackleRef.current.gain) {
      fireCrackleRef.current.gain.gain.value = enabled ? clamp01(mix.fire) * 0.25 : 0;
    }
  }, [enabled, mix]);

  // cleanup
  useEffect(() => {
    return () => {
      if (fireCrackleRef.current.interval) window.clearInterval(fireCrackleRef.current.interval);
      const ctx = ctxRef.current;
      try {
        ctx?.close();
      } catch {
        // ignore
      }
      ctxRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border/60 bg-black/15 p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
          <p className="mt-2 text-[15px] sm:text-base text-foreground/95">{subtitle}</p>
        </div>
        <Badge variant="secondary" className="bg-black/25 border border-border/50">
          {enabled ? "ON" : "OFF"}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {!enabled ? (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={start}>
            <Volume2 className="h-4 w-4 mr-2" />
            Start ambience
          </Button>
        ) : (
          <Button variant="outline" className="bg-black/10" onClick={stop}>
            <VolumeX className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}
        <p className="text-xs text-muted-foreground sm:self-center">
          (Your browser may require a tap before sound plays.)
        </p>
      </div>

      <div className="space-y-4">
        <Layer label="Rain" value={mix.rain} onChange={(v) => setMix((m) => ({ ...m, rain: v }))} />
        <Layer label="Wind" value={mix.wind} onChange={(v) => setMix((m) => ({ ...m, wind: v }))} />
        <Layer label="Fire" value={mix.fire} onChange={(v) => setMix((m) => ({ ...m, fire: v }))} />
      </div>

      <p className="text-xs text-muted-foreground">
        These are generated sounds (no downloads needed), inspired by relaxation mixers.
      </p>
    </div>
  );
}

function Layer({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{Math.round(value * 100)}%</p>
      </div>
      <Slider
        value={[value * 100]}
        onValueChange={(v) => onChange(clamp01((v[0] ?? 0) / 100))}
        max={100}
        step={1}
      />
    </div>
  );
}
