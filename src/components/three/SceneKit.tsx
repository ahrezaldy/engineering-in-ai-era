"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

/** Palette mirrored from globals.css so 3D and 2D never drift apart. */
export function usePalette() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return useMemo(
    () => ({
      dark,
      bg: dark ? "#101014" : "#fafaf9",
      fg: dark ? "#f0f0f2" : "#18181b",
      muted: dark ? "#a1a1aa" : "#71717a",
      accent: dark ? "#818cf8" : "#4f46e5",
      warn: dark ? "#f59e0b" : "#b45309",
      surface: dark ? "#1a1b20" : "#ffffff",
      line: dark ? "#33343c" : "#e4e4e7",
    }),
    [dark],
  );
}

/** Three-point rig plus a theme-matched environment. */
export function SceneLights({ intensity = 1 }: { intensity?: number }) {
  const { dark, accent } = usePalette();
  return (
    <>
      <ambientLight intensity={(dark ? 0.35 : 0.85) * intensity} />
      <directionalLight position={[4, 6, 5]} intensity={(dark ? 1.6 : 2.2) * intensity} />
      <directionalLight position={[-5, -2, -4]} intensity={(dark ? 0.7 : 0.4) * intensity} color={accent} />
      <Environment preset={dark ? "night" : "city"} environmentIntensity={dark ? 0.4 : 0.7} />
    </>
  );
}

/** Damped camera lean toward the pointer. Disabled under reduced motion. */
export function PointerCamera({
  amount = 0.6,
  damping = 0.045,
  enabled = true,
}: {
  amount?: number;
  damping?: number;
  enabled?: boolean;
}) {
  // Everything is read off the frame state rather than closed over from render, so the
  // camera is only ever touched inside the render loop that owns it.
  const rest = useRef<THREE.Vector3 | null>(null);

  useFrame(({ camera, pointer }) => {
    if (!rest.current) rest.current = camera.position.clone();
    if (!enabled) return;
    const r = rest.current;
    camera.position.x += (r.x + pointer.x * amount - camera.position.x) * damping;
    camera.position.y += (r.y + pointer.y * amount - camera.position.y) * damping;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Slow drifting point field used as ambient backdrop on hero slides. */
export function Particles({
  count = 600,
  spread = 14,
  size = 0.035,
  speed = 0.04,
  color,
  repelPointer = false,
}: {
  count?: number;
  spread?: number;
  size?: number;
  speed?: number;
  color?: string;
  repelPointer?: boolean;
}) {
  const { accent, dark } = usePalette();
  const ref = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  const positions = useMemo(() => {
    const rand = mulberry32(0x9e3779b9 ^ count);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * spread;
      arr[i * 3 + 1] = (rand() - 0.5) * spread * 0.6;
      arr[i * 3 + 2] = (rand() - 0.5) * spread * 0.5;
    }
    return arr;
  }, [count, spread]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    pts.rotation.y += delta * speed * 0.25;
    if (repelPointer) {
      const tx = -pointer.x * viewport.width * 0.012;
      const ty = -pointer.y * viewport.height * 0.012;
      pts.position.x += (tx - pts.position.x) * 0.05;
      pts.position.y += (ty - pts.position.y) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color ?? accent}
        transparent
        opacity={dark ? 0.75 : 0.5}
        sizeAttenuation
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
