"use client";

import { DeckProvider } from "@/lib/deck-store";
import { SlideDeck } from "@/components/deck/SlideDeck";
import { SLIDES } from "@/components/slides";

export default function Page() {
  return (
    <DeckProvider total={SLIDES.length}>
      <SlideDeck />
    </DeckProvider>
  );
}
