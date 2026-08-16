import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { smoothstep } from "@/lib/utils";

/* ==================================================================
   CameraRig — scroll drives a camera move around the vehicle.
   ------------------------------------------------------------------
   Two things keep this from feeling like a slideshow:

   1. Keyframes are interpolated with smoothstep rather than linearly,
      so the camera eases through each waypoint instead of changing
      direction on a corner.

   2. The result is then critically damped toward, per frame, using
      THREE.MathUtils.damp — framerate-independent, so it behaves the
      same on a 60Hz laptop and a 144Hz monitor. That damping is what
      reads as camera weight: it arrives slightly after you stop
      scrolling, the way a real crane does.

   The rig never re-renders React. It reads a MotionValue in useFrame
   and mutates the camera directly.
   ================================================================== */

export type CameraKeyframe = {
  /* Scroll progress, 0 to 1. */
  at: number;
  position: [number, number, number];
  lookAt: [number, number, number];
};

/* The hero move, matching the beats in the brief. */
export const HERO_KEYFRAMES: CameraKeyframe[] = [
  /* 0% — front three-quarter, the establishing shot */
  { at: 0.0, position: [5.3, 1.7, 6.8], lookAt: [0, 0.15, 0] },
  /* 20% — the orbit begins, camera drops and swings wide */
  { at: 0.2, position: [6.0, 0.95, 2.0], lookAt: [0, 0.15, 0] },
  /* 40% — down to axle height on the front wheel */
  { at: 0.4, position: [2.9, 0.05, 2.1], lookAt: [1.02, -0.02, 1.45] },
  /* 55% — headlight, close enough to see the emissive bar */
  { at: 0.55, position: [1.95, 0.3, 3.9], lookAt: [0.62, 0.12, 2.58] },
  /* 70% — bodywork pass, raking along the flank */
  { at: 0.7, position: [4.3, 0.5, -0.6], lookAt: [0, 0.28, 0.4] },
  /* 85% — rear three-quarter */
  { at: 0.85, position: [1.9, 0.9, -5.6], lookAt: [0, 0.2, -1.8] },
  /* 100% — pull back and up, handing off to the next section */
  { at: 1.0, position: [0, 2.9, -9.4], lookAt: [0, 0.1, -1.0] },
];

/* Scratch vectors, allocated once. Allocating inside useFrame would
   churn the GC 60 times a second. */
const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();
const _posA = new THREE.Vector3();
const _posB = new THREE.Vector3();
const _tgtA = new THREE.Vector3();
const _tgtB = new THREE.Vector3();

function sampleKeyframes(
  keyframes: CameraKeyframe[],
  t: number,
  outPos: THREE.Vector3,
  outTarget: THREE.Vector3
) {
  const p = THREE.MathUtils.clamp(t, 0, 1);

  /* Before the first / after the last waypoint, clamp rather than
     extrapolate — extrapolation sends the camera through the floor. */
  if (p <= keyframes[0].at) {
    outPos.fromArray(keyframes[0].position);
    outTarget.fromArray(keyframes[0].lookAt);
    return;
  }
  const last = keyframes[keyframes.length - 1];
  if (p >= last.at) {
    outPos.fromArray(last.position);
    outTarget.fromArray(last.lookAt);
    return;
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (p >= a.at && p <= b.at) {
      const span = b.at - a.at;
      const local = span === 0 ? 0 : (p - a.at) / span;
      const eased = smoothstep(local);

      _posA.fromArray(a.position);
      _posB.fromArray(b.position);
      _tgtA.fromArray(a.lookAt);
      _tgtB.fromArray(b.lookAt);

      outPos.copy(_posA).lerp(_posB, eased);
      outTarget.copy(_tgtA).lerp(_tgtB, eased);
      return;
    }
  }
}

type Props = {
  /* Scroll progress driving the move. */
  progress: MotionValue<number>;
  keyframes?: CameraKeyframe[];
  /* When set, the rig flies here instead — used by hotspots. */
  override?: { position: [number, number, number]; lookAt: [number, number, number] } | null;
  /* Higher is snappier. Lower gives the camera more mass. */
  damping?: number;
  /* When false the camera snaps straight to the sampled pose. Used for
     reduced-motion and the lowest performance tier. */
  smooth?: boolean;
};

export function CameraRig({
  progress,
  keyframes = HERO_KEYFRAMES,
  override = null,
  damping = 3.2,
  smooth = true,
}: Props) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0.1, 0));

  useFrame((_, delta) => {
    /* Clamp delta so an alt-tab of several seconds doesn't teleport the
       camera when the tab regains focus. */
    const dt = Math.min(delta, 0.1);

    if (override) {
      _pos.fromArray(override.position);
      _target.fromArray(override.lookAt);
    } else {
      sampleKeyframes(keyframes, progress.get(), _pos, _target);
    }

    if (smooth) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _pos.x, damping, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _pos.y, damping, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _pos.z, damping, dt);

      currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, _target.x, damping, dt);
      currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, _target.y, damping, dt);
      currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, _target.z, damping, dt);
    } else {
      camera.position.copy(_pos);
      currentTarget.current.copy(_target);
    }

    camera.lookAt(currentTarget.current);
  });

  return null;
}
