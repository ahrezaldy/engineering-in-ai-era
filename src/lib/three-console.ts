import { setConsoleFunction } from "three";

/**
 * three.js r183 deprecated `Clock`, and `@react-three/fiber` still constructs one for
 * every `<Canvas>`. That fires a console warning we cannot fix from here, and Next's dev
 * overlay counts it — so the deck showed a red "1 Issue" badge on every 3D slide.
 *
 * `setConsoleFunction` is three's own supported hook for routing its logging. We swallow
 * exactly this one deprecation and forward everything else to the real console, so any
 * genuine three.js warning still surfaces. Remove this once R3F moves to `THREE.Timer`.
 */
const SILENCED = /^THREE\.Clock: This module has been deprecated/;

let installed = false;

export function installThreeConsoleFilter() {
  if (installed) return;
  installed = true;

  setConsoleFunction((level: "log" | "info" | "warn" | "error", message: unknown, ...rest: unknown[]) => {
    if (level === "warn" && typeof message === "string" && SILENCED.test(message)) return;
    const fn = console[level] ?? console.log;
    fn(message, ...rest);
  });
}
