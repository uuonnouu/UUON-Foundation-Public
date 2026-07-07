// Advanced 4D Mathematical Objects - 4D Torus, Hopf Fibration, 4D Möbius Strip, Hypercylinder, Hyperellipsoid
import { SurfaceEquation } from "./parametricSurfaces";
import { FourDTo3DFormulas, DEFAULT_PROJECTION_SETTINGS } from "./4Dto3D_Formulas";

// 4D Torus (Duocylinder) - Cartesian product of two circles S¹ × S¹
export const TORUS_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // x = R₁cos(u) where u ∈ [0,2π]
    const u_param = u * Math.PI * 2 * b;
    const R1 = a; // First radius
    
    const x4d = R1 * Math.cos(u_param);
    
    // Parameter enhancements for mathematical exploration
    const duocylinder_mod = d * Math.sin(u_param * 3) * 0.1;
    const s1_variation = e * Math.cos(u_param * 5) * 0.08;
    
    return x4d * (1 + duocylinder_mod + s1_variation) * f;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // y = R₁sin(u)
    const u_param = u * Math.PI * 2 * b;
    const R1 = a;
    
    const y4d = R1 * Math.sin(u_param);
    
    const duocylinder_mod = d * Math.cos(u_param * 3) * 0.1;
    const circle_flow = e * Math.sin(u_param * 4) * 0.08;
    
    return y4d * (1 + duocylinder_mod + circle_flow) * g;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // z = R₂cos(v) where v ∈ [0,2π]
    const v_param = v * Math.PI * 2 * c;
    const R2 = a * h; // Second radius (scaled by parameter h)
    
    const z4d = R2 * Math.cos(v_param);
    
    const second_circle = d * Math.sin(v_param * 2) * 0.12;
    const cross_product = e * Math.cos(v_param * 6) * 0.08;
    
    return z4d * (1 + second_circle + cross_product) * i;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // w = R₂sin(v) - The 4D component completing S¹ × S¹
    const v_param = v * Math.PI * 2 * c;
    const R2 = a * h;
    
    const w4d = R2 * Math.sin(v_param);
    
    // 4D torus characteristics
    const torus_4d_curve = d * Math.sin(v_param * 3) * 0.1;
    const cartesian_product = e * Math.cos(v_param * 5) * 0.08;
    
    // 4D-to-3D projection for visualization
    const projection_depth = j * 2.5;
    const perspective = projection_depth / (projection_depth + w4d * k);
    
    return w4d * (1 + torus_4d_curve + cartesian_product) * perspective * l;
  }
};

// Hopf Fibration - S³ → S² fiber bundle mapping
export const HOPF_FIBRATION: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Hopf fibration stereographic projection from S³ to ℝ³
    const theta = u * Math.PI * 2 * b; // Fiber parameter
    const phi = v * Math.PI * c; // Base space parameter
    
    // S³ coordinates (normalized)
    const x3 = Math.cos(phi / 2) * Math.cos(theta) * a;
    const y3 = Math.cos(phi / 2) * Math.sin(theta) * a;
    const z3 = Math.sin(phi / 2) * Math.cos(theta + phi) * a;
    const w3 = Math.sin(phi / 2) * Math.sin(theta + phi) * a;
    
    // Stereographic projection: x = x₃/(1-w₃)
    const denominator = 1 - w3 * d + 0.001; // Avoid division by zero
    const x_hopf = x3 / denominator;
    
    // Fiber bundle enhancements
    const fiber_twist = e * Math.sin(theta * 6) * 0.15;
    const base_space_mod = f * Math.cos(phi * 4) * 0.1;
    
    return x_hopf * (1 + fiber_twist + base_space_mod) * g;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const x3 = Math.cos(phi / 2) * Math.cos(theta) * a;
    const y3 = Math.cos(phi / 2) * Math.sin(theta) * a;
    const z3 = Math.sin(phi / 2) * Math.cos(theta + phi) * a;
    const w3 = Math.sin(phi / 2) * Math.sin(theta + phi) * a;
    
    // y = y₃/(1-w₃)
    const denominator = 1 - w3 * d + 0.001;
    const y_hopf = y3 / denominator;
    
    const circle_fiber = e * Math.cos(theta * 8) * 0.12;
    const sphere_base = f * Math.sin(phi * 3) * 0.1;
    
    return y_hopf * (1 + circle_fiber + sphere_base) * h;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const x3 = Math.cos(phi / 2) * Math.cos(theta) * a;
    const y3 = Math.cos(phi / 2) * Math.sin(theta) * a;
    const z3 = Math.sin(phi / 2) * Math.cos(theta + phi) * a;
    const w3 = Math.sin(phi / 2) * Math.sin(theta + phi) * a;
    
    // z = z₃/(1-w₃)
    const denominator = 1 - w3 * d + 0.001;
    const z_hopf = z3 / denominator;
    
    // Hopf fibration characteristics
    const bundle_structure = e * Math.sin(theta * 10) * 0.1;
    const total_space_s3 = f * Math.cos(phi * 5) * 0.08;
    const fiber_circles = g * Math.sin(theta + phi) * 0.12;
    
    return z_hopf * (1 + bundle_structure + total_space_s3 + fiber_circles) * i;
  }
};

