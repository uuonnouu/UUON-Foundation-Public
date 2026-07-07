import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import ParametricSurface from "./ParametricSurface";
import InteractiveControls from "./InteractiveControls";
import { SurfaceParameters, VisualizationMode } from "../../../shared/schema";
import * as THREE from "three";

interface Scene3DProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  brightness?: number;
  staticMode?: boolean;
  onSceneReady?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;
}

function SceneCapture({ onSceneReady }: { onSceneReady?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void }) {
  const { scene, camera, gl } = useThree();
  const firedRef = useRef(false);
  useEffect(() => {
    if (onSceneReady && scene && camera && gl && !firedRef.current) {
      firedRef.current = true;
      onSceneReady(scene, camera, gl);
    }
  }, [scene, camera, gl, onSceneReady]);
  return null;
}

function Lights({ brightness = 0.5 }: { brightness?: number }) {
  const ambientIntensity = 0.5 + brightness * 1.5;
  const directionalIntensity = 0.8 + brightness * 2.0;
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={directionalIntensity} />
      <directionalLight position={[-10, -10, -5]} intensity={directionalIntensity * 0.4} />
      <pointLight position={[10, -10, 5]} intensity={brightness * 1.5} color="#00ffff" />
      <pointLight position={[-10, 10, -5]} intensity={brightness * 1.2} color="#ff00ff" />
    </>
  );
}

export default function Scene3D({ parameters, visualMode, colorMode, brightness = 0.5, staticMode = false, onSceneReady }: Scene3DProps) {
  const bgColor = '#0a0a1a';
  const lightBrightness = brightness !== undefined ? brightness : 0.5;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, []);

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      camera={{
        position: [6, 6, 6],
        fov: 50,
        near: 0.1,
        far: 1000
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true,
        depth: true,
        stencil: false,
        alpha: false,
      }}
      onCreated={handleCreated}
      style={{
        background: bgColor,
        width: '100%',
        height: '100%'
      }}
    >
      <color attach="background" args={[bgColor]} />

      <Lights brightness={lightBrightness} />
      <SceneCapture onSceneReady={onSceneReady} />

      <Suspense fallback={
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#00ff00" wireframe />
        </mesh>
      }>
        <InteractiveControls
          enablePivoting={false}
          enableRotation={false}
          enableScaling={false}
          onTransformChange={() => {}}
          onReset={() => {}}
        >
          <ParametricSurface
            parameters={parameters as any}
            visualMode={visualMode}
            colorMode={colorMode}
          />
        </InteractiveControls>

        <Grid
          args={[40, 40]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#333333"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#555555"
          fadeDistance={100}
          infiniteGrid={true}
          name="reference_grid_exclude"
        />
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={500}
        target={[0, 0, 0]}
        enableDamping={true}
        dampingFactor={0.05}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        autoRotate={false}
        zoomSpeed={1.0}
        panSpeed={1.0}
        rotateSpeed={-1.0}
        screenSpacePanning={true}
        mouseButtons={{
          LEFT: 0,
          MIDDLE: 1,
          RIGHT: 2
        }}
      />
    </Canvas>
  );
}
