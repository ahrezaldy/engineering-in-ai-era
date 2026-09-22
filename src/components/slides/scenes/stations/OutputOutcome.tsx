"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Text } from "@react-three/drei";
import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const GROUND_Y = -1.6;
const TIP_THRESHOLD = 2.9;

/**
 * Volume grows straight off the AI multiplier. Outcome only grows as far as judgment
 * carries it — and past a point the volume column is too tall for its own base and
 * falls over.
 */
function Column({
  x,
  height,
  color,
  emissive,
  tipping,
}: {
  x: number;
  height: number;
  color: string;
  emissive: number;
  /** 0 = upright, 1 = flat on the ground. */
  tipping: number;
}) {
  // Two nested groups: the outer one is the pivot and sits ON the ground, so rotating it
  // swings the column about its base the way a falling object actually does. Rotating a
  // centre-pivoted group just spun it in mid-air.
  const pivot = useRef<THREE.Group>(null);
  const scaler = useRef<THREE.Group>(null);
  const tip = useRef(0);
  const reduced = useReducedMotionSafe();

  useFrame(() => {
    const s = scaler.current;
    if (s) s.scale.y += (height - s.scale.y) * 0.1;

    const p = pivot.current;
    if (p) {
      // Accelerate into the fall rather than easing linearly — it reads as gravity.
      const k = reduced ? 1 : 0.02 + tip.current * 0.09;
      tip.current += (tipping - tip.current) * k;
      p.rotation.z = tip.current * (Math.PI / 2);
    }
  });

  return (
    <group ref={pivot} position={[x, GROUND_Y, 0]}>
      <group ref={scaler} scale={[1, 1, 1]}>
        {/* Geometry spans 0..1 in local space so the base sits exactly on the pivot. */}
        <RoundedBox args={[1.3, 1, 1.3]} radius={0.08} smoothness={3} position={[0, 0.5, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissive}
            roughness={0.35}
            metalness={0.25}
          />
        </RoundedBox>
      </group>
    </group>
  );
}

export function OutputOutcome({ speed, judgment }: { speed: number; judgment: number }) {
  const { accent, warn, dark } = usePalette();

  const volumeH = 0.8 + speed * 0.72;
  const outcomeH = 0.8 + speed * 0.72 * judgment;
  const unstable = volumeH > TIP_THRESHOLD && judgment < 0.55;
  const tipping = unstable ? Math.min(1, (volumeH - TIP_THRESHOLD) / 1.5) : 0;

  return (
    <group position={[0, -0.2, 0]}>
      <Column
        x={-2}
        height={volumeH}
        color={warn}
        emissive={dark ? 0.45 : 0.12}
        tipping={tipping}
      />
      <Column x={2} height={outcomeH} color={accent} emissive={dark ? 0.6 : 0.16} tipping={0} />

      {/* Upright and in front of each column. Painted flat on the floor, the camera saw
          them at a grazing angle and the glyphs foreshortened and smeared. */}
      <Text
        position={[-2, GROUND_Y + 0.2, 2.7]}
        fontSize={0.3}
        color={warn}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={dark ? "#0a0a0b" : "#fafaf9"}
      >
        Volume
      </Text>
      <Text
        position={[2, GROUND_Y + 0.2, 2.7]}
        fontSize={0.3}
        color={accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={dark ? "#0a0a0b" : "#fafaf9"}
      >
        Outcome
      </Text>

      {/* Says out loud what the fall means, so the scene is not a mystery. Real DOM via
          Html rather than 3D text: it stays sharp at any camera angle and can wear the
          same glass card as the recap panel. `zIndexRange` keeps it under the deck
          chrome and the overview grid, which Html's default range would sit above. */}
      {unstable ? (
        <Html position={[-2, 0.35, 1.9]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="glass rounded-xl px-5 py-2.5 text-[16px] font-medium whitespace-nowrap text-warn shadow-[var(--shadow)]"
          >
            too tall for the judgment under it
          </motion.div>
        </Html>
      ) : null}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y - 0.01, 0]}>
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial color={dark ? "#141417" : "#f4f4f5"} roughness={0.9} />
      </mesh>
    </group>
  );
}