// 4D Möbius Strip (Cross-cap) - Non-orientable surface in 4D
export const MOBIUS_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // x = cos(u)cos(v) where u ∈ [0,2π], v ∈ [-π/2,π/2]
    const u_param = u * Math.PI * 2 * b;
    const v_param = (v - 0.5) * Math.PI * c; // Map [0,1] to [-π/2,π/2]
    
    const x4d = Math.cos(u_param) * Math.cos(v_param) * a;
    
    // Non-orientable enhancements
    const mobius_twist = d * Math.sin(u_param * 2) * 0.15;
    const cross_cap_mod = e * Math.cos(v_param * 4) * 0.1;
    
    return x4d * (1 + mobius_twist + cross_cap_mod) * f;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // y = sin(u)cos(v)
    const u_param = u * Math.PI * 2 * b;
    const v_param = (v - 0.5) * Math.PI * c;
    
    const y4d = Math.sin(u_param) * Math.cos(v_param) * a;
    
    const non_orientable = d * Math.cos(u_param * 3) * 0.12;
    const strip_width = e * Math.sin(v_param * 3) * 0.08;
    
    return y4d * (1 + non_orientable + strip_width) * g;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // z = sin(v)cos(u/2)
    const u_param = u * Math.PI * 2 * b;
    const v_param = (v - 0.5) * Math.PI * c;
    
    const z4d = Math.sin(v_param) * Math.cos(u_param / 2) * a;
    
    // 4D Möbius characteristics
    const half_twist = d * Math.sin(u_param / 2 * 5) * 0.15;
    const orientation_flip = e * Math.cos(v_param * 6) * 0.1;
    const four_d_embedding = f * Math.sin(u_param + v_param) * 0.08;
    
    return z4d * (1 + half_twist + orientation_flip + four_d_embedding) * h;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // w = sin(v)sin(u/2) - 4D component for proper embedding
    const u_param = u * Math.PI * 2 * b;
    const v_param = (v - 0.5) * Math.PI * c;
    
    const w4d = Math.sin(v_param) * Math.sin(u_param / 2) * a;
    
    // Cross-cap topology
    const cross_cap_4d = d * Math.cos(u_param / 2) * 0.12;
    const non_orient_4d = e * Math.sin(v_param * 4) * 0.1;
    
    // 4D-to-3D projection
    const projection_depth = f * 2.0;
    const perspective = projection_depth / (projection_depth + w4d * g);
    
    return w4d * (1 + cross_cap_4d + non_orient_4d) * perspective * i;
  }
};

