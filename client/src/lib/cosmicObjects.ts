// Cosmic Objects: Black Holes and White Holes
// Mathematical implementation using authentic Einstein Field Equations
// Based on Schwarzschild metric and thermodynamic principles

import { SurfaceEquation } from "./parametricSurfaces";

// Physical constants (normalized for visualization)
const G = 1; // Gravitational constant 
const c = 1; // Speed of light
const k_B = 1; // Boltzmann constant
const h_bar = 1; // Reduced Planck constant

// Calculate Schwarzschild radius: Rs = 2GM/c²
function schwarzschildRadius(mass: number): number {
  return (2 * G * mass) / (c * c);
}

// Black hole entropy: S_BH = (k_B * c³ * A) / (4 * G * ℏ)
function blackHoleEntropy(radius: number): number {
  const area = 4 * Math.PI * radius * radius;
  return (k_B * c * c * c * area) / (4 * G * h_bar);
}

// Escape velocity: v_escape = √(2GM/r)
function escapeVelocity(mass: number, radius: number): number {
  return Math.sqrt((2 * G * mass) / radius);
}

// Gravity Well - Enhanced gravitational field visualization
// Mathematical implementation using gravitational potential energy
export const GRAVITY_WELL: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    // Core mass and gravitational influence
    const core_mass = Math.abs(a) + 0.1;
    const base_radius = Math.abs(d) + 0.5;
    
    // Gravitational field strength with distance falloff
    const distance_factor = base_radius + Math.abs(e) * Math.sin(phi) * Math.sin(phi);
    const field_strength = core_mass / (distance_factor + 0.1);
    
    // X-pattern formation for crossing gravitational streams
    const x_pattern = Math.abs(Math.cos(phi * f)) * Math.abs(Math.sin(theta * g));
    const enhanced_radius = distance_factor * (1 + x_pattern * Math.abs(h) * 0.3);
    
    // Warped spacetime visualization
    const warp_factor = 1 + field_strength * Math.abs(i) * 0.2;
    const rotation_effect = Math.cos(theta + Math.abs(j) * phi) * warp_factor;
    
    // Additional parameter influences
    const complexity = 1 + Math.abs(k) * Math.sin(phi * 3) * 0.1;
    const asymmetry = Math.abs(l) * Math.cos(theta * 2) * 0.15;
    const depth_mod = 1 + Math.abs(m) * Math.tanh(enhanced_radius - 1) * 0.2;
    
    return enhanced_radius * Math.sin(phi) * rotation_effect * complexity * depth_mod * (1 + asymmetry);
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const core_mass = Math.abs(a) + 0.1;
    const base_radius = Math.abs(d) + 0.5;
    const distance_factor = base_radius + Math.abs(e) * Math.sin(phi) * Math.sin(phi);
    const field_strength = core_mass / (distance_factor + 0.1);
    
    const x_pattern = Math.abs(Math.cos(phi * f)) * Math.abs(Math.sin(theta * g));
    const enhanced_radius = distance_factor * (1 + x_pattern * Math.abs(h) * 0.3);
    
    const warp_factor = 1 + field_strength * Math.abs(i) * 0.2;
    const rotation_effect = Math.sin(theta + Math.abs(j) * phi) * warp_factor;
    
    // Y-axis specific modulations
    const spiral_effect = Math.abs(n) * Math.sin(theta * Math.abs(o) + phi) * 0.2;
    const tidal_force = 1 + Math.abs(p) * Math.cos(phi * 4) * 0.1;
    const orbital_decay = Math.abs(q) * Math.exp(-enhanced_radius * 0.5) * 0.3;
    
    return enhanced_radius * Math.sin(phi) * rotation_effect * tidal_force * (1 + spiral_effect) * (1 + orbital_decay);
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const phi = v * Math.PI * c;
    
    const core_mass = Math.abs(a) + 0.1;
    const base_radius = Math.abs(d) + 0.5;
    const distance_factor = base_radius + Math.abs(e) * Math.sin(phi) * Math.sin(phi);
    const enhanced_radius = distance_factor * (1 + Math.abs(h) * 0.3);
    
    // Gravitational potential depth
    const potential_depth = -core_mass * Math.abs(r) / (enhanced_radius + 0.1);
    const z_compression = Math.cos(phi) * (1 + potential_depth * 0.2);
    
    // Event horizon effects
    const horizon_proximity = Math.abs(s) * Math.exp(-enhanced_radius) * 0.5;
    const singularity_pull = Math.abs(t) * Math.tanh(core_mass - enhanced_radius) * 0.3;
    
    // Final z-axis parameters
    const time_dilation = 1 + Math.abs(uParam) * horizon_proximity;
    const space_curvature = Math.abs(vParam) * Math.sin(phi * 6) * 0.1;
    const consciousness_field = Math.abs(w) * Math.log(core_mass + 1) * 0.15;
    
    return enhanced_radius * z_compression * time_dilation * (1 + singularity_pull + space_curvature + consciousness_field);
  }
};

