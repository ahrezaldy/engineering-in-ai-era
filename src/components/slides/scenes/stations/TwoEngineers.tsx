"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";

const A_STEPS = 5;
const B_STEPS = 10;
const LANE_LEFT = -4.1;
const LANE_LEN = 8.2;
const A_Y = 1.15;
const B_Y = -1.15;

/** One per step Approach A skipped, named so the shapes are not a guessing game. */
const SKIPPED = [
  "what “available” means",
  "existing data sources",
  "performance",
  "edge cases",
  "future consumers",
];

/**
 * One branching track. A's lane picks up debris for every step of B's that it skipped;
 * B's lane stays clean and reaches a lit endpoint.
 */
export function TwoEngineers({ step }: { step: number }) {
  const { accent, warn, fg, dark } = usePalette();

  const aNodes = useMemo(
    () =>
      Array.from(
        { length: A_STEPS },
        (_, i) => new THREE.Vector3(LANE_LEFT + 0.4 + (i * (LANE_LEN - 0.8)) / (A_STEPS - 1), A_Y, 0),
      ),
    [],
  );
  const bNodes = useMemo(
    () =>
      Array.from(
        { length: B_STEPS },
        (_, i) => new THREE.Vector3(LANE_LEFT + 0.4 + (i * (LANE_LEN - 0.8)) / (B_STEPS - 1), B_Y, 0),
      ),
    [],
  );

  const debris = useMemo(
    () =>
      SKIPPED.map((label, i) => ({
        at: A_STEPS + 1 + i,
        label,
        // Spread along the tail of A's lane, resting ON the rail.
        x: LANE_LEFT + 2.2 + i * 1.45,
        z: (i % 2) * 0.55 - 0.28,
      })),
    [],
  );

  return (
    <group>
      <Lane nodes={aNodes} reached={Math.min(step, A_STEPS)} total={A_STEPS} color={warn} label="Approach A" y={A_Y} />
      <Lane nodes={bNodes} reached={Math.min(step, B_STEPS)} total={B_STEPS} color={accent} label="Approach B" y={B_Y} />

      {debris.map((d, i) => (
        <Debris
          key={d.label}
          x={d.x}
          z={d.z}
          label={d.label}
          labelY={i % 2 === 0 ? 0.34 : 0.68}
          visible={step >= d.at}
          color={warn}
        />
      ))}

      {/* B's endpoint lights up only once every step is walked. */}
      <mesh position={[LANE_LEFT + LANE_LEN - 0.1, B_Y, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={step >= B_STEPS ? (dark ? 1.2 : 0.5) : 0.15}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[LANE_LEFT + LANE_LEN - 0.1, B_Y, 0.6]}
        color={accent}
        intensity={step >= B_STEPS ? (dark ? 4 : 1.6) : 0}
        distance={5}
      />

      <Text position={[0, 2.5, 0]} fontSize={0.2} color={fg} anchorX="center">
        Add an API to return available rooms
      </Text>
    </group>
  );
}

function Lane({
  nodes,
  reached,
  total,
  color,
  label,
  y,
}: {
  nodes: THREE.Vector3[];
  reached: number;
  total: number;
  color: string;
  label: string;
  y: number;
}) {
  const fill = useRef<THREE.Group>(null);
  const { dark } = usePalette();

  useFrame(() => {
    const g = fill.current;
    if (!g) return;
    const want = Math.max(reached / total, 0.0001);
    g.scale.x += (want - g.scale.x) * 0.14;
  });

  return (
    <group>
      {/* Unlit rail */}
      <mesh position={[LANE_LEFT + LANE_LEN / 2, y, -0.05]} raycast={() => null}>
        <boxGeometry args={[LANE_LEN, 0.03, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Progress fill. The mesh is offset by half its length inside a group that is
          scaled, so the fill grows from the left end instead of out from the centre. */}
      <group ref={fill} position={[LANE_LEFT, y, -0.04]} scale={[0.0001, 1, 1]}>
        <mesh position={[LANE_LEN / 2, 0, 0]} raycast={() => null}>
          <boxGeometry args={[LANE_LEN, 0.05, 0.05]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={dark ? 1.4 : 0.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {nodes.map((p, i) => (
        <Dot key={i} position={p} on={i < reached} color={color} />
      ))}

      <Text position={[LANE_LEFT - 0.35, y, 0]} fontSize={0.19} color={color} anchorX="right" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function Dot({ position, on, color }: { position: THREE.Vector3; on: boolean; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const { dark } = usePalette();
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const s = on ? 1 : 0.45;
    m.scale.lerp(new THREE.Vector3(s, s, s), 0.14);
  });
  return (
    <mesh ref={ref} position={position} raycast={() => null}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={on ? (dark ? 1.6 : 0.5) : 0.05}
        toneMapped={false}
      />
    </mesh>
  );
}

/** A skipped step, dropped onto Approach A's rail and labelled with what it was. */
function Debris({
  x,
  z,
  label,
  labelY,
  visible,
  color,
}: {
  x: number;
  z: number;
  label: string;
  /** Alternated by the caller so neighbouring captions do not collide. */
  labelY: number;
  visible: boolean;
  color: string;
}) {
  const group = useRef<THREE.Group>(null);
  const shape = useRef<THREE.Mesh>(null);
  const vy = useRef(0);
  const restY = A_Y + 0.2;
  const { dark } = usePalette();

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    if (!visible) {
      g.position.y = restY + 2.6;
      g.scale.setScalar(0.0001);
      vy.current = 0;
      return;
    }

    g.scale.lerp(new THREE.Vector3(1, 1, 1), 0.16);

    // Cheap gravity, landing on the rail rather than hovering above it.
    if (g.position.y > restY) {
      vy.current -= delta * 11;
      g.position.y = Math.max(restY, g.position.y + vy.current * delta);
      if (g.position.y <= restY) vy.current = -vy.current * 0.25;
    }

    const s = shape.current;
    if (s && g.position.y > restY + 0.01) {
      s.rotation.x += delta * 2.2;
      s.rotation.z += delta * 1.4;
    }
  });

  return (
    <group ref={group} position={[x, restY + 2.6, z]} scale={0.0001}>
      <mesh ref={shape}>
        <tetrahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>
      <Text
        position={[0, labelY, 0]}
        fontSize={0.145}
        color={color}
        anchorX="center"
        anchorY="bottom"
        maxWidth={1.5}
        textAlign="center"
        outlineWidth={0.012}
        outlineColor={dark ? "#0a0a0b" : "#fafaf9"}
      >
        {label}
      </Text>
    </group>
  );
}