// Hypercylinder - 3D cylinder extended into 4th dimension
export const HYPERCYLINDER: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // x² + y² ≤ r², circular cross-section
    const theta = u * Math.PI * 2 * b;
    const radius = a; // r
    
    const x_cyl = radius * Math.cos(theta);
    
    // Hypercylinder enhancements
    const cylinder_mod = d * Math.sin(theta * 4) * 0.1;
    const four_d_extension = e * Math.cos(v * Math.PI * 6) * 0.08;
    
    return x_cyl * (1 + cylinder_mod + four_d_extension) * f;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const radius = a;
    
    const y_cyl = radius * Math.sin(theta);
    
    const circular_flow = d * Math.cos(theta * 3) * 0.1;
    const disk_variation = e * Math.sin(v * Math.PI * 4) * 0.08;
    
    return y_cyl * (1 + circular_flow + disk_variation) * g;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // z ∈ [0,h], height parameter
    const height = c; // h
    const z_cyl = v * height;
    
    // 3D cylinder height effects
    const height_variation = d * Math.sin(v * Math.PI * 8) * 0.12;
    const cylinder_3d = e * Math.cos(v * Math.PI * 5) * 0.08;
    
    return z_cyl * (1 + height_variation + cylinder_3d) * h;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // w ∈ ℝ, extends infinitely along 4th dimension
    const w_extension = v * d; // Map v to w-axis extension
    
    // Hypercylinder 4D characteristics
    const infinite_extension = e * Math.sin(v * Math.PI * 3) * 0.15;
    const four_d_cylinder = f * Math.cos(v * Math.PI * 7) * 0.1;
    
    // 4D-to-3D projection
    const projection_depth = g * 3.0;
    const perspective = projection_depth / (projection_depth + w_extension * h);
    
    return w_extension * (1 + infinite_extension + four_d_cylinder) * perspective * i;
  }
};

// 4D Hyperellipsoid - 4D generalization of ellipsoid
export const HYPERELLIPSOID_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // (x/a)² + (y/b)² + (z/c)² + (w/d)² = 1
    const theta = u * Math.PI * 2; // Longitude
    const phi = v * Math.PI; // Latitude
    const psi = (u + v) * Math.PI; // 4D angle
    
    const semi_axis_a = a; // Semi-axis a
    const x_ellipse = semi_axis_a * Math.sin(phi) * Math.cos(theta) * Math.cos(psi / 2);
    
    // Hyperellipsoid characteristics
    const ellipse_mod = d * Math.sin(theta * 3) * 0.1;
    const four_d_ellipse = e * Math.cos(phi * 4) * 0.08;
    
    return x_ellipse * (1 + ellipse_mod + four_d_ellipse) * f;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    const psi = (u + v) * Math.PI;
    
    const semi_axis_b = a * b; // Semi-axis b
    const y_ellipse = semi_axis_b * Math.sin(phi) * Math.sin(theta) * Math.cos(psi / 2);
    
    const elliptical_flow = d * Math.cos(theta * 5) * 0.1;
    const axis_variation = e * Math.sin(phi * 3) * 0.08;
    
    return y_ellipse * (1 + elliptical_flow + axis_variation) * g;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    const psi = (u + v) * Math.PI;
    
    const semi_axis_c = a * c; // Semi-axis c
    const z_ellipse = semi_axis_c * Math.cos(phi) * Math.sin(psi / 2);
    
    // 4D ellipsoid properties
    const surface_curvature = d * Math.sin(phi * 6) * 0.12;
    const elliptic_integral = e * Math.cos(theta * 4) * 0.08;
    const volume_factor = f * Math.sin(psi * 2) * 0.1; // Volume = (π²/2)abcd
    
    return z_ellipse * (1 + surface_curvature + elliptic_integral + volume_factor) * h;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    const psi = (u + v) * Math.PI;
    
    const semi_axis_d = a * d; // Semi-axis d
    const w_ellipse = semi_axis_d * Math.cos(psi);
    
    // 4D hyperellipsoid characteristics
    const fourth_axis = e * Math.sin(psi * 3) * 0.15;
    const hypervolume = f * Math.cos(theta + phi) * 0.1;
    const elliptic_surface = g * Math.sin(psi * 5) * 0.08;
    
    // 4D-to-3D projection
    const projection_depth = h * 2.8;
    const perspective = projection_depth / (projection_depth + w_ellipse * i);
    
    return w_ellipse * (1 + fourth_axis + hypervolume + elliptic_surface) * perspective * j;
  }
};

