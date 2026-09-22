"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useFrame } from "@react-three/fiber";
import { RotateCcw } from "lucide-react";
import * as THREE from "three";
import { SlideShell } from "@/components/deck/SlideShell";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { SceneLights } from "@/components/three/SceneKit";
import { RevealText } from "@/components/ui/RevealText";
import { OutputOutcome } from "./scenes/stations/OutputOutcome";
import { TwoEngineers } from "./scenes/stations/TwoEngineers";
import { BASINS, CapacityTerrain, type BasinId } from "./scenes/stations/CapacityTerrain";
import { useDeck, useSlideKeyCapture } from "@/lib/deck-store";
import type { SlideProps } from "@/components/slides";
import { EASE_OUT, SPRING } from "@/lib/motion";

const STATIONS = [
  { id: "output", n: "01", title: "Output vs outcome", hint: "Drag the AI speed and judgment sliders" },
  { id: "ticket", n: "02", title: "Same ticket, two engineers", hint: "Step both engineers forward" },
  { id: "capacity", n: "03", title: "Capacity sandbox", hint: "Drag the orb across the terrain" },
] as const;

type StationId = (typeof STATIONS)[number]["id"];

const CAMERAS: Record<StationId, [number, number, number]> = {
  output: [0, 1.5, 11.5],
  ticket: [0, 0.4, 10.6],
  capacity: [0, 5, 9],
};

function StationCamera({ station }: { station: StationId }) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    target.set(...CAMERAS[station]);
    camera.position.lerp(target, 0.05);
    camera.lookAt(0, station === "capacity" ? -1.2 : 0, 0);
  });
  return null;
}

export function S24Demo({ slideIndex }: SlideProps) {
  const { index } = useDeck();
  const [station, setStation] = useState<StationId>("output");

  const [speed, setSpeed] = useState(2);
  const [judgment, setJudgment] = useState(0.8);
  const [step, setStep] = useState(0);
  const [orb, setOrb] = useState(() => new THREE.Vector3(0, 0, 0));

  useSlideKeyCapture(index === slideIndex, (e) => {
    if (!e.shiftKey) return false;
    const n = Number(e.key);
    if (n >= 1 && n <= STATIONS.length) {
      setStation(STATIONS[n - 1].id);
      return true;
    }
    return false;
  });

  const nearest: BasinId | null = useMemo(() => {
    let best: BasinId | null = null;
    let bestD = 2.6;
    for (const b of BASINS) {
      const d = Math.hypot(b.x - orb.x, b.z - orb.z);
      if (d < bestD) {
        bestD = d;
        best = b.id;
      }
    }
    return best;
  }, [orb]);

  const reset = () => {
    setSpeed(2);
    setJudgment(0.8);
    setStep(0);
    setOrb(new THREE.Vector3(0, 0, 0));
  };

  const active = STATIONS.find((s) => s.id === station)!;

  return (
    <SlideShell bleed>
      <div className="absolute inset-0">
        <ThreeCanvas camera={{ position: CAMERAS.output, fov: 44 }}>
          <SceneLights />
          <StationCamera station={station} />
          {station === "output" ? <OutputOutcome speed={speed} judgment={judgment} /> : null}
          {station === "ticket" ? <TwoEngineers step={step} /> : null}
          {station === "capacity" ? (
            <CapacityTerrain orb={orb} onDrag={setOrb} nearest={nearest} />
          ) : null}
        </ThreeCanvas>
      </div>

      {/* Heading */}
      <div className="pointer-events-none absolute top-14 left-16">
        <div className="deck-kicker mb-2">Demo · the AI era console</div>
        <AnimatePresence mode="wait">
          <motion.div key={station} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <RevealText
              text={active.title}
              as="h2"
              by="word"
              className="text-[2.1rem] leading-tight font-semibold tracking-tight"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-1 font-mono text-[11px] tracking-[0.14em] text-faint uppercase"
            >
              {active.hint}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Station controls */}
      <div className="pointer-events-auto absolute top-14 right-16 w-[330px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={station}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            className="rounded-2xl border border-line bg-surface/85 p-5 backdrop-blur-md"
          >
            {station === "output" ? (
              <div className="space-y-5">
                <Slider label="AI implementation speed" value={speed} min={1} max={5} step={0.25} suffix="×" onChange={setSpeed} tone="warn" />
                <Slider label="Judgment applied" value={judgment} min={0} max={1} step={0.05} suffix="" format={(v) => `${Math.round(v * 100)}%`} onChange={setJudgment} tone="accent" />
                <p className="text-[12px] leading-snug text-muted">
                  Volume follows the multiplier on its own. Outcome only follows as far as judgment
                  carries it — and a column that tall without it does not stay up.
                </p>
              </div>
            ) : null}

            {station === "ticket" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep((s) => Math.min(s + 1, 10))}
                    className="flex-1 rounded-lg border border-accent/40 bg-accent/10 py-2.5 font-mono text-[12px] tracking-wider text-accent uppercase"
                  >
                    advance both
                  </button>
                  <span className="font-mono text-[12px] text-faint tabular-nums">{step} / 10</span>
                </div>
                <p className="text-[12px] leading-snug text-muted">
                  A finishes at step 5 and starts collecting the consequences of the five steps it
                  skipped. B is still working — and arrives somewhere different.
                </p>
              </div>
            ) : null}

            {station === "capacity" ? (
              <div className="space-y-3">
                <div className="deck-kicker">
                  {nearest ? BASINS.find((b) => b.id === nearest)?.label.replace("\n", " ") : "between everything"}
                </div>
                <p className="text-[12px] leading-snug text-muted">
                  If AI makes us twice as productive, what do we do with the extra capacity? Drag
                  the orb and the ground reshapes under it.
                </p>
                <p className="border-l-2 border-accent pl-3 text-[13px] leading-snug font-medium">
                  Which one should we aim for? The deck does not answer that one.
                </p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={reset}
          className="mt-3 ml-auto flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
        >
          <RotateCcw size={12} /> reset station
        </button>
      </div>

      {/* Station switcher */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-16 flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/85 p-1.5 backdrop-blur-md">
          {STATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStation(s.id)}
              className={`relative rounded-full px-5 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                station === s.id ? "text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {station === s.id ? (
                <motion.span
                  layoutId="station-pill"
                  transition={SPRING}
                  className="absolute inset-0 rounded-full bg-accent"
                />
              ) : null}
              <span className="relative">
                {s.n} · {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  format,
  onChange,
  tone,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  tone: "accent" | "warn";
}) {
  return (
    <label className="block">
      <span className="deck-kicker mb-2 flex items-baseline justify-between">
        {label}
        <span className={tone === "warn" ? "text-warn" : "text-accent"}>
          {format ? format(value) : `${value.toFixed(2).replace(/\.?0+$/, "")}${suffix}`}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: tone === "warn" ? "var(--warn)" : "var(--accent)" }}
      />
    </label>
  );
}
