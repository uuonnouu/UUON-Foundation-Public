
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

interface ParticleTrailSystemProps {
  parameters: SurfaceParameters;
  trailCount?: number;
  enabled?: boolean;
}

export default function ParticleTrailSystem({ 
  parameters, 
  trailCount = 500, 
  enabled = true 
}: ParticleTrailSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>();
  const agesRef = useRef<Float32Array>();
  
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(trailCount * 3);
    const colors = new Float32Array(trailCount * 3);
    const sizes = new Float32Array(trailCount);
    const velocities = new Float32Array(trailCount * 3);
    const ages = new Float32Array(trailCount);
    
    // Initialize particles around the mathematical surface
    for (let i = 0; i < trailCount; i++) {
      const i3 = i * 3;
      
      // Random position around surface bounds
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Dynamic velocities based on mathematical parameters
      const energy = Math.abs(parameters.a) + Math.abs(parameters.b);
      velocities[i3] = (Math.random() - 0.5) * energy * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * energy * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * energy * 0.01;
      
      // Quantum-like colors
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.1 + 0.05;
      ages[i] = Math.random() * 100;
    }
    
    velocitiesRef.current = velocities;
    agesRef.current = ages;
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Dynamic size based on energy
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.3);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create glowing particle effect
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          alpha *= alpha; // More intense glow
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    return { geometry, material };
  }, [parameters, trailCount]);
  
  useFrame((state) => {
    if (!enabled || !pointsRef.current || !velocitiesRef.current || !agesRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const velocities = velocitiesRef.current;
    const ages = agesRef.current;
    
    const time = state.clock.elapsedTime;
    (pointsRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
    
    // Update particle positions and create trailing effects
    for (let i = 0; i < trailCount; i++) {
      const i3 = i * 3;
      
      // Age particles
      ages[i] += 1;
      
      // Apply mathematical forces
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Mathematical attractor forces
      const forceX = Math.sin(parameters.a * x * 0.1 + time) * 0.001;
      const forceY = Math.cos(parameters.b * y * 0.1 + time) * 0.001;
      const forceZ = Math.sin(parameters.c * z * 0.1 + time) * 0.001;
      
      velocities[i3] += forceX;
      velocities[i3 + 1] += forceY;
      velocities[i3 + 2] += forceZ;
      
      // Update positions
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
      
      // Respawn aged particles
      if (ages[i] > 200) {
        const radius = Math.random() * 15 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        ages[i] = 0;
        
        // Reset color with quantum variation
        const hue = (time * 0.1 + Math.random()) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      // Apply damping
      velocities[i3] *= 0.98;
      velocities[i3 + 1] *= 0.98;
      velocities[i3 + 2] *= 0.98;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
