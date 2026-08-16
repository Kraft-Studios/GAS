import { Suspense, useEffect, useMemo, useState } from "react";
import { useGLTF, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { HERO_MODEL_PATH } from "@/lib/constants";

/* ==================================================================
   VehicleModel — the swap point.
   ------------------------------------------------------------------
   Rung 1 of the fallback chain: a real GLB if one exists at `src`.
   Rung 2: the procedural stand-in below.

   No GLB ships with this repo, so the stand-in is what renders today.
   Drop a model at /public/models/gas-hero-car.glb and it takes over on
   the next load with no code change.

   The availability probe matters: mounting useGLTF against a missing
   file throws inside Suspense and floods the console on every render.
   A single HEAD request up front avoids that entirely.
   ================================================================== */

/* Bottom of the tyres. Exported so ContactShadows and any ground plane
   sit exactly on it rather than being eyeballed. */
export const GROUND_Y = -0.45;

type Props = {
  src?: string;
  scale?: number;
  finish?: VehicleFinish;
};

type ModelState = "checking" | "available" | "missing";

function useModelAvailable(path: string): ModelState {
  const [state, setState] = useState<ModelState>("checking");

  useEffect(() => {
    let cancelled = false;

    fetch(path, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;
        /* A dev server with SPA fallback answers 200 with index.html for
           missing files, so the content type has to be checked too. */
        const type = res.headers.get("content-type") ?? "";
        const isModel =
          res.ok && !type.includes("text/html") && !type.includes("application/json");
        setState(isModel ? "available" : "missing");
      })
      .catch(() => {
        if (!cancelled) setState("missing");
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

export function VehicleModel({ src = HERO_MODEL_PATH, scale = 1, finish }: Props) {
  const state = useModelAvailable(src);

  if (state === "available") {
    return (
      <Suspense fallback={<ProceduralVehicle scale={scale} finish={finish} />}>
        <LoadedVehicle src={src} scale={scale} />
      </Suspense>
    );
  }

  return <ProceduralVehicle scale={scale} finish={finish} />;
}

/* ------------------------------------------------------------------ */

function LoadedVehicle({ src, scale }: { src: string; scale: number }) {
  const { scene } = useGLTF(src);

  /* Clone so the same GLB can appear in the hero and the exploration
     scene at once without them fighting over one object graph. */
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [model]);

  /* Dispose geometry and materials belonging to the clone on unmount.
     The cached original is left alone — drei still owns it. */
  useEffect(() => {
    return () => {
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
    };
  }, [model]);

  return <primitive object={model} scale={scale} />;
}

/* ==================================================================
   ProceduralVehicle
   ------------------------------------------------------------------
   A stylised coupe built from primitives — deliberately abstract rather
   than a bad replica of a real car. It exists so the camera rig,
   lighting, hotspots and configurator are all genuinely live and
   testable before a real model arrives.

   Proportions matter more than detail at this scale. The silhouette is
   built to a real coupe's ratio — roughly 4.6 long by 1.35 tall, about
   3.4:1 — because that ratio is what the eye actually reads as "car".
   The nose and boot volumes sit BELOW the cabin roofline so the profile
   is a wedge rather than a stack of boxes.
   ================================================================== */

export type VehicleFinish = {
  bodyColor: string;
  wheelColor: string;
  brakeColor: string;
  /* Negative drops the body toward the ground. */
  rideHeight: number;
};

export const DEFAULT_FINISH: VehicleFinish = {
  bodyColor: "#E8E6E1",
  wheelColor: "#8A8A8A",
  brakeColor: "#3A3A3A",
  rideHeight: 0,
};

const WHEEL_R = 0.4;
const WHEEL_Y = -0.05;
const AXLE_Z = 1.5;
const TRACK_X = 0.95;

export function ProceduralVehicle({
  scale = 1,
  finish = DEFAULT_FINISH,
}: {
  scale?: number;
  finish?: VehicleFinish;
}) {
  const f = finish ?? DEFAULT_FINISH;

  /* Materials are memoised and disposed explicitly — creating them in
     render leaks a GPU program per frame on configurator changes. */
  const materials = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: f.bodyColor,
      metalness: 0.35,
      /* Rougher than a showroom finish on purpose — a mirror-smooth
         clearcoat blows out to flat white under this key and loses the
         surface transitions that make the shape readable. */
      roughness: 0.38,
      clearcoat: 0.65,
      clearcoatRoughness: 0.14,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#080808",
      metalness: 0.25,
      roughness: 0.05,
      transparent: true,
      opacity: 0.88,
    });
    const trim = new THREE.MeshStandardMaterial({
      color: "#131313",
      metalness: 0.65,
      roughness: 0.42,
    });
    const tyre = new THREE.MeshStandardMaterial({
      color: "#0B0B0B",
      metalness: 0,
      roughness: 0.95,
    });
    /* Not fully metallic. A metalness-1 surface has no diffuse response,
       so in a dark environment it reflects almost nothing and the wheel
       reads as a hole punched through the bodywork. Backing off lets it
       catch the key light and hold its shape. */
    const rim = new THREE.MeshStandardMaterial({
      color: f.wheelColor,
      metalness: 0.55,
      roughness: 0.3,
    });
    const brake = new THREE.MeshStandardMaterial({
      color: f.brakeColor,
      metalness: 0.75,
      roughness: 0.38,
    });
    const lamp = new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      emissive: "#FFFFFF",
      emissiveIntensity: 3,
      toneMapped: false,
    });
    const tail = new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      emissive: "#FFFFFF",
      emissiveIntensity: 1.4,
      toneMapped: false,
    });
    return { body, glass, trim, tyre, rim, brake, lamp, tail };
  }, [f.bodyColor, f.wheelColor, f.brakeColor]);

  useEffect(() => {
    return () => Object.values(materials).forEach((m) => m.dispose());
  }, [materials]);

  return (
    <group scale={scale} position={[0, f.rideHeight, 0]}>
      {/* ============ main volume — long, low, wide ============ */}
      <RoundedBox
        args={[2.0, 0.78, 4.5]}
        radius={0.26}
        smoothness={4}
        material={materials.body}
        position={[0, 0.06, 0]}
        castShadow
        receiveShadow
      />

      {/* Nose. Only slightly below the body's shoulder — drop it much
          further and the profile reads as a flatbed rather than a wedge. */}
      <RoundedBox
        args={[1.9, 0.62, 1.0]}
        radius={0.22}
        smoothness={4}
        material={materials.body}
        position={[0, 0.02, 2.15]}
        castShadow
      />

      {/* boot deck, matched to the nose so the car is symmetrical in profile */}
      <RoundedBox
        args={[1.92, 0.66, 0.85]}
        radius={0.22}
        smoothness={4}
        material={materials.body}
        position={[0, 0.05, -2.1]}
        castShadow
      />

      {/* ============ cabin — low, and only just behind centre ============ */}
      {/* Sunk well into the main volume and nearly as wide, so it reads
          as a roofline rising out of the body rather than a box set on
          top of it. */}
      <RoundedBox
        args={[1.74, 0.52, 2.2]}
        radius={0.26}
        smoothness={4}
        material={materials.body}
        position={[0, 0.5, -0.15]}
        castShadow
      />
      {/* glazing band, inset just proud of the cabin shell */}
      <RoundedBox
        args={[1.78, 0.26, 1.98]}
        radius={0.12}
        smoothness={3}
        material={materials.glass}
        position={[0, 0.58, -0.13]}
      />

      {/* ============ arch flares — hide the wheel/body join ============ */}
      {(
        [
          [TRACK_X, AXLE_Z],
          [-TRACK_X, AXLE_Z],
          [TRACK_X, -AXLE_Z],
          [-TRACK_X, -AXLE_Z],
        ] as const
      ).map(([x, z]) => (
        <RoundedBox
          key={`arch-${x}-${z}`}
          args={[0.1, 0.34, 1.0]}
          radius={0.05}
          smoothness={3}
          material={materials.body}
          position={[x * 1.0, 0.06, z]}
          castShadow
        />
      ))}

      {/* ============ aero ============ */}
      {/* Tucked under the nose and tail rather than protruding — a
          splitter that sticks out past the bodywork reads as a stray
          plane floating in space at this level of abstraction. */}
      <mesh material={materials.trim} position={[0, -0.28, 2.45]} castShadow>
        <boxGeometry args={[1.9, 0.07, 0.3]} />
      </mesh>
      <mesh material={materials.trim} position={[0, -0.26, -2.36]} castShadow>
        <boxGeometry args={[1.84, 0.1, 0.3]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={`skirt-${s}`}
          material={materials.trim}
          position={[s * 1.0, -0.24, 0]}
          castShadow
        >
          <boxGeometry args={[0.07, 0.14, 2.7]} />
        </mesh>
      ))}
      {/* ducktail, level with the boot deck */}
      <mesh material={materials.trim} position={[0, 0.36, -2.44]} castShadow>
        <boxGeometry args={[1.74, 0.08, 0.26]} />
      </mesh>

      {/* ============ lighting units ============ */}
      {[-1, 1].map((s) => (
        <mesh
          key={`head-${s}`}
          material={materials.lamp}
          position={[s * 0.62, 0.14, 2.65]}
        >
          <boxGeometry args={[0.52, 0.08, 0.05]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh
          key={`tail-${s}`}
          material={materials.tail}
          position={[s * 0.66, 0.24, -2.53]}
        >
          <boxGeometry args={[0.46, 0.07, 0.05]} />
        </mesh>
      ))}

      {/* ============ quad exhaust ============ */}
      {[-0.62, -0.4, 0.4, 0.62].map((x) => (
        <mesh
          key={`pipe-${x}`}
          material={materials.trim}
          position={[x, -0.28, -2.56]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.065, 0.065, 0.16, 16]} />
        </mesh>
      ))}

      {/* ============ wheels ============ */}
      {(
        [
          [TRACK_X, AXLE_Z],
          [-TRACK_X, AXLE_Z],
          [TRACK_X, -AXLE_Z],
          [-TRACK_X, -AXLE_Z],
        ] as const
      ).map(([x, z]) => (
        <group
          key={`wheel-${x}-${z}`}
          position={[x, WHEEL_Y, z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh material={materials.tyre} castShadow>
            <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.32, 32]} />
          </mesh>
          {/* rim face, pushed to the outboard side */}
          <mesh material={materials.rim} position={[x > 0 ? -0.03 : 0.03, 0, 0]}>
            <cylinderGeometry args={[0.29, 0.29, 0.3, 24]} />
          </mesh>
          {/* brake disc, tucked inboard of the rim */}
          <mesh material={materials.brake} position={[x > 0 ? 0.11 : -0.11, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.05, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* Only call once a model actually exists — preloading a missing path
   produces the console noise the availability probe exists to avoid. */
export function preloadVehicle(src: string = HERO_MODEL_PATH) {
  useGLTF.preload(src);
}
