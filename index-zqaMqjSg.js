import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import Starfield from "@/components/Starfield";
import HugScene from "@/components/HugScene";
import SoundMixer from "@/components/SoundMixer";
import WindowAmbience from "@/components/WindowAmbience";
import ShortTripMini from "@/components/ShortTripMini";
import RainCurtain from "@/components/RainCurtain";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Download, Upload, Volume2, VolumeX, Sparkles, Flame, Heart } from "lucide-react";

import { defaultContent } from "@/content/defaultContent";
import type { QuietContent, OverwhelmChoice, MusicTrack } from "@/content/defaultContent";
import { useLocalStorageState, useTimeOfDay } from "@/lib/quietHooks";
import { cn } from "@/lib/utils";

interface HomeProps {
  targetSection?: string;
}

type StepKey =
  | "landing"
  | "hug"
  | "notYourWeight"
  | "familyTrying"
  | "feelsLikeYou"
  | "grounding"
  | "memoryLights"
  | "invisibleMessage"
  | "journal"
  | "sitWithMe"
  | "ambience"
  | "window"
  | "trip"
  | "openWhen"
  | "timeBased"
  | "final"
  | "ending"
  | "bridge";

const ORDER: StepKey[] = [
  "landing",
  "hug",
  "notYourWeight",
  "familyTrying",
  "feelsLikeYou",
  "grounding",
  "memoryLights",
  "invisibleMessage",
  "journal",
  "sitWithMe",
  "ambience",
  "window",
  "trip",
  "openWhen",
  "timeBased",
  "final",
  "ending",
  "bridge",
];

const STORAGE_KEY = "quiet-place-content-v2";
const JOURNAL_KEY = "quiet-place-journal-v1";

function softVariants() {
  return {
    initial: { opacity: 0, y: 10, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: "blur(6px)",
      transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
    },
  } as const;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const el = new Audio();
    el.loop = true;
    el.volume = 0.28;

    const onCanPlay = () => setReady(true);
    const onEnded = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onError = () => setReady(false);

    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("ended", onEnded);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    el.addEventListener("error", onError);

    audioRef.current = el;

    return () => {
      el.pause();
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("error", onError);
    };
  }, []);

  const setTrack = async (fileName: string, autoPlay: boolean) => {
    const el = audioRef.current;
    if (!el) return;

    const nextSrc = `./${fileName}`;
    if (nextSrc === src) return;

    setReady(false);
    setSrc(nextSrc);
    el.pause();
    el.src = nextSrc;
    el.load();

    if (autoPlay) {
      try {
        await el.play();
      } catch {
        toast.message("Tap Play to start the music", {
          description: "Some browsers require a user tap before audio can play.",
        });
      }
    }
  };

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;

    // If no src yet, nothing to play.
    if (!el.src) {
      toast.message("No track loaded yet.");
      return;
    }

    try {
      if (el.paused) {
        await el.play();
      } else {
        el.pause();
      }
    } catch {
      toast.message("Tap once more", {
        description: "Your browser blocked autoplay.",
      });
    }
  };

  return { ready, playing, toggle, setTrack };
}

function StepShell({
  title,
  accent,
  children,
}: {
  title?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-card/70 text-card-foreground border-border/70 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div className="p-6 sm:p-8">
        {title ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">{title}</h2>
              {accent ? <p className="mt-2 text-sm text-muted-foreground">{accent}</p> : null}
            </div>
          </div>
        ) : null}

        {title ? <Separator className="my-6 opacity-60" /> : null}

        {children}
      </div>
    </Card>
  );
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-3">
      {lines.map((l, i) => (
        <p key={i} className="text-[15px] sm:text-base leading-relaxed text-foreground/95">
          {l}
        </p>
      ))}
    </div>
  );
}

function MemoryLights({ reveals }: { reveals: string[] }) {
  const [opened, setOpened] = useState<boolean[]>(() => reveals.map(() => false));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Tap the little lights.</span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {reveals.map((_, i) => {
          const isOn = opened[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpened((p) => p.map((v, idx) => (idx === i ? !v : v)))}
              className={cn(
                "relative h-14 sm:h-16 rounded-full border border-border/60 bg-black/20 overflow-hidden",
                "transition duration-700",
                isOn ? "shadow-[0_0_50px_rgba(91,192,190,0.35)]" : "hover:border-border"
              )}
              aria-label={isOn ? "Hide message" : "Reveal message"}
            >
              <span
                className={cn(
                  "absolute inset-0",
                  "bg-[radial-gradient(circle_at_30%_30%,rgba(91,192,190,0.55),transparent_55%)]",
                  "transition-opacity duration-700",
                  isOn ? "opacity-100" : "opacity-35"
                )}
              />
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.18),transparent_60%)] opacity-70" />
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {reveals.map((txt, i) =>
          opened[i] ? (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="text-[15px] sm:text-base leading-relaxed"
            >
              {txt}
            </motion.p>
          ) : null
        )}
      </div>
    </div>
  );
}