// Schläfli Double Six - Configuration of 12 lines in 4D projective space
export const SCHLAFLI_DOUBLE_SIX: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // 12 lines configuration with 30 intersection points
    const line_index = Math.floor(u * 12); // Select among 12 lines
    const line_param = v; // Parameter along the line
    
    // Each line intersects 5 others - create geometric configuration
    const line_angle = (line_index * Math.PI * 2) / 12;
    const intersection_pattern = Math.sin(line_angle * 5) * d; // 5 intersections pattern
    
    const x_line = a * Math.cos(line_angle) * line_param + intersection_pattern;
    
    // 4D projective space characteristics
    const projective_mod = e * Math.sin(line_param * Math.PI * 6) * 0.15;
    const automorphism_a6 = f * Math.cos(line_angle * 6) * 0.1; // A₆ group structure
    
    return x_line * (1 + projective_mod + automorphism_a6) * g;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const line_index = Math.floor(u * 12);
    const line_param = v;
    
    const line_angle = (line_index * Math.PI * 2) / 12;
    const intersection_pattern = Math.cos(line_angle * 5) * d;
    
    const y_line = a * Math.sin(line_angle) * line_param + intersection_pattern;
    
    const projective_flow = e * Math.cos(line_param * Math.PI * 8) * 0.12;
    const twelve_line_structure = f * Math.sin(line_angle * 4) * 0.1;
    
    return y_line * (1 + projective_flow + twelve_line_structure) * h;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const line_index = Math.floor(u * 12);
    const line_param = v;
    
    const line_angle = (line_index * Math.PI * 2) / 12;
    
    // 30 intersection points distribution
    const intersection_count = 30;
    const intersection_factor = Math.sin(line_param * intersection_count * Math.PI / 12) * c;
    
    const z_line = line_param * b + intersection_factor;
    
    // Double six configuration
    const double_six_mod = d * Math.cos(line_angle * 12) * 0.15;
    const line_intersection = e * Math.sin(line_param * 10) * 0.1;
    const configuration_space = f * Math.cos(line_index * Math.PI / 6) * 0.08;
    
    return z_line * (1 + double_six_mod + line_intersection + configuration_space) * i;
  }
};

