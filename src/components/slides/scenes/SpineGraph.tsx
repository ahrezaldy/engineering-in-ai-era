"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export const SPINE = [
  { id: 0, short: "AI changes how software is built", full: "AI is changing software development." },
  { id: 1, short: "Implementation gets cheaper", full: "Implementation becomes cheaper." },
  { id: 2, short: "Management sees leverage", full: "Management sees more potential engineering leverage." },
  { id: 3, short: "Expectations change", full: "Therefore expectations change." },
  { id: 4, short: "Coding alone isn't enough", full: "Engineers need more than coding ability." },
  { id: 5, short: "Judgment becomes scarce", full: "Problem solving, judgment and AI leverage become increasingly important." },
  { id: 6, short: "Seniority is ownership", full: "Seniority becomes more about ownership, decision-making and multiplying others." },
  { id: 7, short: "OUTPUT → OUTCOME", full: "The goal changes: OUTPUT becomes OUTCOME." },
];

/** Positions along a gentle helix, computed once. */
export function spinePositions() {
  return SPINE.map((_, i) => {
    const t = i / (SPINE.length - 1);
    const angle = t * Math.PI * 2 - Math.PI / 2;
    return new THREE.Vector3(
      1.9 + Math.cos(angle) * 1.9,
      (t - 0.5) * 5,
      Math.sin(angle) * 1.9 - 1,
    );
  });
}

function Node({
  position,
  index,
  revealed,
  active,
  onSelect,
}: {
  position: THREE.Vector3;
  index: number;
  revealed: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const hover = useRef(false);
  const reduced = useReducedMotionSafe();
  const { accent, warn, dark } = usePalette();

  // Colour grades from "implementation" amber to "outcome" indigo along the chain.
  const tint = useMemo(() => {
    const t = index / (SPINE.length - 1);
    return new THREE.Color(warn).lerp(new THREE.Color(accent), t);
  }, [index, accent, warn]);

  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const s = (revealed ? 1 : 0.001) * (active ? 1.55 : hover.current ? 1.22 : 1);
    m.scale.lerp(new THREE.Vector3(s, s, s), 0.14);
    if (!reduced) m.rotation.y += 0.004;
    const mm = mat.current;
    if (mm) {
      const want = active ? (dark ? 2.2 : 0.8) : hover.current ? (dark ? 1.2 : 0.45) : dark ? 0.55 : 0.18;
      mm.emissiveIntensity += (want - mm.emissiveIntensity) * 0.12;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={0.001}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => (hover.current = true)}
      onPointerOut={() => (hover.current = false)}
    >
      <icosahedronGeometry args={[0.24, 0]} />
      <meshStandardMaterial
        ref={mat}
        color={tint}
        emissive={tint}
        emissiveIntensity={0.55}
        roughness={0.25}
        metalness={0.4}
        toneMapped={false}
      />
    </mesh>
  );
}

function Edge({
  from,
  to,
  drawn,
  highlighted,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  drawn: boolean;
  highlighted: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const { accent, line } = usePalette();

  const { mid, quat, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return {
      mid: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5),
      quat: q,
      length: dir.length(),
    };
  }, [from, to]);

  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    m.scale.y += ((drawn ? 1 : 0.001) - m.scale.y) * 0.16;
    const mm = mat.current;
    if (mm) {
      mm.opacity += ((highlighted ? 0.95 : 0.4) - mm.opacity) * 0.12;
      mm.color.lerp(new THREE.Color(highlighted ? accent : line), 0.1);
    }
  });

  return (
    <mesh ref={ref} position={mid} quaternion={quat} scale={[1, 0.001, 1]}>
      <cylinderGeometry args={[0.018, 0.018, length, 8]} />
      <meshBasicMaterial ref={mat} color={line} transparent opacity={0.4} />
    </mesh>
  );
}

export function SpineGraph({
  revealed,
  active,
  onSelect,
}: {
  revealed: number;
  active: number | null;
  onSelect: (i: number | null) => void;
}) {
  const positions = useMemo(() => spinePositions(), []);
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotionSafe();
  const { accent, dark } = usePalette();

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    // A slow lean back and forth reads as depth without ever carrying a node off-frame.
    const want = reduced || active !== null ? 0 : Math.sin(clock.elapsedTime * 0.22) * 0.3;
    g.rotation.y += (want - g.rotation.y) * 0.04;
  });

  return (
    <group>
      <mesh position={[0, 0, -8]} onClick={() => onSelect(null)}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <group ref={group}>
        {positions.slice(0, -1).map((p, i) => (
          <Edge
            key={i}
            from={p}
            to={positions[i + 1]}
            drawn={revealed > i + 1}
            highlighted={active === i || active === i + 1}
          />
        ))}

        {positions.map((p, i) => (
          <Node
            key={i}
            position={p}
            index={i}
            revealed={revealed > i}
            active={active === i}
            onSelect={() => onSelect(active === i ? null : i)}
          />
        ))}

        {/* Glow at the far end of the argument. */}
        <pointLight
          position={positions[positions.length - 1]}
          color={accent}
          intensity={revealed >= SPINE.length ? (dark ? 9 : 4) : 0}
          distance={6}
        />
      </group>
    </group>
  );
}
