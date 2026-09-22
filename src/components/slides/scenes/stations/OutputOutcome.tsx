"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
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

      <Text
        position={[-2, GROUND_Y + 0.02, 1.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.26}
        color={warn}
        anchorX="center"
      >
        Volume
      </Text>
      <Text
        position={[2, GROUND_Y + 0.02, 1.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.26}
        color={accent}
        anchorX="center"
      >
        Outcome
      </Text>

      {/* Says out loud what the fall means, so the scene is not a mystery. */}
      {unstable ? (
        <Text position={[-2, 0.2, 1.9]} fontSize={0.2} color={warn} anchorX="center" maxWidth={3.4} textAlign="center">
          too tall for the judgment under it
        </Text>
      ) : null}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y - 0.01, 0]}>
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial color={dark ? "#141417" : "#f4f4f5"} roughness={0.9} />
      </mesh>
    </group>
  );
}
