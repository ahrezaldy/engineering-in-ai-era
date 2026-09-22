"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "@/components/three/SceneKit";

export const BASINS = [
  { id: "cost", label: "Same work,\nless effort", x: -3, z: -1.4 },
  { id: "output", label: "More\noutput", x: 3, z: -1.4 },
  { id: "quality", label: "Better\nengineering", x: -3, z: 1.6 },
  { id: "ambition", label: "Bigger\nambition", x: 3, z: 1.6 },
] as const;

export type BasinId = (typeof BASINS)[number]["id"];

const SEG = 44;
const SIZE_X = 11;
const SIZE_Y = 7;

/**
 * A ground plane that swells under wherever the capacity orb sits. There is no
 * "correct" basin — the terrain only shows what each choice does.
 *
 * The geometry belongs to R3F (declared in JSX) and is only ever touched inside the
 * frame loop; the wireframe overlay copies the deformed positions so the two stay in
 * step without a second deformation pass.
 */
export function CapacityTerrain({
  orb,
  onDrag,
  nearest,
}: {
  orb: THREE.Vector3;
  onDrag: (p: THREE.Vector3) => void;
  nearest: BasinId | null;
}) {
  const { accent, dark, line } = usePalette();
  const surface = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const base = useRef<Float32Array | null>(null);
  const dragging = useRef(false);
  const orbTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const mesh = surface.current;
    if (mesh) {
      const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
      if (!base.current) base.current = Float32Array.from(pos.array);
      const flat = base.current;

      for (let i = 0; i < pos.count; i++) {
        const x = flat[i * 3];
        const y = flat[i * 3 + 1];
        // Plane is rotated flat, so its local y maps to world -z.
        const d = Math.hypot(x - orb.x, y + orb.z);
        const swell = Math.exp(-d * d * 0.16) * 1.5;
        const ripple = Math.sin(clock.elapsedTime * 0.6 + d * 0.9) * 0.04;
        pos.setZ(i, swell + ripple);
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();

      const w = wire.current;
      if (w) {
        const wpos = w.geometry.getAttribute("position") as THREE.BufferAttribute;
        (wpos.array as Float32Array).set(pos.array as Float32Array);
        wpos.needsUpdate = true;
      }
    }

    const o = orbRef.current;
    if (o) {
      orbTarget.set(orb.x, 1.5, orb.z);
      o.position.lerp(orbTarget, 0.18);
      o.rotation.y += 0.01;
    }
  });

  const move = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    onDrag(
      new THREE.Vector3(
        THREE.MathUtils.clamp(e.point.x, -4.4, 4.4),
        0,
        THREE.MathUtils.clamp(e.point.z, -2.6, 2.6),
      ),
    );
  };

  return (
    <group position={[0, -1.4, 0]}>
      <mesh
        ref={surface}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={(e) => {
          dragging.current = true;
          move(e);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
        onPointerMove={move}
      >
        <planeGeometry args={[SIZE_X, SIZE_Y, SEG, SEG]} />
        <meshStandardMaterial
          color={dark ? "#1c1c21" : "#ffffff"}
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>

      <mesh ref={wire} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} raycast={() => null}>
        <planeGeometry args={[SIZE_X, SIZE_Y, SEG, SEG]} />
        <meshBasicMaterial color={line} wireframe transparent opacity={dark ? 0.35 : 0.5} />
      </mesh>

      {/* Labels stand up facing the camera. Painted flat on the terrain they foreshortened
          into illegibility at this camera angle. A ring marks each basin on the ground so
          you can see where the orb has to go. */}
      {BASINS.map((b) => (
        <group key={b.id} position={[b.x, 0, b.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]} raycast={() => null}>
            <ringGeometry args={[0.92, 1.02, 48]} />
            <meshBasicMaterial
              color={nearest === b.id ? accent : dark ? "#52525b" : "#a1a1aa"}
              transparent
              opacity={nearest === b.id ? 1 : 0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Text
            position={[0, 1.05, 0]}
            fontSize={0.32}
            color={nearest === b.id ? accent : dark ? "#a1a1aa" : "#71717a"}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            lineHeight={1.15}
            outlineWidth={0.018}
            outlineColor={dark ? "#0a0a0b" : "#fafaf9"}
          >
            {b.label}
          </Text>
        </group>
      ))}

      {/* Names the basin the orb is actually over, in the scene rather than only in the
          side panel. */}
      <Text
        position={[orb.x, 2.5, orb.z]}
        fontSize={0.3}
        color={accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={dark ? "#0a0a0b" : "#fafaf9"}
      >
        {nearest
          ? (BASINS.find((b) => b.id === nearest)?.label ?? "").replace("\n", " ")
          : "drag me over a basin"}
      </Text>

      <mesh ref={orbRef} position={[orb.x, 1.5, orb.z]} raycast={() => null}>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={dark ? 0.9 : 0.35}
        />
      </mesh>
      <pointLight position={[orb.x, 2.1, orb.z]} color={accent} intensity={dark ? 3.5 : 1.4} distance={7} />
    </group>
  );
}