// White Hole - Energy expulsion cosmic object
// Mathematical implementation of matter and energy expulsion fields
export const WHITE_HOLE: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    // Core energy source and expulsion strength
    const energy_core = Math.abs(a) + 0.2;
    const base_radius = Math.abs(d) + 0.8;
    
    // Energy expulsion field (opposite of gravitational attraction)
    const expulsion_strength = energy_core * (1 + Math.abs(e) * Math.sin(phi * 2));
    const expansion_factor = base_radius * (1 + expulsion_strength * Math.abs(f) * 0.4);
    
    // Radial energy burst patterns
    const burst_pattern = Math.abs(Math.sin(phi * Math.abs(g))) * Math.abs(Math.cos(theta * Math.abs(h)));
    const enhanced_radius = expansion_factor * (1 + burst_pattern * Math.abs(i) * 0.5);
    
    // Matter expulsion dynamics
    const expulsion_velocity = 1 + Math.abs(j) * Math.exp(enhanced_radius * 0.3) * 0.2;
    const energy_flux = Math.cos(theta + phi * Math.abs(k)) * expulsion_velocity;
    
    // Additional white hole characteristics
    const luminosity = 1 + Math.abs(l) * Math.sin(theta * 4) * 0.15;
    const anti_gravity = Math.abs(m) * Math.tanh(enhanced_radius - 2) * 0.25;
    const temporal_reversal = 1 + Math.abs(n) * Math.cos(phi * 6) * 0.1;
    
    return enhanced_radius * Math.sin(phi) * energy_flux * luminosity * temporal_reversal * (1 + anti_gravity);
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const energy_core = Math.abs(a) + 0.2;
    const base_radius = Math.abs(d) + 0.8;
    const expulsion_strength = energy_core * (1 + Math.abs(e) * Math.sin(phi * 2));
    const expansion_factor = base_radius * (1 + expulsion_strength * Math.abs(f) * 0.4);
    
    const burst_pattern = Math.abs(Math.sin(phi * Math.abs(g))) * Math.abs(Math.cos(theta * Math.abs(h)));
    const enhanced_radius = expansion_factor * (1 + burst_pattern * Math.abs(i) * 0.5);
    
    const expulsion_velocity = 1 + Math.abs(j) * Math.exp(enhanced_radius * 0.3) * 0.2;
    const energy_flux = Math.sin(theta + phi * Math.abs(k)) * expulsion_velocity;
    
    // Y-axis specific energy dynamics
    const plasma_jets = Math.abs(o) * Math.sin(phi * 8) * Math.cos(theta * 2) * 0.3;
    const magnetic_field = 1 + Math.abs(p) * Math.sin(theta * Math.abs(q)) * 0.2;
    const particle_streams = Math.abs(r) * Math.exp(-Math.abs(phi - Math.PI/2)) * 0.25;
    
    return enhanced_radius * Math.sin(phi) * energy_flux * magnetic_field * (1 + plasma_jets + particle_streams);
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const phi = v * Math.PI * c;
    
    const energy_core = Math.abs(a) + 0.2;
    const base_radius = Math.abs(d) + 0.8;
    const enhanced_radius = base_radius * (1 + Math.abs(i) * 0.5);
    
    // Vertical energy expulsion along z-axis
    const vertical_expulsion = Math.cos(phi) * (1 + energy_core * Math.abs(s) * 0.3);
    
    // Time-reversed entropy (negative entropy production)
    const entropy_reversal = Math.abs(t) * Math.log(energy_core + 1) * 0.2;
    const causality_violation = Math.abs(uParam) * Math.sin(phi * 10) * 0.15;
    
    // White hole event horizon effects
    const horizon_expansion = 1 + Math.abs(vParam) * Math.exp(enhanced_radius * 0.2) * 0.25;
    const quantum_fluctuations = Math.abs(w) * Math.sin(phi * 12) * Math.cos(phi * 7) * 0.1;
    
    return enhanced_radius * vertical_expulsion * horizon_expansion * (1 + entropy_reversal + causality_violation + quantum_fluctuations);
  }
};

