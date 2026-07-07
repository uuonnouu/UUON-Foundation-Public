// Enhanced Parameter System - Applies G-M dynamics to all mathematical objects
// This system ensures all shapes utilize the enhanced 4D mathematical controls

export interface ParameterEnhancement {
  parallelField: number;
  dimensionalFold: number;
  quantumPhase: number;
  tensorFlow: number;
  metricWarp: number;
  spaceTwist: number;
  timeDilation: number;
}

/**
 * Calculate enhanced parameter effects for any mathematical shape
 * Only applies when staticMode is false and not during reset operations
 */
export function calculateParameterEnhancements(
  u: number, 
  v: number, 
  g: number, h: number, i: number, j: number, k: number, l: number, m: number,
  staticMode: boolean = false,
  isReset: boolean = false
): ParameterEnhancement {
  
  // Disable G-M enhancements during static mode or reset operations
  if (staticMode || isReset) {
    return {
      parallelField: 0,
      dimensionalFold: 0,
      quantumPhase: 0,
      tensorFlow: 0,
      metricWarp: 0,
      spaceTwist: 0,
      timeDilation: 0
    };
  }
  
  // Enhanced G-M Parameters: Advanced 4D Dynamics
  const parallelField = g * Math.sin(h * u * Math.PI) * Math.cos(g * v * Math.PI); // g: Parallel field oscillations
  const dimensionalFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v)); // h,i: Dimensional folding
  const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v)); // i,j,k: Quantum phase modulation
  const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u); // j,k,l: Tensor field dynamics
  const metricWarp = k * Math.exp(l * Math.sin(m * u)) * Math.cos(k * v); // k,l,m: Metric space warping
  const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5)); // l,m: Space twisting
  const timeDilation = m * Math.exp(-Math.abs(u - v)) * Math.sin(m * (u + v) * Math.PI); // m: Time dilation effects
  
  return {
    parallelField,
    dimensionalFold,
    quantumPhase,
    tensorFlow,
    metricWarp,
    spaceTwist,
    timeDilation
  };
}

/**
 * Apply enhancements to X coordinate
 */
export function enhanceX(
  baseX: number, 
  enhancements: ParameterEnhancement, 
  intensity: number = 0.15
): number {
  return baseX + (
    enhancements.parallelField + 
    enhancements.quantumPhase + 
    enhancements.dimensionalFold
  ) * intensity;
}

/**
 * Apply enhancements to Y coordinate
 */
export function enhanceY(
  baseY: number, 
  enhancements: ParameterEnhancement, 
  intensity: number = 0.15
): number {
  return baseY + (
    enhancements.tensorFlow + 
    enhancements.metricWarp + 
    enhancements.dimensionalFold
  ) * intensity;
}

/**
 * Apply enhancements to Z coordinate
 */
export function enhanceZ(
  baseZ: number, 
  enhancements: ParameterEnhancement, 
  intensity: number = 0.2
): number {
  return baseZ + (
    enhancements.spaceTwist + 
    enhancements.timeDilation + 
    enhancements.metricWarp
  ) * intensity;
}

/**
 * Complete enhancement function for any coordinate system
 */
export function enhanceCoordinates(
  baseX: number, 
  baseY: number, 
  baseZ: number,
  u: number, 
  v: number,
  g: number, h: number, i: number, j: number, k: number, l: number, m: number,
  intensityX: number = 0.15,
  intensityY: number = 0.15,
  intensityZ: number = 0.2,
  staticMode: boolean = false,
  isReset: boolean = false
): { x: number; y: number; z: number } {
  
  const enhancements = calculateParameterEnhancements(u, v, g, h, i, j, k, l, m, staticMode, isReset);
  
  return {
    x: enhanceX(baseX, enhancements, intensityX),
    y: enhanceY(baseY, enhancements, intensityY),
    z: enhanceZ(baseZ, enhancements, intensityZ)
  };
}

/**
 * Specialized enhancement for basic geometric shapes
 */
export function enhanceBasicShape(
  baseX: number, 
  baseY: number, 
  baseZ: number,
  u: number, 
  v: number,
  g: number, h: number, i: number, j: number, k: number, l: number, m: number,
  staticMode: boolean = false,
  isReset: boolean = false
): { x: number; y: number; z: number } {
  
  return enhanceCoordinates(baseX, baseY, baseZ, u, v, g, h, i, j, k, l, m, 0.1, 0.1, 0.15, staticMode, isReset);
}

/**
 * Specialized enhancement for advanced mathematical objects
 */
export function enhanceAdvancedShape(
  baseX: number, 
  baseY: number, 
  baseZ: number,
  u: number, 
  v: number,
  g: number, h: number, i: number, j: number, k: number, l: number, m: number,
  staticMode: boolean = false,
  isReset: boolean = false
): { x: number; y: number; z: number } {
  
  return enhanceCoordinates(baseX, baseY, baseZ, u, v, g, h, i, j, k, l, m, 0.2, 0.2, 0.25, staticMode, isReset);
}

/**
 * Specialized enhancement for 4D mathematical objects
 */
export function enhance4DShape(
  baseX: number, 
  baseY: number, 
  baseZ: number,
  u: number, 
  v: number,
  g: number, h: number, i: number, j: number, k: number, l: number, m: number,
  staticMode: boolean = false,
  isReset: boolean = false
): { x: number; y: number; z: number } {
  
  return enhanceCoordinates(baseX, baseY, baseZ, u, v, g, h, i, j, k, l, m, 0.25, 0.25, 0.3, staticMode, isReset);
}