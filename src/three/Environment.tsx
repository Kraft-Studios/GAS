import { Environment as DreiEnvironment, Lightformer } from "@react-three/drei";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

/* ------------------------------------------------------------------
   Environment + Lighting
   ------------------------------------------------------------------
   Deliberately NOT using drei's `preset="warehouse"` etc. Those fetch a
   multi-megabyte HDRI from a CDN at runtime — a network dependency that
   fails offline and blocks first paint of the hero.

   Instead the environment is built from Lightformers: emissive planes
   rendered into a small cube map locally. Zero network, ~2ms to build,
   and it gives the long horizontal highlight down the flank that makes
   automotive bodywork read as bodywork.
   ------------------------------------------------------------------ */

export function SceneEnvironment() {
  const perf = useDevicePerformance();

  return (
    <DreiEnvironment resolution={perf.envResolution} frames={1}>
      {/* Studio ceiling — the broad soft source above the car. */}
      <Lightformer
        intensity={0.9}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />

      {/* The key strip light. This is the one that draws the long
          reflection along the shoulder line as the camera orbits. */}
      <Lightformer
        form="rect"
        intensity={3}
        rotation-y={Math.PI / 2}
        position={[-6, 1.5, 0]}
        scale={[16, 2.2, 1]}
      />

      {/* Opposite side, weaker — separates the far edge from the void. */}
      <Lightformer
        form="rect"
        intensity={2.4}
        rotation-y={-Math.PI / 2}
        position={[6, 1.2, 0]}
        scale={[16, 1.6, 1]}
      />

      {/* Rear rim. Gives the silhouette its edge when the camera swings
          behind the car at ~85% of the hero scroll. */}
      <Lightformer
        form="ring"
        intensity={3.5}
        position={[0, 2, -8]}
        scale={[6, 6, 1]}
      />

      {/* Cool floor bounce, kept dim so the car sits in darkness. */}
      <Lightformer
        intensity={0.35}
        rotation-x={-Math.PI / 2}
        position={[0, -3, 0]}
        scale={[14, 14, 1]}
      />
    </DreiEnvironment>
  );
}

export function Lighting() {
  const perf = useDevicePerformance();

  return (
    <>
      {/* Very low ambient — the environment map does the real work. */}
      <ambientLight intensity={0.18} />

      {/* Key. Only this one casts, and only on the high tier. */}
      <directionalLight
        position={[5, 8, 4]}
        intensity={0.85}
        castShadow={perf.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />

      {/* Fill from the opposite quarter, no shadow. */}
      <directionalLight position={[-6, 3, -4]} intensity={0.35} />

      {/* Tight underlight so the sills don't vanish into the background. */}
      <pointLight position={[0, -1.5, 2]} intensity={2.5} distance={8} decay={2} />
    </>
  );
}
