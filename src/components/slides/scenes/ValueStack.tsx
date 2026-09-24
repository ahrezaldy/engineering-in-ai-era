"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox, Text } from "@react-three/drei";

import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export const PILLARS = [
  { id: "problem", label: "Problem\nSolving", x: -2.1 },
  { id: "judgment", label: "Technical\nJudgment", x: 0 },
  { id: "leverage", label: "AI\nLeverage", x: 2.1 },
] as const;

export type PillarId = (typeof PILLARS)[number]["id"];

/**
 * The source's diagram has three pillars converging into Business Impact, while the
 * capability list under it has four entries. The fourth — business awareness — is not a
 * fourth pillar; it is the slab the other three converge into, so it selects the cap.
 */
export type StackSelection = PillarId | "business";

function Pillar({
  x,
  label,
  active,
  dimmed,
  seed,
  onSelect,
}: {
  x: number;
  label: string;
  active: boolean;
  dimmed: boolean;
  seed: number;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const hovered = useRef(false);
  const reduced = useReducedMotionSafe();
  const { accent, fg, dark } = usePalette();

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const breathe = reduced ? 0 : Math.sin(clock.elapsedTime * 0.8 + seed) * 0.055;
    g.position.y += (breathe - g.position.y) * 0.08;
    const target = active ? 1.06 : hovered.current ? 1.03 : 1;
    g.scale.x += (target - g.scale.x) * 0.12;
    g.scale.z += (target - g.scale.z) * 0.12;

    const m = mat.current;
    if (m) {
      const want = active ? (dark ? 0.85 : 0.3) : hovered.current ? (dark ? 0.5 : 0.18) : dark ? 0.22 : 0.05;
      m.emissiveIntensity += (want - m.emissiveIntensity) * 0.12;
      m.opacity += ((dimmed ? 0.3 : 1) - m.opacity) * 0.12;
    }
  });

  return (
    <group
      ref={ref}
      position={[x, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
    >
      <RoundedBox args={[1.25, 3.2, 1.25]} radius={0.16} smoothness={4} position={[0, 0.1, 0]}>
        <meshStandardMaterial
          ref={mat}
          color={active ? accent : fg}
          emissive={accent}
          emissiveIntensity={0.22}
          roughness={0.3}
          metalness={dark ? 0.5 : 0.15}
          transparent
          opacity={1}
        />
      </RoundedBox>
      <Text
        position={[0, -2.05, 0]}
        fontSize={0.27}
        color={active ? accent : dark ? "#a1a1aa" : "#71717a"}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        lineHeight={1.25}
      >
        {label}
      </Text>
    </group>
  );
}

export function ValueStack({
  selected,
  onSelect,
}: {
  selected: StackSelection | null;
  onSelect: (id: StackSelection | null) => void;
}) {
  const { accent, dark } = usePalette();
  const cap = useRef<THREE.Group>(null);
  const capMat = useRef<THREE.MeshStandardMaterial>(null);
  const capHover = useRef(false);
  const reduced = useReducedMotionSafe();
  const capActive = selected === "business";

  useFrame(({ clock }) => {
    const g = cap.current;
    if (g) {
      const bob = reduced ? 0 : Math.sin(clock.elapsedTime * 0.6) * 0.07;
      g.position.y += (2.75 + bob - g.position.y) * 0.12;
      const s = capActive ? 1.06 : capHover.current ? 1.03 : 1;
      g.scale.lerp(new THREE.Vector3(s, 1, s), 0.12);
    }
    const m = capMat.current;
    if (m) {
      const want = capActive
        ? dark
          ? 1.5
          : 0.55
        : capHover.current
          ? dark
            ? 1.05
            : 0.4
          : dark
            ? 0.75
            : 0.25;
      m.emissiveIntensity += (want - m.emissiveIntensity) * 0.12;
      m.opacity += ((selected !== null && !capActive ? 0.45 : 1) - m.opacity) * 0.12;
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* Clicking past the pillars clears the selection. */}
      <mesh position={[0, 0, -4]} onClick={() => onSelect(null)}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {PILLARS.map((p, i) => (
        <Pillar
          key={p.id}
          x={p.x}
          label={p.label}
          seed={i * 1.7}
          active={selected === p.id}
          dimmed={selected !== null && selected !== p.id}
          onSelect={() => onSelect(selected === p.id ? null : p.id)}
        />
      ))}

      {/* Business Impact — what the three pillars converge into, and the target for the
          fourth capability, business awareness. */}
      <group
        ref={cap}
        position={[0, 2.75, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(capActive ? null : "business");
        }}
        onPointerOver={() => (capHover.current = true)}
        onPointerOut={() => (capHover.current = false)}
      >
        <RoundedBox args={[6.2, 0.55, 1.6]} radius={0.16} smoothness={4}>
          <meshStandardMaterial
            ref={capMat}
            color={accent}
            emissive={accent}
            emissiveIntensity={dark ? 0.75 : 0.25}
            roughness={0.25}
            metalness={0.4}
            transparent
            opacity={1}
          />
        </RoundedBox>
        <Text position={[0, 0, 0.85]} fontSize={0.3} color={dark ? "#101014" : "#ffffff"} anchorX="center">
          Business Impact
        </Text>
      </group>

      <ContactShadows position={[0, -1.85, 0]} opacity={dark ? 0.5 : 0.28} scale={14} blur={2.6} far={5} />
    </group>
  );
}
