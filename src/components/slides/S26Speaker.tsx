"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, GraduationCap, Handshake, MapPin } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { Magnetic } from "@/components/ui/Magnetic";
import { Tilt } from "@/components/ui/Tilt";
import { DECK } from "@/lib/deck-config";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Every year here is a literal. Deriving a duration from `Date` would drift each year,
 * mismatch between server and client, and contradict the "8+ years in people management"
 * figure — Mamikos alone is only seven years.
 */
const ROLES = [
  {
    id: "agit",
    span: "2013–2014",
    company: "AGIT",
    title: "Junior Developer",
    logo: "/logo-agit.png",
  },
  {
    id: "gdplabs",
    span: "2014–2019",
    company: "GDP Labs",
    title: "Principal Software Development Engineer",
    logo: "/logo-gdp-labs.png",
  },
  {
    id: "mamikos",
    span: "2019–present",
    company: "Mamikos",
    title: "Senior Engineering Manager",
    logo: "/logo-mamikos.png",
  },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

/** Handle text rather than brand icons — lucide dropped its brand set, and a URL in mono
 *  reads from the back of a room and survives being photographed. */
/** Both entries share one shape — what, then when. */
const SWE_GROWTH = [
  ["Tech & career mentor", "Present"],
  ["\u201CLearning Culture\u201D talk", "2024"],
] as const;

const LINKS = [
  { label: "linkedin.com/in/ahrezaldy", href: "https://linkedin.com/in/ahrezaldy", external: true },
  { label: "github.com/ahrezaldy", href: "https://github.com/ahrezaldy", external: true },
  { label: "ahrezaldy@gmail.com", href: "mailto:ahrezaldy@gmail.com", external: false },
  {
    label: "adplist.org/mentors/arif-h-rezaldy",
    href: "https://adplist.org/mentors/arif-h-rezaldy",
    external: true,
  },
] as const;

export function S26Speaker() {
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState<RoleId>("agit");

  return (
    <SlideShell
      kicker="Speaker"
      title={DECK.speaker}
      lede={
        <>
          Senior Engineering Manager, Mamikos{" "}
          <span className="text-faint">· 2019–present</span>
        </>
      }
    >
      <div className="flex h-full flex-col justify-center gap-10">
        {/* Row A — the one figure the timeline cannot tell you, and the room connection */}
        <div className="flex items-end justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.28 }}
            className="shrink-0"
          >
            <Image
              src="/arif-rezaldy.jpg"
              alt=""
              width={132}
              height={132}
              priority
              className="h-[132px] w-[132px] rounded-full object-cover ring-1 ring-line"
            />
          </motion.div>

          <div className="mr-auto flex items-end gap-4">
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block font-mono text-[96px] leading-[0.82] font-semibold tracking-tighter tabular-nums"
                initial={{ y: reduced ? 0 : "105%", opacity: reduced ? 0 : 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: reduced ? 0.3 : 0.7, ease: EASE_OUT, delay: 0.35 }}
              >
                8
              </motion.span>
            </span>
            <span className="pb-1.5 font-mono text-[38px] leading-none font-medium text-faint">
              +
            </span>
            <motion.div
              className="pb-2.5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.45 }}
            >
              <div className="text-[20px] leading-tight font-medium">
                years in people management
              </div>
              <div className="mt-1 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                of 14+ years in tech
              </div>
            </motion.div>
          </div>

          <Tilt max={6} lift={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.62, ease: EASE_OUT, delay: 0.5 }}
              className="w-[300px] rounded-2xl border border-line bg-surface p-5"
            >
              <div className="deck-kicker mb-3 flex items-center gap-2 text-[10px]">
                <Handshake size={13} /> SWE Growth
              </div>
              <dl className="space-y-2">
                {SWE_GROWTH.map(([what, when]) => (
                  <div key={what} className="flex items-baseline justify-between gap-3">
                    <dt className="text-[14px] leading-snug">{what}</dt>
                    <dd className="shrink-0 font-mono text-[11px] tracking-wider text-faint">
                      {when}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </Tilt>
        </div>

        {/* Row B — career rail. Equally spaced rather than proportional: across 2013–2026
            the first two roles would collide at this width. The printed spans carry the
            real durations. */}
        <div className="relative pt-1">
          <motion.span
            className="absolute top-1 right-0 left-0 block h-px origin-left bg-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.62 }}
          />

          <motion.div
            className="grid grid-cols-3 gap-10"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.78 } } }}
          >
            {ROLES.map((r) => {
              const on = active === r.id;
              return (
                <motion.button
                  key={r.id}
                  onMouseEnter={() => setActive(r.id)}
                  onFocus={() => setActive(r.id)}
                  onClick={() => setActive(r.id)}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                  }}
                  className={`group relative cursor-pointer pt-7 text-left transition-opacity duration-300 ${
                    on ? "opacity-100" : "opacity-45"
                  }`}
                >
                  {/* Selection marker is the slide's only accent. Rendered in the active
                      branch only, so there is never more than one live layoutId. */}
                  {on ? (
                    <motion.span
                      layoutId="role-marker"
                      transition={SPRING}
                      className="absolute -top-[4px] left-0 block h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent/15"
                    />
                  ) : (
                    <span className="absolute -top-[2.5px] left-0 block h-1.5 w-1.5 rounded-full bg-faint" />
                  )}

                  <div className="font-mono text-[12px] tracking-[0.16em] text-faint tabular-nums">
                    {r.span}
                  </div>
                  {/* Logos are greyed at rest and regain their colour only on the
                      selected role. Three saturated brand palettes (green, cyan,
                      purple/orange) shown at once would fight the deck's two-colour
                      code; this way they stay neutral marks until one is the subject. */}
                  <div className="mt-1.5 flex items-center gap-3">
                    <Image
                      src={r.logo}
                      alt=""
                      width={32}
                      height={32}
                      className={`h-8 w-8 shrink-0 rounded-md object-cover transition-all duration-300 ${
                        on ? "opacity-100 grayscale-0" : "opacity-60 grayscale"
                      }`}
                    />
                    <span
                      className={`text-[26px] font-medium tracking-tight transition-colors duration-300 ${
                        on ? "text-fg" : "text-muted"
                      }`}
                    >
                      {r.company}
                    </span>
                  </div>
                  <div className="mt-1 text-[15px] leading-snug text-muted">{r.title}</div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Row C — why the perspective is worth 45 minutes, and where to find him */}
        <div className="flex items-end justify-between gap-12">
          <div className="border-l border-line pl-5">
            <motion.p
              className="max-w-[520px] text-[17px] leading-snug text-balance text-muted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 1.05 }}
            >
              Building high-performing engineering teams and cultivating a culture where great
              engineers — and future leaders — grow.
            </motion.p>
            <motion.div
              className="mt-3 flex items-center gap-4 font-mono text-[11px] tracking-[0.14em] text-faint uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap size={12} /> ITS Surabaya
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Yogyakarta, Indonesia
              </span>
            </motion.div>
          </div>

          <motion.div
            className="flex max-w-[560px] flex-wrap justify-end gap-2"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 1.25 } } }}
          >
            {LINKS.map((l) => (
              <Magnetic key={l.label} strength={0.25} radius={70}>
                <motion.a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                  }}
                  whileHover={{ y: -2 }}
                  transition={SPRING}
                  className="group flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[12px] text-muted transition-colors hover:border-fg/25 hover:text-fg"
                >
                  {l.label}
                  <ArrowUpRight
                    size={12}
                    className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </motion.a>
              </Magnetic>
            ))}
          </motion.div>
        </div>
      </div>
    </SlideShell>
  );
}
