"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Grid3x3, Keyboard, Maximize2, Minimize2 } from "lucide-react";
import { useDeck } from "@/lib/deck-store";
import { ThemeToggle } from "./ThemeToggle";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE_OUT, SPRING } from "@/lib/motion";

function IconButton({
  label,
  onClick,
  children,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Magnetic strength={0.3} radius={60}>
      <motion.button
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.9 }}
        transition={SPRING}
        className="glass grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        {children}
      </motion.button>
    </Magnetic>
  );
}

export function NavigationBar() {
  const { index, total, next, prev, goTo, isFullscreen, setOverviewOpen, setShortcutsOpen } =
    useDeck();

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  };

  return (
    <>
      {/* Edge chevrons */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-40 grid w-24 place-items-center">
        <motion.button
          aria-label="Previous slide"
          onClick={prev}
          disabled={index === 1}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: index === 1 ? 0 : 0.35, x: 0 }}
          whileHover={{ opacity: 1, x: -3 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full text-fg disabled:pointer-events-none"
        >
          <ChevronLeft size={26} strokeWidth={1.5} />
        </motion.button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-40 grid w-24 place-items-center">
        <motion.button
          aria-label="Next slide"
          onClick={next}
          disabled={index === total}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: index === total ? 0 : 0.35, x: 0 }}
          whileHover={{ opacity: 1, x: 3 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full text-fg disabled:pointer-events-none"
        >
          <ChevronRight size={26} strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Control cluster */}
      <div className="pointer-events-auto absolute top-6 right-8 z-50 flex items-center gap-2">
        <IconButton label="Slide overview (Esc)" onClick={() => setOverviewOpen(true)}>
          <Grid3x3 size={15} />
        </IconButton>
        <IconButton label="Keyboard shortcuts (?)" onClick={() => setShortcutsOpen(true)}>
          <Keyboard size={15} />
        </IconButton>
        <IconButton label="Fullscreen (F)" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </IconButton>
        <ThemeToggle />
      </div>

      {/* Counter */}
      <button
        onClick={() => setOverviewOpen(true)}
        className="pointer-events-auto absolute right-8 bottom-7 z-50 font-mono text-[13px] tracking-[0.18em] text-faint transition-colors hover:text-fg"
        aria-label="Open slide overview"
      >
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="inline-block text-fg"
        >
          {String(index).padStart(2, "0")}
        </motion.span>
        <span className="mx-1 opacity-50">/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </button>

      {/* Home affordance */}
      <button
        onClick={() => goTo(1, -1)}
        className="pointer-events-auto absolute bottom-7 left-8 z-50 font-mono text-[11px] tracking-[0.16em] text-faint uppercase transition-colors hover:text-fg"
      >
        Engineering in the AI Era
      </button>
    </>
  );
}