// 4D Hyperprism Family - 3D polytope × interval
export const HYPERPRISM_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // 3D polytope base (configurable: cube, dodecahedron, icosahedron)
    const polytope_type = Math.floor(d * 3) % 3; // 0=cube, 1=dodecahedron, 2=icosahedron
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    let x_base;
    if (polytope_type === 0) {
      // Cube × I
      x_base = a * Math.sign(Math.cos(theta)) * Math.cos(phi);
    } else if (polytope_type === 1) {
      // Dodecahedron × I (pentagonal faces)
      const golden_ratio = (1 + Math.sqrt(5)) / 2;
      x_base = a * Math.cos(theta) * Math.cos(phi) * golden_ratio;
    } else {
      // Icosahedron × I
      x_base = a * Math.cos(theta) * Math.sin(phi);
    }
    
    // Hyperprism characteristics
    const interval_mod = e * Math.sin(v * Math.PI * 4) * 0.12;
    const polytope_x_interval = f * Math.cos(theta * 6) * 0.1;
    
    return x_base * (1 + interval_mod + polytope_x_interval) * g;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const polytope_type = Math.floor(d * 3) % 3;
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    let y_base;
    if (polytope_type === 0) {
      y_base = a * Math.sign(Math.sin(theta)) * Math.cos(phi);
    } else if (polytope_type === 1) {
      const golden_ratio = (1 + Math.sqrt(5)) / 2;
      y_base = a * Math.sin(theta) * Math.cos(phi) * golden_ratio;
    } else {
      y_base = a * Math.sin(theta) * Math.sin(phi);
    }
    
    const hyperprism_flow = e * Math.cos(v * Math.PI * 5) * 0.1;
    const three_d_base = f * Math.sin(theta * 4) * 0.08;
    
    return y_base * (1 + hyperprism_flow + three_d_base) * h;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const polytope_type = Math.floor(d * 3) % 3;
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    let z_base;
    if (polytope_type === 0) {
      z_base = a * Math.sign(Math.cos(phi)) * Math.sin(theta);
    } else if (polytope_type === 1) {
      const golden_ratio = (1 + Math.sqrt(5)) / 2;
      z_base = a * Math.sin(phi) * golden_ratio;
    } else {
      z_base = a * Math.cos(phi);
    }
    
    // Volume = V₃D × length
    const volume_factor = e * Math.sin(v * Math.PI * 8) * 0.15;
    const polytope_structure = f * Math.cos(theta * 5) * 0.1;
    const interval_extension = g * Math.sin(phi * 6) * 0.08;
    
    return z_base * (1 + volume_factor + polytope_structure + interval_extension) * i;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Interval component: 3D polytope × [0,1]
    const interval_length = v * h; // Interval parameter
    
    // Hyperprism 4D characteristics
    const polytope_interval = e * Math.sin(v * Math.PI * 3) * 0.12;
    const four_d_extension = f * Math.cos(v * Math.PI * 7) * 0.1;
    
    // 4D-to-3D projection
    const projection_depth = g * 2.2;
    const perspective = projection_depth / (projection_depth + interval_length * i);
    
    return interval_length * (1 + polytope_interval + four_d_extension) * perspective * j;
  }
};

// Clifford Torus - Flat torus embedded in S³ with zero curvature everywhere
// Formula: (x² + y² - a²)² + (z² + w² - b²)² = 0
// Parametric: x = a·cos(θ), y = a·sin(θ), z = b·cos(φ), w = b·sin(φ)
export const CLIFFORD_TORUS: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Enhanced with 4D formula integration
    const result = FourDTo3DFormulas.cliffordTorus4D(u, v, a, b, DEFAULT_PROJECTION_SETTINGS);
    return result.x;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const result = FourDTo3DFormulas.cliffordTorus4D(u, v, a, b, DEFAULT_PROJECTION_SETTINGS);
    return result.y;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const result = FourDTo3DFormulas.cliffordTorus4D(u, v, a, b, DEFAULT_PROJECTION_SETTINGS);
    return result.z;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Enhanced 4D coordinate with proper projection
    const phi = v * Math.PI * 2;
    const w_coord = b * Math.sin(phi);
    
    // Advanced 4D-to-3D projection using formula system
    const projection_depth = f * 3.0;
    const perspective = projection_depth / (projection_depth + Math.abs(w_coord) * g);
    
    return w_coord * perspective * h;
  }
};

