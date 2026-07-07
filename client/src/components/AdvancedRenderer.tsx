
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { generateParametricSurface } from "../lib/surfaceGenerator";

interface AdvancedRendererProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  staticMode?: boolean;
}

export default function AdvancedRenderer({ 
  parameters, 
  visualMode, 
  colorMode, 
  staticMode = false 
}: AdvancedRendererProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleSystemRef = useRef<THREE.Points>(null);
  const vectorFieldRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  const advancedGeometry = useMemo(() => {
    const surfaceData = generateParametricSurface(parameters);
    const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);

    switch (visualMode) {
      case "particles":
        return createParticleSystem(surfaceData, energy);
      case "volume":
        return createVolumeRendering(surfaceData, parameters);
      case "isosurface":
        return createIsosurface(surfaceData, parameters);
      case "vectors":
        return createVectorField(surfaceData, parameters);
      case "streamlines":
        return createStreamlines(surfaceData, parameters);
      default:
        return null;
    }
  }, [parameters, visualMode]);

  useFrame((state) => {
    if (staticMode) return;
    
    const currentTime = state.clock.elapsedTime;
    setTime(currentTime);

    if (visualMode === "particles" && particleSystemRef.current) {
      // Animate particle system
      const positions = particleSystemRef.current.geometry.attributes.position;
      if (positions) {
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = positions.getZ(i) + Math.sin(currentTime + i * 0.1) * 0.1;
          positions.setZ(i, z);
        }
        positions.needsUpdate = true;
      }
    }

    if (visualMode === "vectors" && vectorFieldRef.current) {
      // Animate vector field
      vectorFieldRef.current.rotation.y = currentTime * 0.1;
    }
  });

  if (!advancedGeometry) return null;

  return (
    <group ref={groupRef}>
      {visualMode === "particles" && (
        <points ref={particleSystemRef} geometry={advancedGeometry.geometry}>
          <pointsMaterial
            size={0.05}
            transparent
            opacity={0.8}
            vertexColors
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      
      {visualMode === "volume" && (
        <mesh geometry={advancedGeometry.geometry} material={advancedGeometry.material} />
      )}
      
      {visualMode === "isosurface" && (
        <mesh geometry={advancedGeometry.geometry} material={advancedGeometry.material} />
      )}
      
      {visualMode === "vectors" && (
        <group ref={vectorFieldRef}>
          {advancedGeometry.arrows?.map((arrow, index) => (
            <arrowHelper key={index} {...arrow} />
          ))}
        </group>
      )}
      
      {visualMode === "streamlines" && (
        <lineSegments geometry={advancedGeometry.geometry} material={advancedGeometry.material} />
      )}
    </group>
  );
}

function createParticleSystem(surfaceData: any, energy: number) {
  const particleCount = Math.min(10000, surfaceData.vertices.length / 3);
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    const vertexIdx = (i * 3) % surfaceData.vertices.length;
    
    positions[idx] = surfaceData.vertices[vertexIdx] + (Math.random() - 0.5) * 0.5;
    positions[idx + 1] = surfaceData.vertices[vertexIdx + 1] + (Math.random() - 0.5) * 0.5;
    positions[idx + 2] = surfaceData.vertices[vertexIdx + 2] + (Math.random() - 0.5) * 0.5;
    
    // Dynamic colors based on energy
    const intensity = energy > 100 ? 1.0 : 0.7;
    colors[idx] = Math.random() * intensity;
    colors[idx + 1] = Math.random() * intensity;
    colors[idx + 2] = Math.random() * intensity;
    
    velocities[idx] = (Math.random() - 0.5) * 0.02;
    velocities[idx + 1] = (Math.random() - 0.5) * 0.02;
    velocities[idx + 2] = (Math.random() - 0.5) * 0.02;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

  return { geometry };
}

function createVolumeRendering(surfaceData: any, parameters: SurfaceParameters) {
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(surfaceData.indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(surfaceData.vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(surfaceData.normals, 3));

  const material = new THREE.MeshPhysicalMaterial({
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    transmission: 0.9,
    thickness: 0.5,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  return { geometry, material };
}

function createIsosurface(surfaceData: any, parameters: SurfaceParameters) {
  // Extract isosurface at specific mathematical threshold
  const threshold = parameters.a * 0.5;
  const geometry = new THREE.BufferGeometry();
  
  // Simplified isosurface extraction
  const filteredVertices = [];
  const filteredIndices = [];
  
  for (let i = 0; i < surfaceData.vertices.length; i += 3) {
    const z = surfaceData.vertices[i + 2];
    if (Math.abs(z - threshold) < 0.5) {
      filteredVertices.push(
        surfaceData.vertices[i],
        surfaceData.vertices[i + 1],
        surfaceData.vertices[i + 2]
      );
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredVertices, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    wireframe: false
  });

  return { geometry, material };
}

function createVectorField(surfaceData: any, parameters: SurfaceParameters) {
  const arrows = [];
  const step = 10; // Sample every 10th vertex for performance
  
  for (let i = 0; i < surfaceData.vertices.length; i += step * 3) {
    const origin = new THREE.Vector3(
      surfaceData.vertices[i],
      surfaceData.vertices[i + 1],
      surfaceData.vertices[i + 2]
    );
    
    // Calculate vector direction based on mathematical gradient
    const direction = new THREE.Vector3(
      Math.sin(origin.x * parameters.a * 0.1),
      Math.cos(origin.y * parameters.b * 0.1),
      Math.sin(origin.z * parameters.c * 0.1)
    ).normalize();
    
    const length = 0.5;
    const color = 0xff4444;
    
    arrows.push({
      origin,
      direction,
      length,
      color
    });
  }

  return { arrows };
}

function createStreamlines(surfaceData: any, parameters: SurfaceParameters) {
  const positions = [];
  const numStreamlines = 20;
  const stepsPerLine = 50;
  
  for (let i = 0; i < numStreamlines; i++) {
    const startIdx = Math.floor(Math.random() * (surfaceData.vertices.length / 3));
    let currentPos = new THREE.Vector3(
      surfaceData.vertices[startIdx * 3],
      surfaceData.vertices[startIdx * 3 + 1],
      surfaceData.vertices[startIdx * 3 + 2]
    );
    
    for (let j = 0; j < stepsPerLine; j++) {
      positions.push(currentPos.x, currentPos.y, currentPos.z);
      
      // Calculate flow direction
      const flowDir = new THREE.Vector3(
        Math.sin(currentPos.x * parameters.a * 0.1),
        Math.cos(currentPos.y * parameters.b * 0.1),
        Math.sin(currentPos.z * parameters.c * 0.1)
      ).multiplyScalar(0.1);
      
      currentPos.add(flowDir);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: 0x44ff44,
    transparent: true,
    opacity: 0.7
  });

  return { geometry, material };
}
