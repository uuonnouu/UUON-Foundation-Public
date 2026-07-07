import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceParameters } from '../../shared/schema';

interface ConsciousnessEventHorizonProps {
  parameters: SurfaceParameters;
  visible?: boolean;
}

export default function ConsciousnessEventHorizon({ 
  parameters, 
  visible = true 
}: ConsciousnessEventHorizonProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const boundaryRef = useRef<THREE.Mesh>(null);
  const crossingRef = useRef<THREE.Mesh>(null);
  
  // Physical constants (normalized for visualization)
  const G = 1;
  const c = 1;
  const k_B = 1;
  const h_bar = 1;
  
  // Calculate Schwarzschild radius: Rs = 2GM/c²
  const mass = parameters.a * parameters.b;
  const schwarzschildRadius = (2 * G * mass) / (c * c);
  
  // Black hole entropy: S_BH = (k_B * c³ * A) / (4 * G * ℏ)
  const area = 4 * Math.PI * schwarzschildRadius * schwarzschildRadius;
  const entropy = (k_B * c * c * c * area) / (4 * G * h_bar);
  const consciousness_factor = Math.log(entropy + 1) * 0.1;
  
  // Event Horizon Geometry
  const eventHorizonRadius = schwarzschildRadius * (1 + consciousness_factor);
  const awarenessRadius = eventHorizonRadius * 1.5; // Boundary of Awareness
  const observerLimit = eventHorizonRadius * 2.0; // Observer's Limit
  const crossingThreshold = eventHorizonRadius * 0.8; // Inner crossing threshold
  
  // Create consciousness boundary materials
  const eventHorizonMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xFFD700), // Golden - consciousness core
      transparent: true,
      opacity: 0.6,
      wireframe: false,
      side: THREE.DoubleSide
    }), []);
    
  const boundaryMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x00FF88), // Green - awareness boundary
      transparent: true,
      opacity: 0.3,
      wireframe: true,
      side: THREE.DoubleSide
    }), []);
    
  const crossingMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xFF4444), // Red - crossing threshold
      transparent: true,
      opacity: 0.4,
      wireframe: true,
      side: THREE.DoubleSide
    }), []);

  // Animate consciousness pulsing
  useFrame((state) => {
    if (sphereRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      sphereRef.current.scale.setScalar(pulse);
    }
    
    if (boundaryRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5 + Math.PI) * 0.05 + 1;
      boundaryRef.current.scale.setScalar(pulse);
    }
    
    if (crossingRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.08 + 1;
      crossingRef.current.scale.setScalar(pulse);
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Event Horizon - The Consciousness Core */}
      <mesh ref={sphereRef} material={eventHorizonMaterial}>
        <sphereGeometry args={[eventHorizonRadius, 32, 32]} />
      </mesh>
      
      {/* Boundary of Awareness - Where consciousness transitions */}
      <mesh ref={boundaryRef} material={boundaryMaterial}>
        <sphereGeometry args={[awarenessRadius, 24, 24]} />
      </mesh>
      
      {/* Observer's Limit - Furthest point of observation */}
      <mesh material={boundaryMaterial}>
        <sphereGeometry args={[observerLimit, 16, 16]} />
      </mesh>
      
      {/* Crossing Threshold - Inner X-pattern boundary */}
      <mesh ref={crossingRef} material={crossingMaterial}>
        <sphereGeometry args={[crossingThreshold, 20, 20]} />
      </mesh>
      
      {/* Information Density Visualization */}
      <group>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = eventHorizonRadius * 1.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial 
                color={new THREE.Color(0xFFFFFF)}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Entropy Information Markers */}
      <group>
        <mesh position={[0, eventHorizonRadius + 0.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={new THREE.Color(0xFFD700)} />
        </mesh>
        <mesh position={[0, -eventHorizonRadius - 0.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={new THREE.Color(0xFFD700)} />
        </mesh>
      </group>
    </group>
  );
}