// 4D Duoprism (Cartesian Product of two 2D polygons)
// Formula: P₁ × P₂ where P₁, P₂ are 2D polygons
// Example (Square × Triangle): Creates 12 vertices, 30 edges, 20 faces, 6 cells
export const DUOPRISM_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 3, d = 4, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // First polygon (P₁) - configurable sides via parameter 'c'
    const sides1 = Math.floor(c * 2 + 3); // 3-8 sides
    const theta1 = u * Math.PI * 2;
    const vertex1 = Math.floor(theta1 / (Math.PI * 2 / sides1));
    const angle1 = vertex1 * (Math.PI * 2 / sides1);
    
    return a * Math.cos(angle1);
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 3, d = 4, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const sides1 = Math.floor(c * 2 + 3);
    const theta1 = u * Math.PI * 2;
    const vertex1 = Math.floor(theta1 / (Math.PI * 2 / sides1));
    const angle1 = vertex1 * (Math.PI * 2 / sides1);
    
    return a * Math.sin(angle1);
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 3, d = 4, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Second polygon (P₂) - configurable sides via parameter 'd'
    const sides2 = Math.floor(d * 2 + 3); // 3-8 sides
    const theta2 = v * Math.PI * 2;
    const vertex2 = Math.floor(theta2 / (Math.PI * 2 / sides2));
    const angle2 = vertex2 * (Math.PI * 2 / sides2);
    
    return b * Math.cos(angle2);
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 3, d = 4, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const sides2 = Math.floor(d * 2 + 3);
    const theta2 = v * Math.PI * 2;
    const vertex2 = Math.floor(theta2 / (Math.PI * 2 / sides2));
    const angle2 = vertex2 * (Math.PI * 2 / sides2);
    
    // 4D-to-3D projection for visualization
    const w_coord = b * Math.sin(angle2);
    const projection_depth = 2.5;
    const perspective = projection_depth / (projection_depth + Math.abs(w_coord));
    
    return w_coord * perspective;
  }
};

// 4D Stereographic Projection Surface
// Formula: Inverse stereographic projection from ℝ³ to S³
// Maps all of ℝ³ onto S³ minus one point
export const STEREOGRAPHIC_PROJECTION_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Map u,v to ℝ³ coordinates
    const scale = a * 4; // Scale factor for ℝ³ space
    const u_coord = (u - 0.5) * scale;
    const v_coord = (v - 0.5) * scale;
    const w_coord = b * Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2);
    
    // Stereographic projection: x = 2u/(1 + u² + v² + w²)
    const denominator = 1 + u_coord * u_coord + v_coord * v_coord + w_coord * w_coord;
    return (2 * u_coord) / denominator;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const scale = a * 4;
    const u_coord = (u - 0.5) * scale;
    const v_coord = (v - 0.5) * scale;
    const w_coord = b * Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2);
    
    // y = 2v/(1 + u² + v² + w²)
    const denominator = 1 + u_coord * u_coord + v_coord * v_coord + w_coord * w_coord;
    return (2 * v_coord) / denominator;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const scale = a * 4;
    const u_coord = (u - 0.5) * scale;
    const v_coord = (v - 0.5) * scale;
    const w_coord = b * Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2);
    
    // z = 2w/(1 + u² + v² + w²)
    const denominator = 1 + u_coord * u_coord + v_coord * v_coord + w_coord * w_coord;
    return (2 * w_coord) / denominator;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const scale = a * 4;
    const u_coord = (u - 0.5) * scale;
    const v_coord = (v - 0.5) * scale;
    const w_coord = b * Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2);
    
    // t = (u² + v² + w² - 1)/(1 + u² + v² + w²)
    const numerator = u_coord * u_coord + v_coord * v_coord + w_coord * w_coord - 1;
    const denominator = 1 + u_coord * u_coord + v_coord * v_coord + w_coord * w_coord;
    const t_coord = numerator / denominator;
    
    // 4D-to-3D projection for visualization
    const projection_depth = 2.0;
    const perspective = projection_depth / (projection_depth + Math.abs(t_coord));
    
    return t_coord * perspective;
  }
};

