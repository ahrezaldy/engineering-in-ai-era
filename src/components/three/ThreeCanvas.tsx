"use client";

import dynamic from "next/dynamic";
import type { ThreeCanvasProps } from "./CanvasInner";

/**
 * R3F is client-only. Everything 3D in this deck enters through here so there is a
 * single place that guarantees `ssr: false`.
 */
const CanvasInner = dynamic(() => import("./CanvasInner"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

export function ThreeCanvas(props: ThreeCanvasProps) {
  return <CanvasInner {...props} />;
}
