import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SurfaceParameters, VisualizationMode } from "../../../shared/schema";

interface TextureRendererProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  brightness: number;
  children: React.ReactNode;
}

export default function TextureRenderer({ 
  parameters, 
  visualMode, 
  colorMode, 
  brightness,
  children 
}: TextureRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // High-quality shader materials
  const materials = useMemo(() => {
    const baseColor = getColorFromMode(colorMode);
    const brightnessMultiplier = brightness * 2; // Amplify brightness effect
    
    return {
      wireframe: new THREE.MeshBasicMaterial({
        color: baseColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8 + brightness * 0.4
      }),
      
      hologram: new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(baseColor) },
          brightness: { value: brightnessMultiplier },
          opacity: { value: 0.7 + brightness * 0.3 }
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          uniform float time;
          
          void main() {
            vPosition = position;
            vNormal = normal;
            
            // Subtle wave distortion
            vec3 pos = position;
            pos.z += sin(pos.x * 2.0 + time) * 0.02;
            pos.y += cos(pos.z * 2.0 + time) * 0.02;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          uniform float time;
          uniform vec3 color;
          uniform float brightness;
          uniform float opacity;
          
          void main() {
            // Fresnel effect for holographic look
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - dot(vNormal, viewDirection), 2.0);
            
            // Animated scan lines
            float scanlines = sin(vPosition.y * 50.0 + time * 2.0) * 0.1 + 0.9;
            
            // Energy pulse
            float pulse = sin(time * 3.0) * 0.2 + 0.8;
            
            vec3 finalColor = color * brightness * fresnel * scanlines * pulse;
            gl_FragColor = vec4(finalColor, opacity * fresnel);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      }),
      
      crystal: new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(baseColor) },
          brightness: { value: brightnessMultiplier }
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            vPosition = position;
            vNormal = normal;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUv;
          uniform float time;
          uniform vec3 color;
          uniform float brightness;
          
          void main() {
            // Crystal facet effect
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float ndotv = dot(vNormal, viewDirection);
            
            // Internal reflections
            float refraction = 1.0 - abs(ndotv);
            refraction = pow(refraction, 0.5);
            
            // Color dispersion like a prism
            float r = color.r + sin(vPosition.x * 10.0 + time) * 0.3;
            float g = color.g + sin(vPosition.y * 10.0 + time * 1.1) * 0.3;
            float b = color.b + sin(vPosition.z * 10.0 + time * 1.2) * 0.3;
            
            vec3 finalColor = vec3(r, g, b) * brightness * (0.5 + refraction);
            gl_FragColor = vec4(finalColor, 0.8);
          }
        `,
        transparent: true
      }),
      
      plasma: new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(baseColor) },
          brightness: { value: brightnessMultiplier },
          energy: { value: Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c) }
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            vPosition = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          uniform float time;
          uniform vec3 color;
          uniform float brightness;
          uniform float energy;
          
          void main() {
            // Dynamic plasma effect
            float plasma1 = sin(vPosition.x * 2.0 + time * 2.0);
            float plasma2 = sin(vPosition.y * 3.0 + time * 1.5);
            float plasma3 = sin(vPosition.z * 4.0 + time * 2.5);
            float plasma4 = sin(sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y) * 5.0 + time * 3.0);
            
            float combined = (plasma1 + plasma2 + plasma3 + plasma4) * 0.25;
            
            // Multi-colored plasma
            vec3 plasmaColor = vec3(
              sin(combined * 2.0 + time) * 0.5 + 0.5,
              sin(combined * 2.0 + time + 2.094) * 0.5 + 0.5,
              sin(combined * 2.0 + time + 4.188) * 0.5 + 0.5
            );
            
            vec3 finalColor = mix(color, plasmaColor, 0.7) * brightness * energy * 0.5;
            gl_FragColor = vec4(finalColor, 0.9);
          }
        `,
        transparent: true
      }),
      
      surface: new THREE.MeshPhongMaterial({
        color: baseColor,
        shininess: 100 * brightness,
        transparent: true,
        opacity: 0.9
      })
    };
  }, [colorMode, brightness, parameters.a, parameters.b, parameters.c]);
  
  // Animate shaders
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (materials.hologram.uniforms) {
      materials.hologram.uniforms.time.value = time;
    }
    if (materials.crystal.uniforms) {
      materials.crystal.uniforms.time.value = time;
    }
    if (materials.plasma.uniforms) {
      materials.plasma.uniforms.time.value = time;
    }
  });
  
  // Select material based on visualization mode
  const currentMaterial = useMemo(() => {
    switch (visualMode) {
      case 'wireframe':
        return materials.wireframe;
      case 'glass':
        return materials.crystal;
      case 'dynamic_plasma':
        return materials.plasma;
      case 'metal_texture':
        return materials.hologram;
      case 'surface':
      default:
        return materials.surface;
    }
  }, [visualMode, materials]);
  
  return (
    <mesh ref={meshRef} material={currentMaterial}>
      {children}
    </mesh>
  );
}

function getColorFromMode(colorMode: string): number {
  switch (colorMode) {
    case 'neon_green': return 0x00ff41;
    case 'neon_magenta': return 0xff0080;
    case 'neon_orange': return 0xff4500;
    case 'pure_white': return 0xffffff;
    case 'pure_black': return 0x222222;
    default: return 0x00ff41;
  }
}