"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { SPRING } from "@/lib/motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes resolves the theme only on the client; render a neutral icon until then
  // so the markup matches what the server produced.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const dark = resolvedTheme === "dark";

  return (
    <Magnetic strength={0.3} radius={60}>
      <motion.button
        aria-label="Toggle theme"
        onClick={() => setTheme(dark ? "light" : "dark")}
        whileTap={{ scale: 0.9 }}
        transition={SPRING}
        className="glass grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-fg"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mounted ? String(dark) : "placeholder"}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.28 }}
            className="grid place-items-center"
          >
            {mounted && dark ? <Moon size={15} /> : <Sun size={15} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </Magnetic>
  );
}
