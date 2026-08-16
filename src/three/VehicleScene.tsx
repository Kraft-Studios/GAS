import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import { SceneEnvironment, Lighting } from "./Environment";
import { GROUND_Y } from "./VehicleModel";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

/* ==================================================================
   VehicleScene
   ------------------------------------------------------------------
   The mandatory fallback chain lives here, and it is enforced rather
   than hoped for:

     1. WebGL available          -> render the Canvas
     2. Canvas throws at runtime -> ErrorBoundary swaps in the image
     3. No WebGL at all          -> image fallback, never a dead canvas
     4. Image missing            -> gradient, so there is always ground

   A <canvas> that fails silently is worse than no canvas, so every
   rung either renders something real or hands off to the next.
   ================================================================== */

type Props = {
  children: ReactNode;
  /* Rung 2: shown if WebGL is unavailable or the scene throws. */
  fallbackImage?: string;
  fallbackAlt?: string;
  className?: string;
  /* Contact shadow under the vehicle. Off for detached scenes. */
  ground?: boolean;
  /* Passed to the Canvas camera. */
  fov?: number;
};

/* Cached — creating a throwaway context on every call leaks contexts,
   and browsers cap them at around 16. */
let webglSupport: boolean | null = null;

function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    webglSupport = Boolean(gl);

    /* Release the probe context immediately. */
    if (gl && "getExtension" in gl) {
      (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/* ------------------------------------------------------------------ */

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[GAS] 3D scene failed, falling back to still image:", error.message);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ------------------------------------------------------------------ */

function StillFallback({
  image,
  alt,
}: {
  image?: string;
  alt: string;
}) {
  const [imageBroken, setImageBroken] = useState(false);

  /* Rung 4 — always renders, so the section can never be empty. */
  const gradient = (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 35%, #1E1E1E 0%, #0C0C0C 45%, #050505 100%)",
      }}
    />
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-carbon">
      {gradient}
      {image && !imageBroken && (
        <img
          src={image}
          alt={alt}
          onError={() => setImageBroken(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function VehicleScene({
  children,
  fallbackImage,
  fallbackAlt = "GAS Automotive feature vehicle",
  className = "",
  ground = true,
  fov = 35,
}: Props) {
  const perf = useDevicePerformance();
  const [supported, setSupported] = useState<boolean | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  /* Latches true the first time the scene is approached, and stays
     true — remounting the Canvas on every pass would rebuild the
     environment map and thrash GPU memory. */
  const [everSeen, setEverSeen] = useState(false);

  /* Probed after mount so the first paint is never blocked on it. */
  useEffect(() => setSupported(hasWebGL()), []);

  /* The page carries three of these scenes. Left alone, all three would
     run their render loop forever, including the two nobody is looking
     at — three WebGL contexts competing for the same GPU.

     Suspending the loop when a scene is off-screen is the single
     largest performance win on this page. The canvas keeps its last
     frame, so nothing visibly changes. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) setEverSeen(true);
      },
      /* Start rendering slightly before it scrolls in, so the scene is
         already moving by the time it is actually visible. */
      { rootMargin: "200px 0px" }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [supported]);

  const fallback = useMemo(
    () => <StillFallback image={fallbackImage} alt={fallbackAlt} />,
    [fallbackImage, fallbackAlt]
  );

  /* Still probing, unsupported, or not yet approached: show the still.
     Deferring the Canvas until first approach means a page carrying
     three scenes only ever holds the WebGL contexts it has actually
     needed — browsers cap those at around 16, and each one costs real
     GPU memory whether it is drawing or not. */
  if (supported === null || supported === false || !everSeen) {
    return (
      <div ref={hostRef} className={`relative ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={hostRef} className={`relative ${className}`}>
      <SceneErrorBoundary fallback={fallback}>
        <Canvas
          frameloop={onScreen ? "always" : "never"}
          dpr={perf.dpr}
          shadows={perf.shadows}
          camera={{ position: [5.3, 1.7, 6.8], fov, near: 0.1, far: 100 }}
          gl={{
            antialias: perf.antialias,
            alpha: true,
            powerPreference: "high-performance",
            /* Keeps highlights from clipping to flat white on the
               bodywork, which is most of what this scene is. */
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          /* Three r152+ defaults to sRGB already; stated for clarity. */
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <Suspense fallback={null}>
            <SceneEnvironment />
            <Lighting />
            {children}

            {ground && (
              <ContactShadows
                position={[0, GROUND_Y, 0]}
                opacity={0.65}
                scale={14}
                blur={2.6}
                far={4}
                resolution={perf.tier === "high" ? 512 : 256}
                color="#000000"
                frames={perf.tier === "low" ? 1 : Infinity}
              />
            )}

            <Preload all />
          </Suspense>

          {/* Drops resolution automatically if the frame budget slips. */}
          <AdaptiveDpr pixelated />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
