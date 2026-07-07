// Cosmic Particle System - Black Hole vs White Hole Physics
// Demonstrates inverse-square force laws with proper attraction/repulsion

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

interface CosmicParticleSystemProps {
  parameters: SurfaceParameters;
  isBlackHole: boolean; // true = attraction, false = repulsion (white hole)
  particleCount?: number;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  life: number;
  maxLife: number;
}

export default function CosmicParticleSystem({ 
  parameters, 
  isBlackHole, 
  particleCount = 1000 
}: CosmicParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);

  // Physical constants
  const G = 0.1; // Gravitational constant (scaled for visualization)
  const c = 1.0; // Speed of light
  const centralMass = parameters.a * parameters.b; // Black/white hole mass
  const schwarzschildRadius = (2 * G * centralMass) / (c * c);

  // Initialize particles
  const { positions, colors, sizes } = useMemo(() => {
    const positionsArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    const sizesArray = new Float32Array(particleCount);

    particles.current = [];

    for (let i = 0; i < particleCount; i++) {
      // Initialize particles in a sphere around the cosmic object
      const radius = schwarzschildRadius * (3 + Math.random() * 10);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const particle: Particle = {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        mass: 0.01 + Math.random() * 0.02,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 200
      };

      particles.current.push(particle);

      // Set initial positions
      positionsArray[i * 3] = particle.position.x;
      positionsArray[i * 3 + 1] = particle.position.y;
      positionsArray[i * 3 + 2] = particle.position.z;

      // Set particle size
      sizesArray[i] = 0.1 + Math.random() * 0.2;
    }

    return {
      positions: positionsArray,
      colors: colorsArray,
      sizes: sizesArray
    };
  }, [particleCount, schwarzschildRadius]);

  // Physics simulation
  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const positionsAttribute = particlesRef.current.geometry.getAttribute('position');
    const colorsAttribute = particlesRef.current.geometry.getAttribute('color');
    const positions = positionsAttribute.array as Float32Array;
    const colors = colorsAttribute.array as Float32Array;

    particles.current.forEach((particle, index) => {
      // Calculate distance from center (black/white hole)
      const distance = particle.position.length();
      
      // Prevent singularity issues
      const safeDistance = Math.max(distance, schwarzschildRadius * 0.1);
      
      // Inverse-square force law: F = GMm/r²
      const forceMagnitude = (G * centralMass * particle.mass) / (safeDistance * safeDistance);
      
      // Direction vector (normalized)
      const direction = particle.position.clone().normalize();
      
      // Apply force based on object type
      if (isBlackHole) {
        // Black hole: attractive force (toward center)
        const force = direction.multiplyScalar(-forceMagnitude);
        particle.velocity.add(force.multiplyScalar(delta));
      } else {
        // White hole: repulsive force (away from center)
        const force = direction.multiplyScalar(forceMagnitude);
        particle.velocity.add(force.multiplyScalar(delta));
      }

      // Apply relativistic effects near event horizon
      if (distance < schwarzschildRadius * 2) {
        const relativisticFactor = Math.sqrt(1 - schwarzschildRadius / safeDistance);
        particle.velocity.multiplyScalar(relativisticFactor);
      }

      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Handle particle lifecycle
      particle.life += delta * 10;
      
      // Reset particles that fall into black hole or escape white hole
      if ((isBlackHole && distance < schwarzschildRadius) || 
          (!isBlackHole && distance > schwarzschildRadius * 20)) {
        // Respawn particle
        const respawnRadius = schwarzschildRadius * (3 + Math.random() * 7);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.set(
          respawnRadius * Math.sin(phi) * Math.cos(theta),
          respawnRadius * Math.sin(phi) * Math.sin(theta),
          respawnRadius * Math.cos(phi)
        );
        
        particle.velocity.set(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        );
        
        particle.life = 0;
      }

      // Update geometry arrays
      positions[index * 3] = particle.position.x;
      positions[index * 3 + 1] = particle.position.y;
      positions[index * 3 + 2] = particle.position.z;

      // Color based on velocity and proximity to event horizon
      const speed = particle.velocity.length();
      const proximityFactor = Math.max(0, 1 - distance / (schwarzschildRadius * 5));
      
      if (isBlackHole) {
        // Black hole: red-orange particles, brighter near event horizon
        colors[index * 3] = Math.min(1, 0.5 + speed * 100 + proximityFactor); // Red
        colors[index * 3 + 1] = Math.min(1, speed * 50 + proximityFactor * 0.3); // Green
        colors[index * 3 + 2] = speed * 20; // Blue
      } else {
        // White hole: blue-white particles, brighter when expelled
        colors[index * 3] = Math.min(1, 0.3 + speed * 50 + proximityFactor * 0.5); // Red
        colors[index * 3 + 1] = Math.min(1, 0.5 + speed * 75 + proximityFactor * 0.7); // Green
        colors[index * 3 + 2] = Math.min(1, 0.8 + speed * 100 + proximityFactor); // Blue
      }
    });

    positionsAttribute.needsUpdate = true;
    colorsAttribute.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            
            float opacity = 1.0 - distance * 2.0;
            gl_FragColor = vec4(vColor, opacity);
          }
        `}
        transparent
        vertexColors
      />
    </points>
  );
}