import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Hotspot } from "@/data/vehicles";

/* ==================================================================
   VehicleHotspots
   ------------------------------------------------------------------
   Markers pinned to points in the model's local space, so they travel
   with whatever vehicle is loaded.

   Each marker is a real DOM button via drei's <Html>, not a canvas
   sprite — which means it is focusable, reachable by keyboard, and
   announces itself to a screen reader. That is the whole reason for
   the extra cost.
   ================================================================== */

type Props = {
  hotspots: Hotspot[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  /* Hidden while the hero camera is flying, shown in exploration. */
  visible?: boolean;
};

export function VehicleHotspots({
  hotspots,
  activeId,
  onSelect,
  visible = true,
}: Props) {
  if (!visible) return null;

  return (
    <group>
      {hotspots.map((h) => (
        <Marker
          key={h.id}
          hotspot={h}
          active={activeId === h.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function Marker({
  hotspot,
  active,
  onSelect,
}: {
  hotspot: Hotspot;
  active: boolean;
  onSelect: (id: string | null) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);

  /* A slow pulse on the idle ring. Driven in useFrame rather than CSS
     so it stays in sync with the render loop when the tab throttles. */
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = clock.getElapsedTime();
    const s = active ? 1.35 : 1 + Math.sin(t * 2 + hotspot.position[0]) * 0.12;
    ring.current.scale.setScalar(s);
  });

  return (
    <group position={hotspot.position}>
      {/* The 3D ring — billboarded toward the camera by <Html>'s sibling
          transform is not needed here; a small sphere reads fine. */}
      <mesh ref={ring}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial
          color={active ? "#FFFFFF" : "#F2F0EB"}
          transparent
          opacity={active ? 1 : 0.65}
          toneMapped={false}
        />
      </mesh>

      <Html
        center
        distanceFactor={8}
        zIndexRange={[20, 0]}
        /* occlude="blending" would hide markers behind bodywork, but it
           also hides them from the accessibility tree. Kept visible. */
        style={{ pointerEvents: "auto" }}
      >
        <button
          type="button"
          aria-pressed={active}
          aria-label={`${hotspot.title}. ${hotspot.spec}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(active ? null : hotspot.id);
          }}
          data-cursor="explore"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ease-expo ${
            active
              ? "scale-110 border-bone bg-bone/90"
              : "border-bone/40 bg-black/30 backdrop-blur-sm hover:border-bone hover:bg-black/60"
          }`}
        >
          <span
            className={`block h-1.5 w-1.5 rounded-full transition-colors ${
              active ? "bg-black" : "bg-bone"
            }`}
          />
        </button>
      </Html>
    </group>
  );
}
