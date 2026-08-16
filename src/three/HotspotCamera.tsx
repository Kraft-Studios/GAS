import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Flies the camera to a hotspot and holds it there. Mounted only while
   a hotspot is selected, so it never competes with OrbitControls. */

const _target = new THREE.Vector3();

export function HotspotCamera({
  position,
  lookAt,
  damping = 2.6,
}: {
  position: [number, number, number];
  lookAt: [number, number, number];
  damping?: number;
}) {
  const { camera } = useThree();
  /* Seeded from wherever the camera happens to be when this mounts, so
     the handoff from OrbitControls has no visible jump. */
  const current = useRef(new THREE.Vector3());
  const seeded = useRef(false);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    if (!seeded.current) {
      camera.getWorldDirection(current.current);
      current.current.multiplyScalar(5).add(camera.position);
      seeded.current = true;
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, position[0], damping, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, position[1], damping, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, position[2], damping, dt);

    _target.fromArray(lookAt);
    current.current.x = THREE.MathUtils.damp(current.current.x, _target.x, damping, dt);
    current.current.y = THREE.MathUtils.damp(current.current.y, _target.y, damping, dt);
    current.current.z = THREE.MathUtils.damp(current.current.z, _target.z, damping, dt);

    camera.lookAt(current.current);
  });

  return null;
}
