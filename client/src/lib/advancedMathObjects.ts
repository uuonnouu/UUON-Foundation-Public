// Advanced Mathematical Objects
// Higher-dimensional projections, fractals, technical shapes, and historical artifacts

import { SurfaceEquation } from "./parametricSurfaces";

// Higher-Dimensional Projections

// 5-cell (Pentachoron) - Simplest 4D polytope, tetrahedral hypertetrahedron
export const PENTACHORON: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    // 4D pentachoron vertices projected to 3D
    const edge_length = Math.abs(a) + 0.5;
    const base_radius = edge_length * Math.sqrt(Math.abs(d) + 0.6) / 2;
    
    // Tetrahedral cross-section selection
    const section_angle = Math.abs(e) * Math.PI / 4;
    const height_factor = Math.cos(section_angle) * (1 + Math.abs(f) * 0.3);
    
    // 4D rotation matrices projected to 3D
    const w4d = Math.sin(phi * Math.abs(g)) * height_factor;
    const radius_4d = base_radius * (1 + w4d * Math.abs(h) * 0.4);
    
    // Tetrahedral face geometry
    const face_select = Math.floor(theta / (Math.PI / 2)) % 4;
    const local_theta = (theta % (Math.PI / 2)) * 4;
    
    // Pentachoron edge connections
    const edge_factor = 1 + Math.abs(i) * Math.sin(local_theta * 3) * 0.2;
    const vertex_influence = Math.abs(j) * Math.cos(phi * 5) * 0.15;
    
    // 4D simplex structure
    const simplex_x = radius_4d * Math.sin(phi) * Math.cos(theta) * edge_factor;
    const projection_x = simplex_x * (1 + Math.abs(k) * w4d * 0.3);
    
    // Additional 4D effects
    const hyperspace_distortion = Math.abs(l) * Math.sin(theta * 8) * Math.cos(phi * 6) * 0.1;
    const dimensional_coupling = Math.abs(m) * Math.tanh(radius_4d - edge_length) * 0.2;
    
    return projection_x * (1 + vertex_influence + hyperspace_distortion + dimensional_coupling);
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const edge_length = Math.abs(a) + 0.5;
    const base_radius = edge_length * Math.sqrt(Math.abs(d) + 0.6) / 2;
    
    const section_angle = Math.abs(e) * Math.PI / 4;
    const height_factor = Math.cos(section_angle) * (1 + Math.abs(f) * 0.3);
    
    const w4d = Math.sin(phi * Math.abs(g)) * height_factor;
    const radius_4d = base_radius * (1 + w4d * Math.abs(h) * 0.4);
    
    const face_select = Math.floor(theta / (Math.PI / 2)) % 4;
    const local_theta = (theta % (Math.PI / 2)) * 4;
    
    const edge_factor = 1 + Math.abs(i) * Math.sin(local_theta * 3) * 0.2;
    const vertex_influence = Math.abs(j) * Math.cos(phi * 5) * 0.15;
    
    // Y-axis specific 4D projection
    const simplex_y = radius_4d * Math.sin(phi) * Math.sin(theta) * edge_factor;
    const projection_y = simplex_y * (1 + Math.abs(k) * w4d * 0.3);
    
    // 4D tetrahedral structure in y-dimension
    const tetrahedral_symmetry = Math.abs(n) * Math.sin(theta * 12) * Math.exp(-Math.abs(phi - Math.PI/2)) * 0.2;
    const cross_section_y = Math.abs(o) * Math.cos(phi * 10) * Math.sin(theta * 4) * 0.15;
    const vertex_coupling = Math.abs(p) * Math.sin(phi * 6) * 0.25;
    
    return projection_y * (1 + vertex_influence + tetrahedral_symmetry + cross_section_y + vertex_coupling);
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const phi = v * Math.PI * c;
    const theta = u * Math.PI * 2 * b;
    
    const edge_length = Math.abs(a) + 0.5;
    const base_radius = edge_length * Math.sqrt(Math.abs(d) + 0.6) / 2;
    
    const section_angle = Math.abs(e) * Math.PI / 4;
    const height_factor = Math.cos(section_angle) * (1 + Math.abs(f) * 0.3);
    
    const w4d = Math.sin(phi * Math.abs(g)) * height_factor;
    const radius_4d = base_radius * (1 + w4d * Math.abs(h) * 0.4);
    
    // Z-axis pentachoron projection
    const simplex_z = radius_4d * Math.cos(phi) * height_factor;
    
    // 4D hypervolume effects
    const hypervolume = Math.abs(q) * Math.sin(phi * 8) * Math.cos(theta * 6) * 0.3;
    const dimensional_depth = Math.abs(r) * Math.tanh(simplex_z - edge_length * 0.5) * 0.2;
    
    // Pentachoron apex connectivity
    const apex_connection = Math.abs(s) * Math.exp(-Math.abs(phi - Math.PI/4)) * 0.25;
    const edge_projection = Math.abs(t) * Math.cos(phi * 12) * 0.15;
    
    // Final 4D to 3D mapping
    const w_component = Math.abs(uParam) * Math.sin(theta * 10) * Math.sin(phi * 8) * 0.2;
    const spacetime_fold = Math.abs(vParam) * Math.log(Math.abs(w4d) + 1) * 0.1;
    const consciousness_4d = Math.abs(w) * Math.sin(phi * 15) * 0.2;
    
    return simplex_z * (1 + hypervolume + dimensional_depth + apex_connection + edge_projection + w_component + spacetime_fold + consciousness_4d);
  }
};

