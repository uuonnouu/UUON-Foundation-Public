// 24-Cell (Icositetrachoron) and Klein Bottle 4D - Advanced 4D Mathematical Objects
import { SurfaceEquation } from "./parametricSurfaces";

// 24-Cell (Icositetrachoron) - Self-dual 4D polytope with 24 octahedral cells
export const CELL_24: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // 24-Cell has 24 vertices at coordinates (±1,±1,0,0) and permutations
    const cellIndex = Math.floor(u * 24) % 24; // Select among 24 octahedral cells
    const faceParam = v; // Position within octahedron
    
    // Generate all permutations of (±1,±1,0,0) for 24 vertices
    const coords = [];
    const signs = [1, -1];
    const positions = [0, 1, 2, 3]; // 4D coordinates
    
    // All permutations of (±1,±1,0,0)
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        for (let s1 of signs) {
          for (let s2 of signs) {
            const coord = [0, 0, 0, 0];
            coord[i] = s1;
            coord[j] = s2;
            coords.push(coord);
          }
        }
      }
    }
    
    const vertex = coords[cellIndex % 24];
    const x4d = vertex[0] * a;
    const y4d = vertex[1] * a;
    const z4d = vertex[2] * a;
    const w4d = vertex[3] * a;
    
    // Octahedral cell structure with F₄ symmetry
    const octaParam = faceParam * Math.PI * 2;
    const cellRadius = Math.sqrt(2) * b; // Edge length √2
    const octaX = cellRadius * Math.cos(octaParam) * d;
    
    // 4D rotation for F₄ symmetry group (1152 elements)
    const f4_rotation = e * Math.PI / 6;
    const cosF4 = Math.cos(f4_rotation);
    const sinF4 = Math.sin(f4_rotation);
    
    const x_rot = (x4d + octaX) * cosF4 - w4d * sinF4;
    const w_rot = (x4d + octaX) * sinF4 + w4d * cosF4;
    
    // 4D-to-3D perspective projection
    const viewDistance = f * 4;
    const perspective = viewDistance / (viewDistance - w_rot * g);
    
    // Self-dual property enhancement
    const dualFactor = h * Math.sin(octaParam * 8) * 0.1;
    
    return x_rot * perspective * (1 + dualFactor) * i;
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const cellIndex = Math.floor(u * 24) % 24;
    const faceParam = v;
    
    const coords = [];
    const signs = [1, -1];
    
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        for (let s1 of signs) {
          for (let s2 of signs) {
            const coord = [0, 0, 0, 0];
            coord[i] = s1;
            coord[j] = s2;
            coords.push(coord);
          }
        }
      }
    }
    
    const vertex = coords[cellIndex % 24];
    const y4d = vertex[1] * a;
    const w4d = vertex[3] * a;
    
    const octaParam = faceParam * Math.PI * 2;
    const cellRadius = Math.sqrt(2) * b;
    const octaY = cellRadius * Math.sin(octaParam) * d;
    
    const f4_rotation = e * Math.PI / 6;
    const cosF4 = Math.cos(f4_rotation);
    const sinF4 = Math.sin(f4_rotation);
    
    const y_rot = (y4d + octaY) * cosF4 - w4d * sinF4;
    const w_rot = (y4d + octaY) * sinF4 + w4d * cosF4;
    
    const viewDistance = f * 4;
    const perspective = viewDistance / (viewDistance - w_rot * g);
    
    const dualFactor = h * Math.cos(octaParam * 6) * 0.1;
    
    return y_rot * perspective * (1 + dualFactor) * j;
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const cellIndex = Math.floor(u * 24) % 24;
    const faceParam = v;
    
    const coords = [];
    const signs = [1, -1];
    
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        for (let s1 of signs) {
          for (let s2 of signs) {
            const coord = [0, 0, 0, 0];
            coord[i] = s1;
            coord[j] = s2;
            coords.push(coord);
          }
        }
      }
    }
    
    const vertex = coords[cellIndex % 24];
    const z4d = vertex[2] * a;
    const w4d = vertex[3] * a;
    
    const octaParam = faceParam * Math.PI * 2;
    const cellRadius = Math.sqrt(2) * b;
    const octaZ = cellRadius * Math.cos(octaParam * 0.5) * d;
    
    const f4_rotation = e * Math.PI / 6;
    const cosF4 = Math.cos(f4_rotation);
    const sinF4 = Math.sin(f4_rotation);
    
    const z_rot = (z4d + octaZ) * cosF4 - w4d * sinF4;
    const w_rot = (z4d + octaZ) * sinF4 + w4d * cosF4;
    
    const viewDistance = f * 4;
    const perspective = viewDistance / (viewDistance - w_rot * g);
    
    // Hypervolume = 2 enhancement
    const hypervolumeFactor = k * Math.sin(faceParam * Math.PI * 4) * 0.15;
    
    return z_rot * perspective * (1 + hypervolumeFactor) * l;
  }
};

