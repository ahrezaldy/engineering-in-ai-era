"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";
import { mulberry32 } from "@/lib/rng";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const COLS = 12;
const ROWS = 9;
const COUNT = COLS * ROWS;
const SETTLE_SECONDS = 2.4;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Slabs start scattered and settle into a lattice — "chaos resolving into structure".
 * They then drift gently, repel from the pointer, and take a displacement pulse on click.
 */
export function LatticeField() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { pointer, viewport } = useThree();
  const { accent, fg, dark } = usePalette();
  const reduced = useReducedMotionSafe();

  const pulse = useRef({ x: 0, y: 0, at: -10 });
  const now = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(() => {
    const rand = mulberry32(0x5ee11);
    const out: {
      home: THREE.Vector3;
      start: THREE.Vector3;
      scale: THREE.Vector3;
      phase: number;
      tint: number;
    }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const home = new THREE.Vector3(
        (col - (COLS - 1) / 2) * 0.78,
        (row - (ROWS - 1) / 2) * 0.62,
        (rand() - 0.5) * 0.9,
      );
      out.push({
        home,
        start: new THREE.Vector3(
          (rand() - 0.5) * 22,
          (rand() - 0.5) * 16,
          (rand() - 0.5) * 14 - 3,
        ),
        scale: new THREE.Vector3(
          0.12 + rand() * 0.4,
          0.05 + rand() * 0.1,
          0.05 + rand() * 0.08,
        ),
        phase: rand() * Math.PI * 2,
        tint: rand(),
      });
    }
    return out;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const a = new THREE.Color(accent);
    const f = new THREE.Color(fg);
    const c = new THREE.Color();
    seeds.forEach((s, i) => {
      c.copy(f).lerp(a, 0.25 + s.tint * 0.75);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [seeds, accent, fg]);

  const t0 = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    if (t0.current === null) t0.current = clock.elapsedTime;
    now.current = clock.elapsedTime;

    const elapsed = clock.elapsedTime - t0.current;
    const settle = reduced ? 1 : easeOutExpo(Math.min(elapsed / SETTLE_SECONDS, 1));

    const px = pointer.x * (viewport.width / 2);
    const py = pointer.y * (viewport.height / 2);
    const sincePulse = clock.elapsedTime - pulse.current.at;
    const pulseStrength = sincePulse < 1.6 ? Math.pow(1 - sincePulse / 1.6, 2) * 2.4 : 0;

    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      const x = s.start.x + (s.home.x - s.start.x) * settle;
      const y = s.start.y + (s.home.y - s.start.y) * settle;
      const z = s.start.z + (s.home.z - s.start.z) * settle;

      const drift = reduced ? 0 : Math.sin(clock.elapsedTime * 0.5 + s.phase) * 0.07;

      // Pointer repel, only once the lattice has mostly formed.
      let ox = 0;
      let oy = 0;
      if (!reduced && settle > 0.5) {
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 6.25) {
          const f = (1 - Math.sqrt(d2) / 2.5) * 0.85 * settle;
          ox += dx * f;
          oy += dy * f;
        }
        if (pulseStrength > 0) {
          const qx = x - pulse.current.x;
          const qy = y - pulse.current.y;
          const qd = Math.max(Math.hypot(qx, qy), 0.001);
          const ring = Math.exp(-Math.pow(qd - sincePulse * 5, 2) * 0.6);
          ox += (qx / qd) * ring * pulseStrength;
          oy += (qy / qd) * ring * pulseStrength;
        }
      }

      dummy.position.set(x + ox, y + oy + drift, z);
      dummy.rotation.set(0, 0, (1 - settle) * s.phase);
      dummy.scale.copy(s.scale).multiplyScalar(0.5 + settle * 0.5);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Invisible catcher so a click anywhere in the scene registers a pulse origin. */}
      <mesh
        position={[0, 0, -2]}
        onPointerDown={(e) => {
          pulse.current = { x: e.point.x, y: e.point.y, at: now.current };
        }}
      >
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Offset right and pushed back: the field is a backdrop for the title, not a rival. */}
      <instancedMesh
        ref={mesh}
        position={[3.1, 0, -1.4]}
        args={[undefined, undefined, COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          vertexColors
          roughness={dark ? 0.28 : 0.22}
          metalness={dark ? 0.35 : 0.18}
          emissive={accent}
          emissiveIntensity={dark ? 0.55 : 0.06}
        />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      </instancedMesh>
    </>
  );
}