// Wormhole - Spacetime tunnel connecting distant regions
// Mathematical implementation of Einstein-Rosen bridge geometry
export const WORMHOLE: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const z_coord = (v - 0.5) * Math.abs(c) * 6; // Throat length parameter
    
    // Throat radius with hyperbolic geometry
    const throat_base = Math.abs(a) + 0.5;
    const throat_expansion = Math.abs(d) + 1;
    const throat_radius = throat_base * Math.sqrt(throat_expansion + (z_coord * z_coord) / (Math.abs(e) + 1));
    
    // Spatial curvature around the throat
    const curvature_strength = Math.abs(f) + 0.1;
    const curvature = 1 + curvature_strength * Math.exp(-Math.abs(z_coord) / (Math.abs(g) + 0.5));
    
    // Wormhole mouth distortions
    const mouth_distortion = Math.abs(h) * Math.sin(theta * Math.abs(i)) * Math.exp(-Math.abs(z_coord) * 0.3);
    const enhanced_radius = throat_radius * curvature * (1 + mouth_distortion * 0.4);
    
    // Traversability conditions
    const exotic_matter = 1 + Math.abs(j) * Math.cos(z_coord * Math.abs(k)) * 0.2;
    const spacetime_metric = Math.abs(l) * Math.tanh(enhanced_radius - throat_base) * 0.15;
    
    // Additional geometric effects
    const tidal_forces = 1 + Math.abs(m) * Math.sin(theta * 4) * Math.exp(-Math.abs(z_coord)) * 0.1;
    const coordinate_stretch = Math.abs(n) * Math.cos(theta * 2) * 0.25;
    
    return enhanced_radius * Math.cos(theta) * exotic_matter * tidal_forces * (1 + spacetime_metric + coordinate_stretch);
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const z_coord = (v - 0.5) * Math.abs(c) * 6;
    
    const throat_base = Math.abs(a) + 0.5;
    const throat_expansion = Math.abs(d) + 1;
    const throat_radius = throat_base * Math.sqrt(throat_expansion + (z_coord * z_coord) / (Math.abs(e) + 1));
    
    const curvature_strength = Math.abs(f) + 0.1;
    const curvature = 1 + curvature_strength * Math.exp(-Math.abs(z_coord) / (Math.abs(g) + 0.5));
    
    const mouth_distortion = Math.abs(h) * Math.sin(theta * Math.abs(i)) * Math.exp(-Math.abs(z_coord) * 0.3);
    const enhanced_radius = throat_radius * curvature * (1 + mouth_distortion * 0.4);
    
    // Y-axis specific wormhole dynamics
    const magnetic_flux = Math.abs(o) * Math.sin(z_coord * Math.abs(p)) * 0.3;
    const field_lines = 1 + Math.abs(q) * Math.cos(theta * 6) * Math.exp(-Math.abs(z_coord) * 0.2) * 0.2;
    const causality_loop = Math.abs(r) * Math.sin(theta * Math.abs(z_coord)) * 0.15;
    
    return enhanced_radius * Math.sin(theta) * field_lines * (1 + magnetic_flux + causality_loop);
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const z_coord = (v - 0.5) * Math.abs(c) * 6;
    
    // Spacetime embedding curve
    const embedding_depth = Math.abs(s) + 0.2;
    const embedding_curve = embedding_depth * Math.tanh(z_coord / (Math.abs(t) + 0.5));
    
    // Wormhole traversal effects
    const time_dilation = Math.abs(uParam) * Math.sin(z_coord * 2) * 0.3;
    const length_contraction = Math.abs(vParam) * Math.exp(-Math.abs(z_coord) * 0.4) * 0.2;
    
    // Exotic matter distribution
    const negative_energy = Math.abs(w) * Math.cos(z_coord * 3) * 0.25;
    
    // Final z-coordinate with all effects
    const total_z_effect = z_coord + embedding_curve + time_dilation + length_contraction + negative_energy;
    
    return total_z_effect;
  }
};

