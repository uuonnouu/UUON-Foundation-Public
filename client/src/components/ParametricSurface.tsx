import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SurfaceParameters, VisualizationMode } from "../../../shared/schema";
import { generateParametricSurface } from "../lib/surfaceGenerator";
import { applyCenteringTransform } from "../lib/shapeCenteringFixed";


interface ParametricSurfaceProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
}

// Stable color generation to prevent blackout glitches
function generateStableColors(vertices: number[], parameters: SurfaceParameters, colorMode: string): number[] {
  const colors = new Float32Array(vertices.length);
  const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);
  
  for (let i = 0; i < vertices.length; i += 3) {
    const vertex = [vertices[i], vertices[i + 1], vertices[i + 2]];
    const height = vertex[2];
    const distance = Math.sqrt(vertex[0] ** 2 + vertex[1] ** 2);
    
    // Stable color calculation without time-based variations
    const phase = (distance + energy * 0.1) * Math.PI;
    const intensity = Math.sin(phase) * 0.3 + 0.7;
    
    let color: [number, number, number];
    
    if (colorMode.includes("quantum")) {
      const depthFactor = Math.exp(-Math.abs(height) * 0.1);
      const r = (Math.sin(phase * 1.1) * 0.3 + 0.8) * depthFactor;
      const g = (Math.sin(phase * 1.3) * 0.4 + 0.7) * depthFactor;
      const b = (Math.sin(phase * 1.7) * 0.5 + 0.9) * depthFactor;
      
      color = [
        Math.min(1, Math.max(0.2, r * intensity)),
        Math.min(1, Math.max(0.2, g * intensity)),
        Math.min(1, Math.max(0.2, b * intensity))
      ];
    } else {
      // Standard stable colors
      color = [
        Math.sin(phase * 1.1) * 0.5 + 0.5,
        Math.sin(phase * 1.3) * 0.5 + 0.5,
        Math.sin(phase * 1.7) * 0.5 + 0.5
      ].map(c => Math.min(1, Math.max(0.2, c * intensity))) as [number, number, number];
    }
    
    colors[i] = color[0];
    colors[i + 1] = color[1];
    colors[i + 2] = color[2];
  }
  
  return Array.from(colors);
}

// Stable opacity calculation
function getStableOpacity(energy: number, complexity: number): number {
  const baseOpacity = 0.9;
  const energyFactor = Math.min(energy / 1000, 1) * 0.08;
  const complexityFactor = Math.min(complexity / 20000, 1) * 0.03;
  
  return Math.max(0.8, Math.min(0.95, baseOpacity - energyFactor + complexityFactor));
}

export default function ParametricSurface({ parameters, visualMode, colorMode }: ParametricSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  
  // Get shape centering configuration
  const centeringTransform = useMemo(() => {
    try {
      return applyCenteringTransform(parameters.type);
    } catch (error) {
      console.warn(`Failed to get centering transform for ${parameters.type}, using defaults:`, error);
      return { position: [0, 0, 0] as [number, number, number], scale: 1, rotation: [0, 0, 0] as [number, number, number] };
    }
  }, [parameters.type]);
  
  const { geometry, material } = useMemo(() => {
    const surfaceData = generateParametricSurface(parameters);
    
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(surfaceData.indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(surfaceData.vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(surfaceData.normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(surfaceData.uvs, 2));
    geometry.computeVertexNormals();

    // Get neon color
    let neonColor = 0x00ff88; // Default neon green
    if (colorMode === "neon_green") {
      neonColor = 0x00ff88;
    } else if (colorMode === "neon_magenta") {
      neonColor = 0xff0088;
    } else if (colorMode === "neon_orange") {
      neonColor = 0xff8800;
    } else if (colorMode === "neon_white") {
      neonColor = 0xffffff;
    } else if (colorMode === "neon_black") {
      neonColor = 0x1a2a3a;
    }

    // Generate stable colors
    const colors = generateStableColors(surfaceData.vertices, parameters, colorMode);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material configuration with stable opacity
    const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);
    const complexity = parameters.uSegments * parameters.vSegments;
    const opacity = getStableOpacity(energy, complexity);
    
    let material;
    if (visualMode === "wireframe") {
      material = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: neonColor,
        transparent: true,
        opacity: opacity,
        vertexColors: colorMode.includes("quantum")
      });
    } else if (visualMode === "points") {
      material = new THREE.PointsMaterial({
        size: energy > 100 ? 0.12 : 0.08,
        color: neonColor,
        transparent: true,
        opacity: opacity,
        vertexColors: colorMode.includes("quantum")
      });
    } else {
      // Surface material with stable properties
      if (energy > 500) {
        material = new THREE.MeshStandardMaterial({
          color: neonColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: opacity,
          metalness: 0.3,
          roughness: 0.4,
          vertexColors: colorMode.includes("quantum")
        });
      } else {
        material = new THREE.MeshLambertMaterial({
          color: neonColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: opacity,
          emissive: new THREE.Color(neonColor).multiplyScalar(0.05),
          vertexColors: colorMode.includes("quantum")
        });
      }
    }

    return { geometry, material };
  }, [parameters, visualMode, colorMode]);

  useFrame((state) => {
    const currentRef = visualMode === "points" ? pointsRef.current : meshRef.current;
    if (currentRef) {
      // Minimal rotation to prevent disorientation
      if (parameters.type.includes("pyramid") || parameters.type.includes("prism")) {
        currentRef.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      }
    }
  });

  if (visualMode === "points") {
    return (
      <points ref={pointsRef} geometry={geometry} material={material} />
    );
  }

  return (
    <group 
      position={centeringTransform.position}
      scale={centeringTransform.scale}
      rotation={centeringTransform.rotation}
    >
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );
}