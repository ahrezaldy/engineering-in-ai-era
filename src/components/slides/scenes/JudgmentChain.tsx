"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";
import { mulberry32 } from "@/lib/rng";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/** The source's mental model, note F3. `side` decides who owns that step. */
export const CHAIN = [
  { id: "ai", short: "AI", full: "AI", side: "ai" },
  { id: "generate", short: "Generate", full: "Generate possibilities", side: "ai" },
  { id: "engineer", short: "Engineer", full: "Engineer", side: "human" },
  { id: "evaluate", short: "Evaluate", full: "Evaluate", side: "human" },
  { id: "decide", short: "Decide", full: "Decide", side: "human" },
  { id: "validate", short: "Validate", full: "Validate", side: "human" },
  { id: "own", short: "Own it", full: "Own the outcome", side: "human" },
] as const;

export const GENERATE_STEP = 1;
export const EVALUATE_STEP = 3;
export const DECIDE_STEP = 4;
export const OWN_STEP = 6;

const SHARDS = 44;

/** Nodes sit on a gentle arc that rises and comes forward through the middle. */
function chainPositions() {
  return CHAIN.map((_, i) => {
    const t = i / (CHAIN.length - 1);
    // Kept inside the corridor between the question rail and the right-hand panel.
    return new THREE.Vector3(
      -2.3 + t * 4.6,
      Math.sin(t * Math.PI) * 0.6 - 0.2,
      -1.2 + Math.sin(t * Math.PI) * 1.0,
    );
  });
}

function Node({
  position,
  index,
  short,
  stage,
  isAi,
  onSelect,
}: {
  position: THREE.Vector3;
  index: number;
  short: string;
  stage: number;
  isAi: boolean;
  onSelect: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const hover = useRef(false);
  const reduced = useReducedMotionSafe();
  const { accent, warn, muted, dark } = usePalette();

  const reached = stage >= index;
  const active = stage === index;
  const isFinal = index === OWN_STEP;
  const tint = isAi ? warn : accent;

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (m) {
      const base = isFinal ? 1.15 : 1;
      const target = (reached ? base : base * 0.5) * (active ? 1.35 : hover.current ? 1.15 : 1);
      m.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
      if (!reduced) {
        m.rotation.y += 0.004;
        m.position.y = position.y + Math.sin(clock.elapsedTime * 0.8 + index) * 0.04;
      }
    }
    const mm = mat.current;
    if (mm) {
      const want = active
        ? dark
          ? 1.5
          : 0.6
        : reached
          ? dark
            ? 0.8
            : 0.3
          : dark
            ? 0.12
            : 0.04;
      mm.emissiveIntensity += (want - mm.emissiveIntensity) * 0.12;
      mm.opacity += ((reached ? 1 : 0.35) - mm.opacity) * 0.12;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
      >
        <icosahedronGeometry args={[0.24, isFinal ? 1 : 0]} />
        <meshStandardMaterial
          ref={mat}
          color={tint}
          emissive={tint}
          emissiveIntensity={0.1}
          roughness={0.22}
          metalness={0.45}
          transparent
          opacity={0.35}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, index % 2 === 0 ? -0.58 : 0.58, 0.55]}
        fontSize={0.145}
        color={active ? tint : reached ? muted : dark ? "#3f3f46" : "#d4d4d8"}
        anchorX="center"
        anchorY="middle"
      >
        {short}
      </Text>
      {isFinal ? (
        <pointLight
          color={accent}
          intensity={stage >= OWN_STEP ? (dark ? 4 : 1.8) : 0}
          distance={3}
        />
      ) : null}
    </group>
  );
}