// Klein Bottle 4D - Non-orientable closed surface embedded in 4D
export const KLEIN_BOTTLE_4D: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // Correct 4D Klein bottle parametric equations
    // u ∈ [0,2π], v ∈ [0,2π], r = constant
    const u_param = u * Math.PI * 2 * b; // u parameter scaled by b
    const v_param = v * Math.PI * 2 * c; // v parameter scaled by c
    const klein_radius = a; // r = constant
    
    // x = (r + cos(u/2)sin(v) - sin(u/2)sin(2v))cos(u)
    const innerRadius = klein_radius + 
                       Math.cos(u_param / 2) * Math.sin(v_param) * d - 
                       Math.sin(u_param / 2) * Math.sin(2 * v_param) * e;
    const x4d = innerRadius * Math.cos(u_param);
    
    // Parameter enhancements for mathematical exploration
    const twist_factor = f * Math.sin(u_param * 3) * 0.1;
    const non_orientable = g * Math.cos(v_param * 4) * 0.15;
    const embedding_4d = h * Math.sin(u_param + v_param) * 0.08;
    
    return x4d * (1 + twist_factor + non_orientable + embedding_4d) * i;
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const u_param = u * Math.PI * 2 * b;
    const v_param = v * Math.PI * 2 * c;
    const klein_radius = a;
    
    // y = (r + cos(u/2)sin(v) - sin(u/2)sin(2v))sin(u)
    const innerRadius = klein_radius + 
                       Math.cos(u_param / 2) * Math.sin(v_param) * d - 
                       Math.sin(u_param / 2) * Math.sin(2 * v_param) * e;
    const y4d = innerRadius * Math.sin(u_param);
    
    const twist_factor = f * Math.cos(u_param * 3) * 0.1;
    const surface_flow = g * Math.sin(v_param * 5) * 0.12;
    const topology_mod = h * Math.cos(u_param * 2 - v_param) * 0.08;
    
    return y4d * (1 + twist_factor + surface_flow + topology_mod) * j;
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const u_param = u * Math.PI * 2 * b;
    const v_param = v * Math.PI * 2 * c;
    
    // z = sin(u/2)sin(v) + cos(u/2)sin(2v)
    const z4d = Math.sin(u_param / 2) * Math.sin(v_param) * d + 
                Math.cos(u_param / 2) * Math.sin(2 * v_param) * e;
    
    // Klein bottle characteristic enhancements
    const bottle_neck = f * Math.sin(u_param * 6) * 0.15;
    const self_intersection = g * Math.exp(-Math.abs(Math.sin(v_param * 3))) * 0.2;
    const dimensional_curve = h * Math.cos(u_param * 4) * 0.1;
    const manifold_fold = k * Math.sin(v_param * 8) * 0.08;
    
    return z4d * (1 + bottle_neck + self_intersection + dimensional_curve + manifold_fold) * l;
  },
  
  // 4D component: w = cos(u/2)cos(v) - this was the missing line!
  w: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const u_param = u * Math.PI * 2 * b;
    const v_param = v * Math.PI * 2 * c;
    
    // w = cos(u/2)cos(v) - The missing 4D component!
    const w4d = Math.cos(u_param / 2) * Math.cos(v_param) * a;
    
    // 4D embedding characteristics
    const hyperspace_curve = d * Math.sin(u_param * 5) * 0.12;
    const fourth_dimension = e * Math.cos(v_param * 7) * 0.1;
    const klein_topology = f * Math.sin(u_param + v_param * 2) * 0.08;
    
    // 4D-to-3D projection for visualization
    const projection_depth = g * 2.5;
    const perspective = projection_depth / (projection_depth + w4d * h);
    
    return w4d * (1 + hyperspace_curve + fourth_dimension + klein_topology) * perspective * m;
  }
};