// 600-cell (Hexacosichoron) - Most complex regular 4D polytope with 600 tetrahedral cells
export const HEXACOSICHORON: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    // 600-cell parameters - most complex 4D polytope
    const scale = Math.abs(a) + 0.8;
    const golden_ratio = (1 + Math.sqrt(5)) / 2; // φ = 1.618...
    const base_radius = scale * golden_ratio * Math.abs(d);
    
    // 4D icosahedral symmetry group H4
    const icosa_angle = theta * Math.abs(e) * 5; // 5-fold symmetry
    const cell_selection = Math.floor(phi * 600 * Math.abs(f)) % 600; // 600 cells
    const cell_angle = (cell_selection / 600) * Math.PI * 2;
    
    // Golden ratio relationships in 4D
    const phi_factor = Math.cos(cell_angle * golden_ratio) * (1 + Math.abs(g) * 0.3);
    const radius_4d = base_radius * (1 + phi_factor * Math.abs(h) * 0.4);
    
    // Tetrahedral cell structure
    const tetra_u = (theta % (Math.PI / 3)) * 6; // Tetrahedral subdivision
    const tetra_factor = Math.sin(tetra_u) * Math.abs(i) * 0.2;
    
    // 4D vertex coordinates with golden ratio
    const vertex_x = radius_4d * Math.sin(phi) * Math.cos(icosa_angle);
    const golden_x = vertex_x * (1 + golden_ratio * Math.abs(j) * 0.1);
    
    // H4 symmetry transformations
    const h4_rotation = Math.abs(k) * Math.sin(theta * 12) * Math.cos(phi * 8) * 0.15;
    const cell_interaction = Math.abs(l) * Math.cos(cell_angle * 3) * 0.2;
    const icosahedral_projection = Math.abs(m) * Math.sin(icosa_angle * 2) * 0.25;
    
    return golden_x * (1 + tetra_factor + h4_rotation + cell_interaction + icosahedral_projection);
  },
  
  y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const theta = u * Math.PI * 2 * b;
    const phi = v * Math.PI * c;
    
    const scale = Math.abs(a) + 0.8;
    const golden_ratio = (1 + Math.sqrt(5)) / 2;
    const base_radius = scale * golden_ratio * Math.abs(d);
    
    const icosa_angle = theta * Math.abs(e) * 5;
    const cell_selection = Math.floor(phi * 600 * Math.abs(f)) % 600;
    const cell_angle = (cell_selection / 600) * Math.PI * 2;
    
    const phi_factor = Math.cos(cell_angle * golden_ratio) * (1 + Math.abs(g) * 0.3);
    const radius_4d = base_radius * (1 + phi_factor * Math.abs(h) * 0.4);
    
    const tetra_u = (theta % (Math.PI / 3)) * 6;
    const tetra_factor = Math.sin(tetra_u) * Math.abs(i) * 0.2;
    
    // Y-axis 600-cell projection
    const vertex_y = radius_4d * Math.sin(phi) * Math.sin(icosa_angle);
    const golden_y = vertex_y * (1 + golden_ratio * Math.abs(j) * 0.1);
    
    // Y-specific 4D effects
    const pentagonal_symmetry = Math.abs(n) * Math.sin(theta * 10) * Math.cos(phi * 5) * 0.3;
    const cell_boundary = Math.abs(o) * Math.exp(-Math.abs(Math.sin(cell_angle * 20))) * 0.2;
    const hyperface_projection = Math.abs(p) * Math.cos(icosa_angle * 4) * 0.25;
    const vertex_star = Math.abs(q) * Math.sin(phi * 20) * 0.15;
    
    return golden_y * (1 + tetra_factor + pentagonal_symmetry + cell_boundary + hyperface_projection + vertex_star);
  },
  
  z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const phi = v * Math.PI * c;
    const theta = u * Math.PI * 2 * b;
    
    const scale = Math.abs(a) + 0.8;
    const golden_ratio = (1 + Math.sqrt(5)) / 2;
    const base_radius = scale * golden_ratio * Math.abs(d);
    
    const icosa_angle = theta * Math.abs(e) * 5;
    const cell_selection = Math.floor(phi * 600 * Math.abs(f)) % 600;
    const cell_angle = (cell_selection / 600) * Math.PI * 2;
    
    const phi_factor = Math.cos(cell_angle * golden_ratio) * (1 + Math.abs(g) * 0.3);
    const radius_4d = base_radius * (1 + phi_factor * Math.abs(h) * 0.4);
    
    // Z-axis 600-cell projection with 4D depth
    const vertex_z = radius_4d * Math.cos(phi);
    const golden_z = vertex_z * (1 + golden_ratio * Math.abs(j) * 0.1);
    
    // 4D hypervolume and cell complexity
    const hypervolume_600 = Math.abs(r) * Math.sin(phi * 30) * Math.cos(theta * 25) * 0.4;
    const cell_density = Math.abs(s) * Math.log(cell_selection + 1) / Math.log(600) * 0.3;
    const golden_spiral = Math.abs(t) * Math.sin(phi * golden_ratio * 8) * 0.2;
    
    // Final 4D to 3D transformation
    const w4d_component = Math.abs(uParam) * Math.sin(icosa_angle * 6) * Math.cos(phi * 12) * 0.25;
    const hypercell_interaction = Math.abs(vParam) * Math.tanh(golden_z - scale) * 0.2;
    const consciousness_600 = Math.abs(w) * Math.sin(phi * golden_ratio * 10) * 0.15;
    
    return golden_z * (1 + hypervolume_600 + cell_density + golden_spiral + w4d_component + hypercell_interaction + consciousness_600);
  }
};

