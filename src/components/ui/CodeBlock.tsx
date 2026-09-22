"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { createHighlighterCore, type HighlighterCore, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Fine-grained Shiki: only the languages and themes this deck actually uses are bundled.
 * The full `shiki` entry point pulls every grammar and theme — about a megabyte for two
 * code samples. The highlighter is created once and shared by every CodeBlock.
 */
let highlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    langs: [
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/bash"),
      import("@shikijs/langs/json"),
    ],
    themes: [import("@shikijs/themes/vitesse-dark"), import("@shikijs/themes/vitesse-light")],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

type Props = {
  code: string;
  lang?: "ts" | "js" | "json" | "bash" | "text";
  className?: string;
  /** Lines fade in one after another rather than all at once. */
  lineByLine?: boolean;
  startDelay?: number;
  caption?: string;
};

export function CodeBlock({
  code,
  lang = "ts",
  className = "",
  lineByLine = true,
  startDelay = 0,
  caption,
}: Props) {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotionSafe();
  const [lines, setLines] = useState<ThemedToken[][] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getHighlighter()
      .then((hl) =>
        hl.codeToTokens(code.trim(), {
          lang: lang === "js" ? "typescript" : lang === "text" ? "typescript" : lang,
          theme: resolvedTheme === "dark" ? "vitesse-dark" : "vitesse-light",
        }),
      )
      .then((r) => {
        if (!cancelled) setLines(r.tokens);
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang, resolvedTheme]);

  const raw = code.trim().split("\n");

  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-warn/60" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        {caption ? (
          <span className="ml-2 font-mono text-[11px] tracking-wider text-faint">{caption}</span>
        ) : null}
      </div>
      <pre className="no-scrollbar overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.55]">
        <code>
          {(lines ?? raw.map(() => [])).map((tokens, i) => (
            <motion.span
              key={i}
              className="block"
              initial={{ opacity: 0, x: reduced ? 0 : -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.32,
                ease: EASE_OUT,
                delay: lineByLine && !reduced ? startDelay + i * 0.055 : startDelay,
              }}
            >
              {lines
                ? tokens.map((t, j) => (
                    <span key={j} style={{ color: t.color }}>
                      {t.content}
                    </span>
                  ))
                : raw[i]}
              {"\n"}
            </motion.span>
          ))}
        </code>
      </pre>
    </div>
  );
}
