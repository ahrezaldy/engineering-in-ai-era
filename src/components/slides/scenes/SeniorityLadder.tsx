"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";
import { mulberry32 } from "@/lib/rng";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/** All three steps stay on screen; the active one is lit rather than flown to. */
export const LEVELS = [
  { id: "junior", label: "Junior", x: -1.85, y: -1.95 },
  { id: "mid", label: "Mid", x: 0, y: 0 },
  { id: "senior", label: "Senior", x: 1.85, y: 1.95 },
] as const;

export type LevelId = (typeof LEVELS)[number]["id"];

function Platform({
  x,
  y,
  label,
  active,
  visited,
  onSelect,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
  visited: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.Mesh>(null);
  const hover = useRef(false);
  const reduced = useReducedMotionSafe();
  const { accent, fg, dark } = usePalette();

  useFrame(({ clock }) => {
    const g = group.current;
    if (g) {
      const bob = reduced ? 0 : Math.sin(clock.elapsedTime * 0.7 + y) * 0.05;
      const lift = active ? 0.16 : 0;
      g.position.y += (y + lift + bob - g.position.y) * 0.1;
      const s = active ? 1.16 : hover.current ? 1.06 : 1;
      g.scale.lerp(new THREE.Vector3(s, s, s), 0.12);
    }
    const m = mat.current;
    if (m) {
      const want = active ? (dark ? 1.4 : 0.5) : visited ? (dark ? 0.4 : 0.14) : dark ? 0.1 : 0.03;
      m.emissiveIntensity += (want - m.emissiveIntensity) * 0.12;
      m.opacity += ((active ? 1 : visited ? 0.8 : 0.42) - m.opacity) * 0.12;
      m.color.lerp(new THREE.Color(active || visited ? accent : fg), 0.08);
    }
    const gl = glow.current;
    if (gl) {
      const s = active ? 1 : 0.001;
      gl.scale.lerp(new THREE.Vector3(s, s, s), 0.12);
      if (!reduced) gl.rotation.z += 0.004;
    }
  });

  return (
    <group
      ref={group}
      position={[x, y, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => (hover.current = true)}
      onPointerOut={() => (hover.current = false)}
    >
      <RoundedBox args={[1.75, 0.19, 1.15]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          ref={mat}
          color={fg}
          emissive={accent}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={dark ? 0.5 : 0.15}
          transparent
          opacity={0.42}
        />
      </RoundedBox>

      {/* Ring under the active step, so the highlight reads from the back of the room. */}
      <mesh ref={glow} position={[0, 0, -0.5]} scale={0.001}>
        <ringGeometry args={[1.16, 1.2, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={dark ? 0.5 : 0.35} side={THREE.DoubleSide} />
      </mesh>

      <Text
        position={[0, 0.4, 0.7]}
        fontSize={active ? 0.3 : 0.24}
        color={active ? accent : visited ? (dark ? "#a1a1aa" : "#71717a") : dark ? "#52525b" : "#a1a1aa"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/** Particles drifting upward between the platforms. */
function Rising() {
  const ref = useRef<THREE.Points>(null);
  const reduced = useReducedMotionSafe();
  const { accent, dark } = usePalette();

  const positions = useMemo(() => {
    const rand = mulberry32(0x1adde7);
    const arr = new Float32Array(220 * 3);
    for (let i = 0; i < 220; i++) {
      arr[i * 3] = (rand() - 0.5) * 7;
      arr[i * 3 + 1] = (rand() - 0.5) * 8;
      arr[i * 3 + 2] = (rand() - 0.5) * 5 - 1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const p = ref.current;
    if (!p || reduced) return;
    const attr = p.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) + delta * 0.32;
      if (y > 4) y = -4;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={accent}
        transparent
        opacity={dark ? 0.6 : 0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** The run between two steps, lit once the upper step has been visited. */
function Riser({
  from,
  to,
  lit,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  lit: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { accent, line } = usePalette();

  const { mid, quat, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    return {
      mid: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      ),
      length: dir.length(),
    };
  }, [from, to]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const mm = m.material as THREE.MeshBasicMaterial;
    mm.color.lerp(new THREE.Color(lit ? accent : line), 0.09);
    mm.opacity += ((lit ? 0.9 : 0.35) - mm.opacity) * 0.1;
  });

  return (
    <mesh ref={mesh} position={mid} quaternion={quat} raycast={() => null}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshBasicMaterial color={line} transparent opacity={0.35} />
    </mesh>
  );
}

export function SeniorityLadder({
  level,
  visited,
  onSelect,
}: {
  level: LevelId;
  visited: LevelId[];
  onSelect: (id: LevelId) => void;
}) {
  const points = useMemo(() => LEVELS.map((l) => new THREE.Vector3(l.x, l.y, 0)), []);

  return (
    <group position={[0, -0.05, 0]}>
      <Rising />

      {points.slice(0, -1).map((p, i) => (
        <Riser
          key={LEVELS[i].id}
          from={p}
          to={points[i + 1]}
          lit={visited.includes(LEVELS[i + 1].id)}
        />
      ))}

      {LEVELS.map((l) => (
        <Platform
          key={l.id}
          x={l.x}
          y={l.y}
          label={l.label}
          active={level === l.id}
          visited={visited.includes(l.id)}
          onSelect={() => onSelect(l.id)}
        />
      ))}
    </group>
  );
}