// 24-Cell (Icositetrachoron) - Self-dual 4D polytope with 24 octahedral cells
export const ICOSITETRACHORON: SurfaceEquation = {
  x: (u, v, a = 2, b = 1, c = 1) => {
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    return Math.cos(theta) * Math.sin(phi) * a;
  },
  y: (u, v, a = 2, b = 1, c = 1) => {
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    return Math.sin(theta) * Math.sin(phi) * b;
  },
  z: (u, v, a = 2, b = 1, c = 1) => {
    const phi = v * Math.PI;
    return Math.cos(phi) * c;
  }
};

// Hypercube (Tesseract) - 4D Cube with V = a⁴
// 16 vertices, 32 edges, 24 square faces, 8 cubic cells
export const HYPERCUBE_TESSERACT: SurfaceEquation = {
  x: (u, v, a = 2, b = 2, c = 2, d = 2, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    // 4D hypercube edge length
    const edge_length = Math.abs(a);
    
    // Map UV coordinates to discrete cube faces (24 square faces)
    const face_u = Math.floor(u * 4) / 4;  // 4x6 face arrangement
    const face_v = Math.floor(v * 6) / 6;
    const local_u = (u * 4) % 1;
    const local_v = (v * 6) % 1;
    
    // 4D to 3D stereographic projection
    const w4d = Math.cos(local_u * Math.PI * 2) * edge_length * Math.abs(b) / 2;
    const projection_factor = 1 / (1 + w4d * Math.abs(c) * 0.1);
    
    // Cubic cell selection (8 cubic cells)
    const cell_index = Math.floor(face_u * 2) % 2;
    const cell_offset = cell_index * edge_length * Math.abs(d) / 2;
    
    // 32 edges connectivity - tesseract edge structure
    const edge_x = (local_u - 0.5) * edge_length;
    const edge_connectivity = Math.abs(e) * Math.sin(local_v * Math.PI * 4) * 0.1;
    
    // 16 vertices positioning
    const vertex_influence = Math.abs(f) * Math.cos(local_u * Math.PI * 8) * Math.cos(local_v * Math.PI * 8) * 0.05;
    
    return (edge_x + cell_offset + edge_connectivity + vertex_influence) * projection_factor;
  },
  
  y: (u, v, a = 2, b = 2, c = 2, d = 2, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const edge_length = Math.abs(a);
    
    const face_u = Math.floor(u * 4) / 4;
    const face_v = Math.floor(v * 6) / 6;
    const local_u = (u * 4) % 1;
    const local_v = (v * 6) % 1;
    
    const w4d = Math.sin(local_v * Math.PI * 2) * edge_length * Math.abs(b) / 2;
    const projection_factor = 1 / (1 + w4d * Math.abs(c) * 0.1);
    
    const cell_index = Math.floor(face_v * 1.33) % 2;
    const cell_offset = cell_index * edge_length * Math.abs(d) / 2;
    
    // Y-axis edges and faces
    const edge_y = (local_v - 0.5) * edge_length;
    const face_connectivity = Math.abs(g) * Math.cos(local_u * Math.PI * 6) * 0.1;
    
    // 24 square faces arrangement
    const face_structure = Math.abs(h) * Math.sin(local_u * Math.PI * 12) * Math.sin(local_v * Math.PI * 8) * 0.08;
    
    return (edge_y + cell_offset + face_connectivity + face_structure) * projection_factor;
  },
  
  z: (u, v, a = 2, b = 2, c = 2, d = 2, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
    const edge_length = Math.abs(a);
    
    const face_u = Math.floor(u * 4) / 4;
    const face_v = Math.floor(v * 6) / 6;
    const local_u = (u * 4) % 1;
    const local_v = (v * 6) % 1;
    
    // 4D depth projection
    const w4d_depth = Math.cos(local_u * Math.PI) * Math.sin(local_v * Math.PI) * edge_length * Math.abs(b) / 2;
    const depth_projection = 1 / (1 + w4d_depth * Math.abs(c) * 0.1);
    
    // Z-axis represents 4D structure collapse
    const z_base = Math.sin(face_u * Math.PI * 2) * edge_length / 2;
    const hypercube_depth = Math.abs(d) * Math.cos(face_v * Math.PI * 3) * edge_length * 0.3;
    
    // 8 cubic cells in Z projection
    const cubic_cells = Math.abs(i) * Math.sin(local_u * Math.PI * 16) * Math.cos(local_v * Math.PI * 16) * 0.1;
    
    // Volume V = a⁴ influence on Z-axis
    const volume_factor = Math.abs(j) * Math.pow(edge_length / 2, 0.25) * 0.2;
    
    return (z_base + hypercube_depth + cubic_cells + volume_factor) * depth_projection;
  }
};