function InvisibleReveal({ prompt, lines }: { prompt: string; lines: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / r.width, 0, 1);
      const y = clamp((e.clientY - r.top) / r.height, 0, 1);
      setPos({ x, y });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const mask = useMemo(() => {
    const cx = Math.round(pos.x * 100);
    const cy = Math.round(pos.y * 100);
    return `radial-gradient(180px 120px at ${cx}% ${cy}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 65%)`;
  }, [pos.x, pos.y]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{prompt}</p>

      <div
        ref={ref}
        className="relative rounded-2xl border border-border/60 bg-black/20 p-6 sm:p-8 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            background: "linear-gradient(180deg, rgba(91,192,190,0.18), rgba(255,255,255,0.06))",
          }}
        />
        <div
          className="relative space-y-3"
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        >
          {lines.map((l, i) => (
            <p key={i} className="text-[15px] sm:text-base leading-relaxed">
              {l}
            </p>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(91,192,190,0.18),transparent_60%)]" />
      </div>
    </div>
  );
}

function GroundingCards({
  content,
  onDone,
}: {
  content: QuietContent["steps"]["grounding"];
  onDone: () => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const allOpened = content.prompts.every((p) => open[p.key]);

  return (
    <div className="space-y-6">
      <Lines lines={content.intro} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {content.prompts.map((p) => {
          const isOn = !!open[p.key];
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setOpen((x) => ({ ...x, [p.key]: !x[p.key] }))}
              className={cn(
                "text-left rounded-2xl border border-border/60 bg-black/15 p-4 transition duration-700",
                "hover:border-border hover:bg-black/20"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.hint}</p>
                </div>
                <div
                  className={cn(
                    "h-9 w-9 rounded-full grid place-items-center border border-border/60",
                    isOn
                      ? "bg-[radial-gradient(circle_at_30%_30%,rgba(91,192,190,0.55),rgba(0,0,0,0.2))]"
                      : "bg-black/10"
                  )}
                >
                  {isOn ? <Heart className="h-4 w-4" /> : <Flame className="h-4 w-4 opacity-70" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {allOpened ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="rounded-2xl border border-border/60 bg-black/15 p-5"
          >
            <Lines lines={content.done} />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={onDone}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!allOpened ? (
        <p className="text-xs text-muted-foreground">Tip: you can tap any card more than once.</p>
      ) : null}
    </div>
  );
}

function EditPanel({
  enabled,
  content,
  onChange,
  onReset,
}: {
  enabled: boolean;
  content: QuietContent;
  onChange: (next: QuietContent) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(() => JSON.stringify(content, null, 2));

  useEffect(() => {
    setDraft(JSON.stringify(content, null, 2));
  }, [content, enabled]);

  if (!enabled) return null;

  const apply = () => {
    try {
      const next = JSON.parse(draft) as QuietContent;
      onChange(next);
      toast.success("Updated preview");
    } catch {
      toast.error("Invalid JSON");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiet-place-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const txt = await f.text();
      setDraft(txt);
    };
    input.click();
  };

  return (
    <div className="fixed left-4 bottom-4 right-4 sm:right-auto sm:w-[460px] z-50">
      <Card className="bg-card/85 border-border/70 backdrop-blur-xl">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Edit mode</p>
              <p className="text-xs text-muted-foreground">Paste JSON here to update the text instantly.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={exportJson}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={importJson}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[240px] font-mono text-xs"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Button variant="outline" onClick={onReset}>
              Reset
            </Button>
            <Button variant="secondary" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Home({ targetSection }: HomeProps) {
  // Allow direct navigation to steps via URL:
  //   /#/landing, /#/hug, ...
  // Also keeps browser back/forward in sync with progress.
  const [location, setLocation] = useLocation();

  const stepIndexById = useMemo(() => {
    const map = new Map<string, number>();
    ORDER.forEach((id, idx) => map.set(id, idx));
    return map;
  }, []);

  // Prevent URL<->state ping-pong
  const syncingRef = useRef(false);

  const [content, setContent] = useLocalStorageState<QuietContent>(STORAGE_KEY, defaultContent);
  const [stepIndex, setStepIndex] = useState(0);
  const step = ORDER[stepIndex];

  const [choice, setChoice] = useState<OverwhelmChoice | null>(null);
  const [sitMode, setSitMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [journal, setJournal] = useLocalStorageState<string>(JOURNAL_KEY, "");

  const timeOfDay = useTimeOfDay();

  const { playing, toggle, setTrack } = useAudioPlayer();

  const tracksById = useMemo(() => {
    const map = new Map<string, MusicTrack>();
    for (const t of content.music.tracks) map.set(t.id, t);
    return map;
  }, [content.music.tracks]);

  const [trackId, setTrackId] = useState<string>(content.music.defaultTrackId);

  // keep trackId valid when content updates
  useEffect(() => {
    if (!tracksById.has(trackId)) setTrackId(content.music.defaultTrackId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksById, content.music.defaultTrackId]);

  const activeTrack = tracksById.get(trackId) ?? content.music.tracks[0];

  // load default track once on mount / changes
  useEffect(() => {
    if (!activeTrack) return;
    void setTrack(activeTrack.fileName, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrack?.fileName]);

  // URL -> state (when the user uses the address bar / back / forward)
  useEffect(() => {
    if (!targetSection) return;
    const idx = stepIndexById.get(targetSection);
    if (idx == null) return;

    syncingRef.current = true;
    setStepIndex(idx);
    // allow state->URL effect to run again after this turn
    queueMicrotask(() => {
      syncingRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSection]);

  // state -> URL (when clicking Continue / Back)
  useEffect(() => {
    if (syncingRef.current) return;
    const desired = `/${step}`;
    if (location !== desired) setLocation(desired, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const next = () => setStepIndex((i) => clamp(i + 1, 0, ORDER.length - 1));
  const back = () => setStepIndex((i) => clamp(i - 1, 0, ORDER.length - 1));
  const restart = () => {
    setChoice(null);
    setSitMode(false);
    setStepIndex(0);
    setTrackId(content.music.defaultTrackId);
    toast.message("Restarted");
  };

  const stepAccent = useMemo(() => {
    if (step === "notYourWeight") return "Soft blue — a little lighter.";
    if (step === "familyTrying") return "Light rain — slow and gentle.";
    if (step === "grounding") return "Small reset. Tiny steps count.";
    if (step === "journal") return "This saves on this device only.";
    if (step === "sitWithMe") return "No fixing. Just presence.";
    if (step === "ending") return "Quiet, but powerful.";
    return undefined;
  }, [step]);

  const shellTitle = useMemo(() => {
    if (step === "landing") return content.title;
    if (step === "hug") return content.steps.hug.title;
    if (step === "notYourWeight") return "This isn’t your weight to carry";
    if (step === "familyTrying") return "Your family is trying";
    if (step === "feelsLikeYou") return content.steps.feelsLikeYou.prompt;
    if (step === "grounding") return content.steps.grounding.title;
    if (step === "memoryLights") return "Memory lights";
    if (step === "invisibleMessage") return "Invisible message";
    if (step === "journal") return content.steps.journal.title;
    if (step === "sitWithMe") return "Sit with me";
    if (step === "ambience") return content.steps.ambience.title;
    if (step === "window") return content.steps.window.title;
    if (step === "trip") return content.steps.trip.title;
    if (step === "openWhen") return content.steps.openWhen.title;
    if (step === "timeBased") return content.steps.timeBased.title;
    if (step === "final") return "From me to you";
    if (step === "ending") return "Ending";
    if (step === "bridge") return "One last thing";
    return undefined;
  }, [content, step]);

  const stageGlow = useMemo(() => {
    if (step === "final" || step === "ending") return "bg-[radial-gradient(900px_500px_at_40%_20%,rgba(255,206,150,0.14),transparent_62%)]";
    if (step === "notYourWeight" || step === "grounding") return "bg-[radial-gradient(900px_500px_at_30%_20%,rgba(91,192,190,0.16),transparent_60%)]";
    return "bg-[radial-gradient(900px_500px_at_70%_10%,rgba(91,192,190,0.10),transparent_60%)]";
  }, [step]);

  return (
    <div className="grain min-h-screen night-gradient relative overflow-hidden">
      <Starfield />
      <RainCurtain active={step === "familyTrying"} />
      <div className={cn("absolute inset-0 pointer-events-none", stageGlow)} />

      {/* Top controls */}
      <div className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-black/25 border border-border/50">
            {stepIndex + 1}/{ORDER.length}
          </Badge>

          <button
            type="button"
            onClick={toggle}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/25 px-3 py-2",
              "text-xs text-foreground/90 backdrop-blur",
              "transition hover:border-border"
            )}
            title={activeTrack ? `${activeTrack.title} — ${activeTrack.credit}` : "Music"}
          >
            {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{playing ? "Pause" : content.music.label}</span>
            <span className="hidden sm:inline text-muted-foreground">• {activeTrack?.title ?? ""}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-black/25 px-3 py-2 text-xs backdrop-blur">
            <span className="text-muted-foreground">Edit</span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
          </div>
        </div>
      </div>

      {/* Main stage */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-[760px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} {...softVariants()}>
              <StepShell title={shellTitle} accent={stepAccent}>
                {step === "landing" ? (
                  <div className="space-y-6">
                    <Lines lines={content.steps.landing.intro} />

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-xs text-muted-foreground">{content.music.note}</div>
                      <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                        {content.steps.landing.cta}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === "hug" ? (
                  <div className="space-y-6">
                    <HugScene
                      title={content.steps.hug.title}
                      lines={content.steps.hug.text}
                      cta={content.steps.hug.cta}
                      onComplete={next}
                    />
                    <div className="pt-2">
                      <Button variant="outline" className="bg-black/10" onClick={back}>
                        Back
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === "notYourWeight" ? (
                  <div className="space-y-8">
                    <Lines lines={content.steps.notYourWeight.text} />
                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "familyTrying" ? (
                  <div className="space-y-8">
                    <Lines lines={content.steps.familyTrying.text} />
                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "feelsLikeYou" ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {content.steps.feelsLikeYou.buttons.map((b) => (
                        <Button
                          key={b.key}
                          variant={choice === b.key ? "default" : "outline"}
                          onClick={async () => {
                            setChoice(b.key);
                            const nextId = content.music.byChoice[b.key] ?? content.music.defaultTrackId;
                            setTrackId(nextId);
                            // switching track is already triggered by effect; but try to autoplay now (user gesture)
                            const nextTrack = tracksById.get(nextId);
                            if (nextTrack) await setTrack(nextTrack.fileName, true);
                          }}
                          className={cn(
                            "rounded-full",
                            choice === b.key
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-black/10"
                          )}
                        >
                          {b.label}
                        </Button>
                      ))}
                    </div>

                    {choice ? (
                      <div className="mt-2 rounded-2xl border border-border/60 bg-black/15 p-5">
                        <Lines lines={content.steps.feelsLikeYou.buttons.find((b) => b.key === choice)?.response ?? []} />
                        <div className="mt-4 text-xs text-muted-foreground">
                          Music switched to: <span className="text-foreground/85">{activeTrack?.title}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Pick one—no rush.</p>
                    )}

                    <NavRow back={back} next={next} nextDisabled={!choice} />
                  </div>
                ) : null}

                {step === "grounding" ? (
                  <div className="space-y-8">
                    <GroundingCards content={content.steps.grounding} onDone={next} />
                    <div className="pt-2">
                      <Button variant="outline" className="bg-black/10" onClick={back}>
                        Back
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === "memoryLights" ? (
                  <div className="space-y-8">
                    <MemoryLights reveals={content.steps.memoryLights.reveals} />
                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "invisibleMessage" ? (
                  <div className="space-y-8">
                    <InvisibleReveal prompt={content.steps.invisibleMessage.prompt} lines={content.steps.invisibleMessage.hiddenLines} />
                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "journal" ? (
                  <div className="space-y-6">
                    <Lines lines={content.steps.journal.intro} />
                    <Textarea
                      value={journal}
                      placeholder={content.steps.journal.placeholder}
                      onChange={(e) => setJournal(e.target.value)}
                      className="min-h-[220px] bg-black/10 border-border/60"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                      <Button
                        variant="outline"
                        className="bg-black/10"
                        onClick={() => {
                          setJournal("");
                          toast.message("Cleared");
                        }}
                      >
                        Clear
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            toast.success("Saved");
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={next}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {content.steps.journal.afterSave.join(" ")}
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="bg-black/10" onClick={back}>
                        Back
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === "sitWithMe" ? (
                  <div className="space-y-8">
                    {sitMode ? (
                      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/15 p-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(91,192,190,0.28),transparent_60%)] breathe" />
                        </div>

                        <div className="relative space-y-3 text-center">
                          <div className="h-10" />
                          <p className="text-sm text-muted-foreground">…</p>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.0, delay: 2.2 }}
                            className="space-y-2"
                          >
                            {content.steps.sitWithMe.after.map((l, i) => (
                              <p key={i} className="text-[15px] sm:text-base leading-relaxed">
                                {l}
                              </p>
                            ))}
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSitMode(true)}
                        className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 py-6"
                      >
                        {content.steps.sitWithMe.cta}
                      </Button>
                    )}

                    <NavRow back={back} next={next} nextDisabled={!sitMode} />
                  </div>
                ) : null}

                {step === "ambience" ? (
                  <div className="space-y-6">
                    <SoundMixer title={content.steps.ambience.title} subtitle={content.steps.ambience.subtitle} />
                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "window" ? (
                  <div className="space-y-6">
                    <WindowAmbience
                      title={content.steps.window.title}
                      lines={content.steps.window.text}
                      onNext={next}
                    />
                    <div className="pt-2">
                      <Button variant="outline" className="bg-black/10" onClick={back}>
                        Back
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === "trip" ? (
                  <div className="space-y-6">
                    <ShortTripMini
                      title={content.steps.trip.title}
                      text={content.steps.trip.text}
                      onNext={next}
                    />
                    <div className="pt-2">
                      <Button variant="outline" className="bg-black/10" onClick={back}>
                        Back
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === "openWhen" ? (
                  <div className="space-y-8">
                    <Accordion type="single" collapsible className="w-full">
                      {content.steps.openWhen.items.map((it, idx) => (
                        <AccordionItem key={idx} value={`i-${idx}`}>
                          <AccordionTrigger>{it.title}</AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2">
                              <Lines lines={it.body} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "timeBased" ? (
                  <div className="space-y-8">
                    <div className="rounded-2xl border border-border/60 bg-black/15 p-6">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {timeOfDay === "morning" ? "Morning" : "Night"}
                      </p>
                      <div className="mt-3">
                        <Lines lines={timeOfDay === "morning" ? content.steps.timeBased.morning : content.steps.timeBased.night} />
                      </div>
                    </div>

                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "final" ? (
                  <div className="space-y-8">
                    <Lines lines={content.steps.final.text} />
                    <NavRow back={back} next={next} />
                  </div>
                ) : null}

                {step === "ending" ? (
                  <div className="space-y-8">
                    <Lines lines={content.steps.ending.text} />
                    <div className="flex items-center justify-end">
                      <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                        {content.steps.ending.cta}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">You can always come back.</div>
                  </div>
                ) : null}

                {step === "bridge" ? (
                  <div className="space-y-8">
                    <Lines lines={content.steps.bridge.text} />
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <Button variant="outline" className="bg-black/10" onClick={restart}>
                        Restart
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText("🌙");
                            toast.success("Copied 🌙");
                          } catch {
                            toast.message("🌙");
                          }
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Copy moon (🌙)
                      </Button>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="uppercase tracking-widest">Music credits</p>
                      {content.music.tracks.map((t) => (
                        <p key={t.id}>
                          {t.title} — {t.credit} ({t.license})
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </StepShell>
            </motion.div>
          </AnimatePresence>

          {/* Mobile edit toggle */}
          <div className="sm:hidden mt-4 flex items-center justify-end">
            <button
              type="button"
              className="text-xs text-muted-foreground underline underline-offset-4"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? "Hide edit mode" : "Show edit mode"}
            </button>
          </div>
        </div>
      </div>

      <EditPanel
        enabled={editMode}
        content={content}
        onChange={setContent}
        onReset={() => {
          setContent(defaultContent);
          toast.success("Reset to defaults");
        }}
      />

      <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
        <p className="text-[11px] text-muted-foreground">
          Track: <span className="text-foreground/80">{activeTrack?.title}</span>
        </p>
      </div>
    </div>
  );
}

function NavRow({
  back,
  next,
  nextDisabled,
}: {
  back: () => void;
  next: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="pt-2 flex items-center justify-between gap-3">
      <Button variant="outline" className="bg-black/10" onClick={back}>
        Back
      </Button>
      <Button
        onClick={next}
        disabled={nextDisabled}
        className={cn("bg-primary text-primary-foreground hover:bg-primary/90", nextDisabled ? "opacity-60" : "")}
      >
        Continue
      </Button>
    </div>
  );
}