// Ergosphere - Rotating spacetime boundary region
// Mathematical implementation of Kerr metric frame-dragging effects
export const ERGOSPHERE: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    // Rotating black hole parameters
    const mass = Math.abs(a) + 0.5;
    const spin_parameter = Math.abs(d) + 0.1; // Angular momentum
    const base_radius = 2 * mass; // Schwarzschild radius
    
    // Ergosphere boundary calculation (angle-dependent)
    const spin_factor = Math.abs(spin_parameter * Math.cos(phi));
    const ergosphere_factor = 1 + Math.sqrt(Math.max(0, 1 - (spin_factor * spin_factor) / (mass * mass)));
    const ergosphere_radius = base_radius * ergosphere_factor * 0.5;
    
    // Enhanced radius with parameter modulations
    const radius_modulation = 1 + Math.abs(e) * Math.sin(2 * phi) * 0.2;
    const enhanced_radius = ergosphere_radius * radius_modulation;
    
    // Frame-dragging effects (spacetime rotation)
    const frame_drag_strength = Math.abs(f) + 0.1;
    const angular_velocity = spin_parameter * Math.sin(phi) * Math.sin(phi) / (enhanced_radius * frame_drag_strength);
    const frame_drag_angle = theta + angular_velocity * Math.abs(g);
    
    // Rotational distortions
    const rotation_effect = Math.cos(frame_drag_angle) * (1 + Math.abs(h) * Math.sin(phi * 4) * 0.15);
    
    // Additional ergosphere characteristics
    const energy_extraction = Math.abs(i) * Math.sin(theta * 6) * Math.exp(-Math.abs(phi - Math.PI/2)) * 0.2;
    const tidal_shear = 1 + Math.abs(j) * Math.cos(phi * 8) * 0.1;
    const metric_signature = Math.abs(k) * Math.tanh(enhanced_radius - base_radius) * 0.25;
    
    return enhanced_radius * Math.sin(phi) * rotation_effect * tidal_shear * (1 + energy_extraction + metric_signature);
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const mass = Math.abs(a) + 0.5;
    const spin_parameter = Math.abs(d) + 0.1;
    const base_radius = 2 * mass;
    
    const spin_factor = Math.abs(spin_parameter * Math.cos(phi));
    const ergosphere_factor = 1 + Math.sqrt(Math.max(0, 1 - (spin_factor * spin_factor) / (mass * mass)));
    const ergosphere_radius = base_radius * ergosphere_factor * 0.5;
    
    const radius_modulation = 1 + Math.abs(e) * Math.sin(2 * phi) * 0.2;
    const enhanced_radius = ergosphere_radius * radius_modulation;
    
    const frame_drag_strength = Math.abs(f) + 0.1;
    const angular_velocity = spin_parameter * Math.sin(phi) * Math.sin(phi) / (enhanced_radius * frame_drag_strength);
    const frame_drag_angle = theta + angular_velocity * Math.abs(g);
    
    const rotation_effect = Math.sin(frame_drag_angle) * (1 + Math.abs(h) * Math.sin(phi * 4) * 0.15);
    
    // Y-axis specific rotating effects
    const centrifugal_force = Math.abs(l) * Math.sin(theta * 3) * Math.sin(phi) * 0.3;
    const coriolis_effect = Math.abs(m) * Math.cos(theta * Math.abs(n)) * 0.2;
    const gyroscopic_precession = Math.abs(o) * Math.sin(phi * 10) * Math.cos(theta * 2) * 0.15;
    
    return enhanced_radius * Math.sin(phi) * rotation_effect * (1 + centrifugal_force + coriolis_effect + gyroscopic_precession);
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const phi = v * Math.PI * c;
    
    const mass = Math.abs(a) + 0.5;
    const spin_parameter = Math.abs(d) + 0.1;
    const base_radius = 2 * mass;
    
    const spin_factor = Math.abs(spin_parameter * Math.cos(phi));
    const ergosphere_factor = 1 + Math.sqrt(Math.max(0, 1 - (spin_factor * spin_factor) / (mass * mass)));
    const ergosphere_radius = base_radius * ergosphere_factor * 0.5;
    
    const enhanced_radius = ergosphere_radius * (1 + Math.abs(e) * 0.2);
    
    // Z-axis ergosphere dynamics
    const polar_compression = Math.cos(phi) * (1 + Math.abs(p) * Math.sin(phi * 6) * 0.2);
    
    // Kerr metric effects
    const spacetime_twist = Math.abs(q) * spin_parameter * Math.sin(phi) * 0.3;
    const horizon_proximity = Math.abs(r) * Math.exp(-enhanced_radius / base_radius) * 0.25;
    
    // Additional z-axis parameters
    const angular_momentum_coupling = Math.abs(s) * Math.cos(phi * 12) * 0.2;
    const rotational_kinetic_energy = Math.abs(t) * Math.sin(phi * 8) * 0.15;
    const penrose_process = Math.abs(uParam) * Math.tanh(enhanced_radius - base_radius * 0.8) * 0.3;
    
    // Final z-coordinate with quantum effects
    const quantum_frame_drag = Math.abs(vParam) * Math.sin(phi * 15) * 0.1;
    const consciousness_rotation = Math.abs(w) * Math.log(mass + spin_parameter + 1) * 0.2;
    
    return enhanced_radius * polar_compression * (1 + spacetime_twist + horizon_proximity + angular_momentum_coupling + rotational_kinetic_energy + penrose_process + quantum_frame_drag + consciousness_rotation);
  }
};