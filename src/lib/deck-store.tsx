"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type KeyHandler = (e: KeyboardEvent) => boolean;

type DeckState = {
  index: number;
  total: number;
  direction: 1 | -1;
  overviewOpen: boolean;
  shortcutsOpen: boolean;
  jumpBuffer: string;
  isFullscreen: boolean;
  goTo: (n: number, direction?: 1 | -1) => void;
  next: () => void;
  prev: () => void;
  setOverviewOpen: (v: boolean) => void;
  setShortcutsOpen: (v: boolean) => void;
  /** Slides claim keys while active; returning true from the handler stops deck nav. */
  registerKeyCapture: (fn: KeyHandler) => () => void;
};

const DeckContext = createContext<DeckState | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used inside <DeckProvider>");
  return ctx;
}

/** True when this slide is the active one — slides use it to gate heavy work. */
export function useIsActive(slideIndex: number) {
  return useDeck().index === slideIndex;
}

/** Slides within one step of the active slide stay mounted; the rest unmount. */
export function useIsNear(slideIndex: number, radius = 1) {
  const { index } = useDeck();
  return Math.abs(index - slideIndex) <= radius;
}

function readHash(total: number): number | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/^#\/slide\/(\d+)$/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= total ? n : null;
}

export function DeckProvider({
  total,
  children,
}: {
  total: number;
  children: React.ReactNode;
}) {
  // Index and direction move together, so they live in one state value. That keeps
  // `goTo`/`next`/`prev` stable, which keeps the single keydown listener from being
  // torn down and rebuilt on every slide change.
  const [nav, setNav] = useState<{ index: number; direction: 1 | -1 }>({
    index: 1,
    direction: 1,
  });
  const { index, direction } = nav;
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [jumpBuffer, setJumpBuffer] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const captures = useRef(new Set<KeyHandler>());
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The single keydown listener needs to know which overlay is up without taking the
  // overlay state as a dependency (that would rebuild the listener on every toggle).
  const overlays = useRef({ overview: false, shortcuts: false });
  useEffect(() => {
    overlays.current = { overview: overviewOpen, shortcuts: shortcutsOpen };
  }, [overviewOpen, shortcutsOpen]);

  const goTo = useCallback(
    (n: number, dir?: 1 | -1) => {
      setNav((cur) => {
        const clamped = Math.min(Math.max(n, 1), total);
        if (clamped === cur.index) return cur;
        return { index: clamped, direction: dir ?? (clamped > cur.index ? 1 : -1) };
      });
      setOverviewOpen(false);
      setShortcutsOpen(false);
    },
    [total],
  );

  const step = useCallback(
    (delta: 1 | -1) => {
      setNav((cur) => {
        const clamped = Math.min(Math.max(cur.index + delta, 1), total);
        if (clamped === cur.index) return cur;
        return { index: clamped, direction: delta };
      });
      setOverviewOpen(false);
      setShortcutsOpen(false);
    },
    [total],
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  const registerKeyCapture = useCallback((fn: KeyHandler) => {
    captures.current.add(fn);
    return () => {
      captures.current.delete(fn);
    };
  }, []);

  // ---- hash <-> state ---------------------------------------------------
  // The deep-linked slide is captured once and kept in a ref. Without that, React's
  // development double-invoke re-runs this effect *after* the writer below has already
  // replaced the hash with `#/slide/1`, and the second read sends the deck back to 1.
  const bootHash = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (bootHash.current === undefined) bootHash.current = readHash(total);
    const boot = bootHash.current;
    // Syncing from an external system (the URL) on mount. It cannot be a lazy state
    // initialiser: the server never sees the hash, so that would mismatch on hydration.
    if (boot) goTo(boot);

    const onHash = () => {
      const n = readHash(total);
      if (n) goTo(n);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [total, goTo]);

  useEffect(() => {
    const target = `#/slide/${index}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [index]);

  // ---- fullscreen -------------------------------------------------------
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ---- keyboard ---------------------------------------------------------
  useEffect(() => {
    const commitJump = () => {
      setJumpBuffer((buf) => {
        if (buf) goTo(Number(buf));
        return "";
      });
    };

    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        return;
      }

      // Slides get first refusal on keys they have claimed.
      for (const fn of captures.current) {
        if (fn(e)) return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setJumpBuffer((b) => (b + e.key).slice(0, 3));
        if (jumpTimer.current) clearTimeout(jumpTimer.current);
        jumpTimer.current = setTimeout(commitJump, 1200);
        return;
      }

      switch (e.key) {
        case "Enter":
          if (jumpTimer.current) clearTimeout(jumpTimer.current);
          commitJump();
          break;
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(1, -1);
          break;
        case "End":
          e.preventDefault();
          goTo(total, 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen().catch(() => {});
          break;
        case "Escape":
          // Esc peels off one layer at a time: fullscreen, then the shortcuts sheet,
          // then the overview. Only from a bare slide does it open the overview.
          if (document.fullscreenElement) {
            void document.exitFullscreen();
          } else if (overlays.current.shortcuts) {
            setShortcutsOpen(false);
          } else {
            setOverviewOpen((v) => !v);
          }
          break;
        case "?":
          e.preventDefault();
          setShortcutsOpen((v) => !v);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
    };
  }, [goTo, next, prev, total]);

  const value = useMemo<DeckState>(
    () => ({
      index,
      total,
      direction,
      overviewOpen,
      shortcutsOpen,
      jumpBuffer,
      isFullscreen,
      goTo,
      next,
      prev,
      setOverviewOpen,
      setShortcutsOpen,
      registerKeyCapture,
    }),
    [
      index,
      total,
      direction,
      overviewOpen,
      shortcutsOpen,
      jumpBuffer,
      isFullscreen,
      goTo,
      next,
      prev,
      registerKeyCapture,
    ],
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

/** Claim keys for the duration of a slide being active. */
export function useSlideKeyCapture(active: boolean, handler: KeyHandler) {
  const { registerKeyCapture } = useDeck();
  const ref = useRef(handler);

  useEffect(() => {
    ref.current = handler;
  });

  useEffect(() => {
    if (!active) return;
    return registerKeyCapture((e) => ref.current(e));
  }, [active, registerKeyCapture]);
}