function Edge({
  from,
  to,
  drawn,
  isAi,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  drawn: boolean;
  isAi: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { accent, warn, line } = usePalette();

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
    m.scale.y += ((drawn ? 1 : 0.001) - m.scale.y) * 0.16;
    const mm = m.material as THREE.MeshBasicMaterial;
    mm.color.lerp(new THREE.Color(drawn ? (isAi ? warn : accent) : line), 0.1);
  });

  return (
    <mesh ref={mesh} position={mid} quaternion={quat} scale={[1, 0.001, 1]} raycast={() => null}>
      <cylinderGeometry args={[0.014, 0.014, length, 8]} />
      <meshBasicMaterial color={line} transparent opacity={0.85} />
    </mesh>
  );
}

/**
 * The possibilities AI hands over: they spray out of "Generate", hang there while the
 * engineer works, then collapse into one at "Decide". That collapse is the slide's point.
 */
function Possibilities({ stage, positions }: { stage: number; positions: THREE.Vector3[] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const spread = useRef(0);
  const collapse = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const reduced = useReducedMotionSafe();
  const { warn, accent, dark } = usePalette();

  const seeds = useMemo(() => {
    const rand = mulberry32(0xf3c4a1);
    return Array.from({ length: SHARDS }, () => {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      return {
        dir: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta) * 0.55,
          Math.cos(phi) * 0.7,
        ),
        dist: 0.5 + rand() * 1.05,
        phase: rand() * Math.PI * 2,
        size: 0.05 + rand() * 0.05,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;

    const wantSpread = stage >= GENERATE_STEP ? 1 : 0;
    const wantCollapse = stage >= DECIDE_STEP ? 1 : 0;
    const k = reduced ? 1 : 0.055;
    spread.current += (wantSpread - spread.current) * k;
    collapse.current += (wantCollapse - collapse.current) * k;

    const origin = positions[GENERATE_STEP];
    const sink = positions[DECIDE_STEP];

    for (let i = 0; i < SHARDS; i++) {
      const s = seeds[i];
      const drift = reduced ? 0 : Math.sin(clock.elapsedTime * 0.7 + s.phase) * 0.06;
      const out = s.dist * spread.current;

      const x = origin.x + s.dir.x * out;
      const y = origin.y + s.dir.y * out + drift;
      const z = origin.z + s.dir.z * out;

      dummy.position.set(
        x + (sink.x - x) * collapse.current,
        y + (sink.y - y) * collapse.current,
        z + (sink.z - z) * collapse.current,
      );
      const scale = s.size * spread.current * (1 - collapse.current * 0.92);
      dummy.scale.setScalar(Math.max(scale, 0.0001));
      dummy.rotation.set(s.phase, s.phase * 1.7 + clock.elapsedTime * (reduced ? 0 : 0.3), 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

    const mm = m.material as THREE.MeshStandardMaterial;
    mm.color.lerp(new THREE.Color(collapse.current > 0.5 ? accent : warn), 0.08);
    mm.emissive.lerp(new THREE.Color(collapse.current > 0.5 ? accent : warn), 0.08);
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, SHARDS]}
      frustumCulled={false}
      raycast={() => null}
    >
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={warn}
        emissive={warn}
        emissiveIntensity={dark ? 1.2 : 0.35}
        roughness={0.3}
        metalness={0.3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

export function JudgmentChain({
  stage,
  onSelect,
}: {
  stage: number;
  onSelect: (i: number) => void;
}) {
  const positions = useMemo(() => chainPositions(), []);
  const { dark } = usePalette();

  return (
    <group position={[-0.35, 0.15, 0]}>
      <fog attach="fog" args={[dark ? "#0a0a0b" : "#fafaf9", 8, 20]} />

      {positions.slice(0, -1).map((p, i) => (
        <Edge
          key={i}
          from={p}
          to={positions[i + 1]}
          drawn={stage > i}
          isAi={CHAIN[i + 1].side === "ai"}
        />
      ))}

      <Possibilities stage={stage} positions={positions} />

      {CHAIN.map((n, i) => (
        <Node
          key={n.id}
          position={positions[i]}
          index={i}
          short={n.short}
          stage={stage}
          isAi={n.side === "ai"}
          onSelect={() => onSelect(i)}
        />
      ))}
    </group>
  );
}
