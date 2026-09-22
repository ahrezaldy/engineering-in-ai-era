"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeck } from "@/lib/deck-store";
import { SLIDES } from "@/components/slides";
import { variantsFor } from "@/lib/transitions";
import { NavigationBar } from "./NavigationBar";
import { ProgressBar } from "./ProgressBar";
import { ThumbnailOverview } from "./ThumbnailOverview";
import { ShortcutsSheet } from "./ShortcutsSheet";
import { JumpOverlay } from "./JumpOverlay";

export function SlideDeck() {
  const { index, direction } = useDeck();
  const slide = SLIDES[index - 1];
  const Slide = slide.Component;

  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <motion.section
          key={slide.id}
          custom={direction}
          variants={variantsFor(slide.transition ?? "push")}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          aria-label={`Slide ${index}: ${slide.title}`}
        >
          <Slide slideIndex={index} />
        </motion.section>
      </AnimatePresence>

      <NavigationBar />
      <ProgressBar />
      <ThumbnailOverview />
      <ShortcutsSheet />
      <JumpOverlay />
    </main>
  );
}
