import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicEventHorizonProps {
  radius?: number;
  intensity?: number;
}

export default function HolographicEventHorizon({ radius = 8, intensity = 0.3 }: HolographicEventHorizonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader for holographic effect
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        color1: { value: new THREE.Color('#00ffff') },
        color2: { value: new THREE.Color('#ff00ff') },
        color3: { value: new THREE.Color('#ffff00') }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Subtle vertex displacement for holographic ripple effect
          vec3 pos = position;
          float ripple = sin(length(position.xz) * 8.0 - time * 2.0) * 0.02;
          pos.y += ripple;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        
        void main() {
          // Create holographic scan lines
          float scanLines = sin(vUv.y * 150.0 + time * 3.0) * 0.5 + 0.5;
          
          // Create energy pulses
          float pulse = sin(time * 2.0 + length(vPosition.xz) * 2.0) * 0.5 + 0.5;
          
          // Create color cycling effect
          float colorShift = sin(time * 1.5 + vUv.x * 6.28) * 0.5 + 0.5;
          vec3 baseColor = mix(color1, color2, colorShift);
          baseColor = mix(baseColor, color3, pulse * 0.3);
          
          // Create fresnel effect for holographic rim lighting
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - abs(dot(viewDir, vNormal));
          fresnel = pow(fresnel, 2.0);
          
          // Combine effects
          float alpha = (scanLines * 0.6 + pulse * 0.3 + fresnel * 0.4) * intensity;
          alpha *= 0.7; // Keep it subtle
          
          gl_FragColor = vec4(baseColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, [intensity]);

  // Animation loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    
    if (meshRef.current) {
      // Gentle rotation for added dynamics
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} name="holographic_orb_exclude">
      <sphereGeometry args={[radius, 32, 24]} />
      <primitive object={shaderMaterial} ref={materialRef} />
    </mesh>
  );
}