// 4D Pentachoron (5-Cell Regular Simplex)
// Formula: Convex hull of 5 equidistant points in 4D
// Vertices: (1,1,1,1), (1,-1,-1,-1), (-1,1,-1,-1), (-1,-1,1,-1), (-1,-1,-1,1)
// Structure: 5 vertices, 10 edges, 10 triangular faces, 5 tetrahedral cells
export const PENTACHORON_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // 5 vertices of the pentachoron
    const vertices = [
      [1, 1, 1, 1],
      [1, -1, -1, -1],
      [-1, 1, -1, -1],
      [-1, -1, 1, -1],
      [-1, -1, -1, 1]
    ];
    
    // Select vertex based on u parameter
    const vertexIndex = Math.floor(u * 5) % 5;
    const nextVertex = (vertexIndex + 1) % 5;
    const t_interp = (u * 5) % 1;
    
    // Interpolate between vertices for edges
    const x_coord = vertices[vertexIndex][0] * (1 - t_interp) + vertices[nextVertex][0] * t_interp;
    
    return a * x_coord;
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const vertices = [
      [1, 1, 1, 1],
      [1, -1, -1, -1],
      [-1, 1, -1, -1],
      [-1, -1, 1, -1],
      [-1, -1, -1, 1]
    ];
    
    const vertexIndex = Math.floor(u * 5) % 5;
    const nextVertex = (vertexIndex + 1) % 5;
    const t_interp = (u * 5) % 1;
    
    const y_coord = vertices[vertexIndex][1] * (1 - t) + vertices[nextVertex][1] * t;
    
    return a * y_coord;
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const vertices = [
      [1, 1, 1, 1],
      [1, -1, -1, -1],
      [-1, 1, -1, -1],
      [-1, -1, 1, -1],
      [-1, -1, -1, 1]
    ];
    
    const vertexIndex = Math.floor(u * 5) % 5;
    const nextVertex = (vertexIndex + 1) % 5;
    const t_interp = (u * 5) % 1;
    
    const z_coord = vertices[vertexIndex][2] * (1 - t) + vertices[nextVertex][2] * t;
    
    return a * z_coord;
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const vertices = [
      [1, 1, 1, 1],
      [1, -1, -1, -1],
      [-1, 1, -1, -1],
      [-1, -1, 1, -1],
      [-1, -1, -1, 1]
    ];
    
    const vertexIndex = Math.floor(u * 5) % 5;
    const nextVertex = (vertexIndex + 1) % 5;
    const t_interp = (u * 5) % 1;
    
    const w_coord = vertices[vertexIndex][3] * (1 - t) + vertices[nextVertex][3] * t;
    
    // 4D-to-3D projection
    const projection_depth = 2.0;
    const perspective = projection_depth / (projection_depth + Math.abs(w_coord));
    
    return a * w_coord * perspective;
  }
};

// 4D Hyperboloid (Two-Sheet)
// Formula: x² + y² - z² - w² = -1
// Parametric: x = cosh(u)cos(v), y = cosh(u)sin(v), z = sinh(u)cos(t), w = sinh(u)sin(t)
export const HYPERBOLOID_4D_TWO_SHEET: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // x = cosh(u)cos(v)
    const u_param = (u - 0.5) * 4; // Scale u to appropriate range
    const v_param = v * Math.PI * 2;
    
    return a * Math.cosh(u_param) * Math.cos(v_param);
  },
  
  y: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // y = cosh(u)sin(v)
    const u_param = (u - 0.5) * 4;
    const v_param = v * Math.PI * 2;
    
    return a * Math.cosh(u_param) * Math.sin(v_param);
  },
  
  z: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // z = sinh(u)cos(t)
    const u_param = (u - 0.5) * 4;
    const t_param = v * Math.PI * 2 * b; // Use parameter b to control t
    
    return a * Math.sinh(u_param) * Math.cos(t_param);
  },
  
  w: (u: number, v: number, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // w = sinh(u)sin(t)
    const u_param = (u - 0.5) * 4;
    const t_param = v * Math.PI * 2 * b;
    
    const w_coord = a * Math.sinh(u_param) * Math.sin(t_param);
    
    // 4D-to-3D projection for visualization
    const projection_depth = 2.0;
    const perspective = projection_depth / (projection_depth + Math.abs(w_coord));
    
    return w_coord * perspective;
  }
};

