
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

interface VolumetricLightingProps {
  parameters: SurfaceParameters;
  enabled?: boolean;
}

export default function VolumetricLighting({ parameters, enabled = true }: VolumetricLightingProps) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const volumeRef = useRef<THREE.Mesh>(null);
  
  const volumetricMaterial = useMemo(() => {
    const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        energy: { value: energy },
        lightPosition: { value: new THREE.Vector3(10, 10, 10) },
        lightColor: { value: new THREE.Color(0.3, 0.6, 1.0) }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float energy;
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        float noise(vec3 p) {
          return sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time) * sin(p.z * 10.0 + time) * 0.5 + 0.5;
        }
        
        void main() {
          vec3 lightDir = normalize(lightPosition - vWorldPosition);
          float distance = length(lightPosition - vWorldPosition);
          
          // Volumetric scattering
          float scattering = 1.0 / (1.0 + distance * 0.1);
          
          // Mathematical energy-based density
          float density = noise(vWorldPosition * 0.1) * energy * 0.01;
          density *= scattering;
          
          // God rays effect
          float godRays = max(0.0, dot(vNormal, lightDir));
          godRays = pow(godRays, 3.0);
          
          vec3 color = lightColor * density * godRays;
          float alpha = density * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
  }, [parameters]);
  
  const volumeGeometry = useMemo(() => {
    // Create a volume around the mathematical surface
    return new THREE.SphereGeometry(20, 32, 32);
  }, []);
  
  useFrame((state) => {
    if (!enabled) return;
    
    const time = state.clock.elapsedTime;
    
    if (volumetricMaterial) {
      volumetricMaterial.uniforms.time.value = time;
      
      // Dynamic light movement based on mathematical parameters
      const x = Math.sin(time * parameters.a * 0.1) * 15;
      const y = Math.cos(time * parameters.b * 0.1) * 15;
      const z = Math.sin(time * parameters.c * 0.1) * 10 + 10;
      
      volumetricMaterial.uniforms.lightPosition.value.set(x, y, z);
      
      if (lightRef.current) {
        lightRef.current.position.set(x, y, z);
      }
    }
  });
  
  if (!enabled) return null;
  
  return (
    <>
      <spotLight
        ref={lightRef}
        intensity={2}
        angle={Math.PI / 4}
        penumbra={0.5}
        color={0x3399ff}
        castShadow
      />
      <mesh ref={volumeRef} geometry={volumeGeometry} material={volumetricMaterial} />
    </>
  );
}
