"use client";

import { Suspense, useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { installThreeConsoleFilter } from "@/lib/three-console";

export type ThreeCanvasProps = {
  children: React.ReactNode;
  className?: string;
  camera?: CanvasProps["camera"];
  /** Set false on scenes that need pointer events to pass through to HTML beneath. */
  interactive?: boolean;
};

// Runs once, before any Canvas constructs a THREE.Clock.
installThreeConsoleFilter();

export default function CanvasInner({
  children,
  className = "",
  camera = { position: [0, 0, 7], fov: 45 },
  interactive = true,
}: ThreeCanvasProps) {
  // Drops resolution instead of frames when the GPU struggles on older laptops.
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      className={className}
      dpr={dpr}
      camera={camera}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