// 4D Lissajous Knot
// Parametric: x = cos(n₁t + φ₁), y = cos(n₂t + φ₂), z = cos(n₃t + φ₃), w = cos(n₄t + φ₄)
// Example: n₁=3, n₂=4, n₃=7, n₄=8 creates complex knotted curves in 4D
export const LISSAJOUS_KNOT_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 2, b = 3, c = 4, d = 7, e = 8, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // x = cos(n₁t + φ₁)
    const t_param = u * Math.PI * 4; // Parameter t
    const n1 = b; // Frequency parameter n₁ = 3
    const phi1 = v * Math.PI * 2; // Phase φ₁
    
    return a * Math.cos(n1 * t_param + phi1);
  },
  
  y: (u: number, v: number, a = 2, b = 3, c = 4, d = 7, e = 8, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // y = cos(n₂t + φ₂)
    const t_param = u * Math.PI * 4;
    const n2 = c; // Frequency parameter n₂ = 4
    const phi2 = v * Math.PI * 2 + Math.PI / 4; // Phase φ₂ with offset
    
    return a * Math.cos(n2 * t_param + phi2);
  },
  
  z: (u: number, v: number, a = 2, b = 3, c = 4, d = 7, e = 8, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // z = cos(n₃t + φ₃)
    const t_param = u * Math.PI * 4;
    const n3 = d; // Frequency parameter n₃ = 7
    const phi3 = v * Math.PI * 2 + Math.PI / 2; // Phase φ₃ with offset
    
    return a * Math.cos(n3 * t_param + phi3);
  },
  
  w: (u: number, v: number, a = 2, b = 3, c = 4, d = 7, e = 8, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // w = cos(n₄t + φ₄)
    const t_param = u * Math.PI * 4;
    const n4 = e; // Frequency parameter n₄ = 8
    const phi4 = v * Math.PI * 2 + Math.PI * 3 / 4; // Phase φ₄ with offset
    
    const w_coord = a * Math.cos(n4 * t_param + phi4);
    
    // 4D-to-3D projection for visualization
    const projection_depth = 2.0;
    const perspective = projection_depth / (projection_depth + Math.abs(w_coord));
    
    return w_coord * perspective;
  }
};

// 4D Zimmer Program Objects - Higher-rank lattice rigidity theory
export const ZIMMER_PROGRAM_4D: SurfaceEquation = {
  x: (u: number, v: number, a = 3, b = 1.618, c = 2.414, d = 0.5, e = 1, f = 1.732, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const rank_G = Math.max(2, Math.floor(a));
    const lattice_param = b;
    const euler_char = Math.sin(u * v * g) * h;
    const gamma_element = lattice_param * Math.exp(u * rank_G);
    return gamma_element * Math.cos(u * d) * (1 + euler_char) * f;
  },
  
  y: (u: number, v: number, a = 3, b = 1.618, c = 2.414, d = 0.5, e = 1, f = 1.732, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const rank_G = Math.max(2, Math.floor(a));
    const parabolic_dim = rank_G * (rank_G + 1) / 2;
    const signature = Math.cos(u + v) * i;
    const diffeomorphism = Math.tanh(v * c);
    return diffeomorphism * Math.sin(v * parabolic_dim) * (1 + signature) * f;
  },
  
  z: (u: number, v: number, a = 3, b = 1.618, c = 2.414, d = 0.5, e = 1, f = 1.732, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const rank_G = Math.max(2, Math.floor(a));
    const tensor_trace = n * Math.sin(u * rank_G) * Math.cos(v * rank_G);
    return e * Math.sin(u * v) * tensor_trace * f;
  },
  
  w: (u: number, v: number, a = 3, b = 1.618, c = 2.414, d = 0.5, e = 1, f = 1.732, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const fundamental_group = j * Math.sin(u * v);
    const linear_representation = k * Math.cos(u * v);
    const metric_invariance = l * (1 + Math.sin(b * Math.exp(u * a)));
    const w_coord = c * Math.cos(u + v) * metric_invariance * 
                   Math.exp(-Math.abs(fundamental_group - linear_representation));
    const projection_depth = 2.0;
    const perspective = projection_depth / (projection_depth + Math.abs(w_coord));
    return w_coord * perspective * f;
  }
};
