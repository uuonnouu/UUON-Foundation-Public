import { SurfaceEquation } from './parametricSurfaces';

/**
 * Group Theory Visualizations
 * Mathematical symmetry groups and their geometric manifestations
 */

export const GROUP_THEORY: Record<string, SurfaceEquation> = {
  // Perfect Icosahedron - 20 triangular faces with icosahedral symmetry group I_h
  icosahedron_group: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      // Golden ratio φ = (1 + √5) / 2 ≈ 1.618034
      const phi = (1 + Math.sqrt(5)) / 2;
      
      // Icosahedron vertices using golden ratio coordinates
      const vertices = [
        // Rectangle in xy-plane
        [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
        // Rectangle in yz-plane  
        [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
        // Rectangle in zx-plane
        [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
      ];
      
      // Face triangulation for 20 triangular faces
      const faceIndex = Math.floor(u * 20) % 20;
      const faceProgress = (u * 20) % 1;
      
      // Icosahedral face connections (each face is an equilateral triangle)
      const faces = [
        [0, 1, 4], [1, 9, 4], [4, 9, 5], [5, 9, 11], [5, 11, 2],
        [11, 7, 2], [7, 3, 2], [3, 2, 6], [2, 6, 8], [6, 8, 10],
        [8, 10, 1], [1, 10, 0], [0, 10, 6], [6, 7, 0], [7, 0, 3],
        [3, 0, 1], [3, 1, 9], [9, 1, 4], [4, 5, 8], [8, 5, 2]
      ];
      
      if (faceIndex < faces.length) {
        const face = faces[faceIndex];
        // Barycentric coordinates for triangle interpolation
        const s = Math.sqrt(faceProgress);
        const t = v;
        const u_coord = 1 - s;
        const v_coord = s * (1 - t);
        const w_coord = s * t;
        
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];
        
        const x = u_coord * v1[0] + v_coord * v2[0] + w_coord * v3[0];
        return a * x + b * Math.sin(c * u + d * v) * 0.05;
      }
      return 0;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const vertices = [
        [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
        [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
        [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
      ];
      
      const faceIndex = Math.floor(u * 20) % 20;
      const faceProgress = (u * 20) % 1;
      
      const faces = [
        [0, 1, 4], [1, 9, 4], [4, 9, 5], [5, 9, 11], [5, 11, 2],
        [11, 7, 2], [7, 3, 2], [3, 2, 6], [2, 6, 8], [6, 8, 10],
        [8, 10, 1], [1, 10, 0], [0, 10, 6], [6, 7, 0], [7, 0, 3],
        [3, 0, 1], [3, 1, 9], [9, 1, 4], [4, 5, 8], [8, 5, 2]
      ];
      
      if (faceIndex < faces.length) {
        const face = faces[faceIndex];
        const s = Math.sqrt(faceProgress);
        const t = v;
        const u_coord = 1 - s;
        const v_coord = s * (1 - t);
        const w_coord = s * t;
        
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];
        
        const y = u_coord * v1[1] + v_coord * v2[1] + w_coord * v3[1];
        return a * y + e * Math.cos(f * u + g * v) * 0.05;
      }
      return 0;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const vertices = [
        [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
        [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
        [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
      ];
      
      const faceIndex = Math.floor(u * 20) % 20;
      const faceProgress = (u * 20) % 1;
      
      const faces = [
        [0, 1, 4], [1, 9, 4], [4, 9, 5], [5, 9, 11], [5, 11, 2],
        [11, 7, 2], [7, 3, 2], [3, 2, 6], [2, 6, 8], [6, 8, 10],
        [8, 10, 1], [1, 10, 0], [0, 10, 6], [6, 7, 0], [7, 0, 3],
        [3, 0, 1], [3, 1, 9], [9, 1, 4], [4, 5, 8], [8, 5, 2]
      ];
      
      if (faceIndex < faces.length) {
        const face = faces[faceIndex];
        const s = Math.sqrt(faceProgress);
        const t = v;
        const u_coord = 1 - s;
        const v_coord = s * (1 - t);
        const w_coord = s * t;
        
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];
        
        const z = u_coord * v1[2] + v_coord * v2[2] + w_coord * v3[2];
        return a * z + h * Math.sin(i * u + j * v) * 0.03;
      }
      return 0;
    }
  },

  // Perfect Dodecahedron - 12 pentagonal faces with golden ratio proportions
  dodecahedron_group: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      const invPhi = 1 / phi; // ≈ 0.618034
      
      // Dodecahedron vertices (20 vertices)
      const vertices = [
        // Cube vertices
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
        // Golden ratio rectangles
        [0, invPhi, phi], [0, invPhi, -phi], [0, -invPhi, phi], [0, -invPhi, -phi],
        [invPhi, phi, 0], [invPhi, -phi, 0], [-invPhi, phi, 0], [-invPhi, -phi, 0],
        [phi, 0, invPhi], [phi, 0, -invPhi], [-phi, 0, invPhi], [-phi, 0, -invPhi]
      ];
      
      // Pentagon face index (12 pentagonal faces)
      const faceIndex = Math.floor(u * 12) % 12;
      const faceProgress = (u * 12) % 1;
      
      // Pentagonal faces of dodecahedron
      const pentagonFaces = [
        [0, 16, 2, 10, 8], [0, 8, 4, 14, 12], [16, 17, 1, 9, 11],
        [1, 12, 14, 5, 9], [2, 13, 15, 6, 10], [3, 11, 9, 5, 19],
        [3, 19, 18, 6, 15], [4, 8, 10, 6, 18], [7, 15, 13, 17, 19],
        [7, 19, 5, 14, 4], [1, 17, 13, 2, 16], [0, 12, 1, 16, 17]
      ];
      
      if (faceIndex < pentagonFaces.length) {
        const face = pentagonFaces[faceIndex];
        // Regular pentagon parametrization
        const angle = v * 2 * Math.PI;
        const radius = faceProgress;
        
        // Pentagon center calculation
        let centerX = 0;
        for (let i = 0; i < 5; i++) {
          centerX += vertices[face[i]][0];
        }
        centerX /= 5;
        
        // Pentagon vertex interpolation
        const vertexIndex = Math.floor(angle / (2 * Math.PI / 5)) % 5;
        const angleInSegment = (angle % (2 * Math.PI / 5)) / (2 * Math.PI / 5);
        
        const v1 = vertices[face[vertexIndex]];
        const v2 = vertices[face[(vertexIndex + 1) % 5]];
        
        const edgeX = v1[0] + angleInSegment * (v2[0] - v1[0]);
        const x = centerX + radius * (edgeX - centerX);
        
        return a * x + b * Math.sin(c * u + d * v) * 0.04;
      }
      return 0;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      const invPhi = 1 / phi;
      
      const vertices = [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
        [0, invPhi, phi], [0, invPhi, -phi], [0, -invPhi, phi], [0, -invPhi, -phi],
        [invPhi, phi, 0], [invPhi, -phi, 0], [-invPhi, phi, 0], [-invPhi, -phi, 0],
        [phi, 0, invPhi], [phi, 0, -invPhi], [-phi, 0, invPhi], [-phi, 0, -invPhi]
      ];
      
      const faceIndex = Math.floor(u * 12) % 12;
      const faceProgress = (u * 12) % 1;
      
      const pentagonFaces = [
        [0, 16, 2, 10, 8], [0, 8, 4, 14, 12], [16, 17, 1, 9, 11],
        [1, 12, 14, 5, 9], [2, 13, 15, 6, 10], [3, 11, 9, 5, 19],
        [3, 19, 18, 6, 15], [4, 8, 10, 6, 18], [7, 15, 13, 17, 19],
        [7, 19, 5, 14, 4], [1, 17, 13, 2, 16], [0, 12, 1, 16, 17]
      ];
      
      if (faceIndex < pentagonFaces.length) {
        const face = pentagonFaces[faceIndex];
        const angle = v * 2 * Math.PI;
        const radius = faceProgress;
        
        let centerY = 0;
        for (let i = 0; i < 5; i++) {
          centerY += vertices[face[i]][1];
        }
        centerY /= 5;
        
        const vertexIndex = Math.floor(angle / (2 * Math.PI / 5)) % 5;
        const angleInSegment = (angle % (2 * Math.PI / 5)) / (2 * Math.PI / 5);
        
        const v1 = vertices[face[vertexIndex]];
        const v2 = vertices[face[(vertexIndex + 1) % 5]];
        
        const edgeY = v1[1] + angleInSegment * (v2[1] - v1[1]);
        const y = centerY + radius * (edgeY - centerY);
        
        return a * y + e * Math.cos(f * u + g * v) * 0.04;
      }
      return 0;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      const invPhi = 1 / phi;
      
      const vertices = [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
        [0, invPhi, phi], [0, invPhi, -phi], [0, -invPhi, phi], [0, -invPhi, -phi],
        [invPhi, phi, 0], [invPhi, -phi, 0], [-invPhi, phi, 0], [-invPhi, -phi, 0],
        [phi, 0, invPhi], [phi, 0, -invPhi], [-phi, 0, invPhi], [-phi, 0, -invPhi]
      ];
      
      const faceIndex = Math.floor(u * 12) % 12;
      const faceProgress = (u * 12) % 1;
      
      const pentagonFaces = [
        [0, 16, 2, 10, 8], [0, 8, 4, 14, 12], [16, 17, 1, 9, 11],
        [1, 12, 14, 5, 9], [2, 13, 15, 6, 10], [3, 11, 9, 5, 19],
        [3, 19, 18, 6, 15], [4, 8, 10, 6, 18], [7, 15, 13, 17, 19],
        [7, 19, 5, 14, 4], [1, 17, 13, 2, 16], [0, 12, 1, 16, 17]
      ];
      
      if (faceIndex < pentagonFaces.length) {
        const face = pentagonFaces[faceIndex];
        const angle = v * 2 * Math.PI;
        const radius = faceProgress;
        
        let centerZ = 0;
        for (let i = 0; i < 5; i++) {
          centerZ += vertices[face[i]][2];
        }
        centerZ /= 5;
        
        const vertexIndex = Math.floor(angle / (2 * Math.PI / 5)) % 5;
        const angleInSegment = (angle % (2 * Math.PI / 5)) / (2 * Math.PI / 5);
        
        const v1 = vertices[face[vertexIndex]];
        const v2 = vertices[face[(vertexIndex + 1) % 5]];
        
        const edgeZ = v1[2] + angleInSegment * (v2[2] - v1[2]);
        const z = centerZ + radius * (edgeZ - centerZ);
        
        return a * z + h * Math.sin(i * u + j * v) * 0.03;
      }
      return 0;
    }
  },

  // Cubic Bravais Lattice - Simple cubic crystal structure
  cubic_lattice: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      // Lattice parameter 'a' controls unit cell size
      const latticeParam = a;
      
      // Generate lattice points in 3D grid
      const nx = Math.floor(u * b + 1); // Number of unit cells in x
      const ny = Math.floor(v * c + 1); // Number of unit cells in y
      const nz = Math.floor((u + v) * d + 1); // Number of unit cells in z
      
      // Lattice point coordinates
      const x = (nx % Math.floor(b + 1)) * latticeParam;
      
      // Add small perturbation for visualization
      return x + e * Math.sin(f * u + g * v) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      
      const nx = Math.floor(u * b + 1);
      const ny = Math.floor(v * c + 1);
      const nz = Math.floor((u + v) * d + 1);
      
      const y = (ny % Math.floor(c + 1)) * latticeParam;
      
      return y + h * Math.cos(i * u + j * v) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      
      const nx = Math.floor(u * b + 1);
      const ny = Math.floor(v * c + 1);
      const nz = Math.floor((u + v) * d + 1);
      
      const z = (nz % Math.floor(d + 1)) * latticeParam;
      
      return z + k * Math.sin(l * u + m * v) * 0.08;
    }
  },

  // Face-Centered Cubic (FCC) Lattice - Close-packed crystal structure
  fcc_lattice: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      
      // FCC basis vectors: (0,0,0), (1/2,1/2,0), (1/2,0,1/2), (0,1/2,1/2)
      const basisPoints = [
        [0, 0, 0],
        [0.5, 0.5, 0],
        [0.5, 0, 0.5],
        [0, 0.5, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * c);
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 4) % 4);
      const basis = basisPoints[basisIndex];
      
      const x = (unitCellX + basis[0]) * latticeParam;
      
      return x + e * Math.sin(f * u + g * v) * 0.05;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      
      const basisPoints = [
        [0, 0, 0],
        [0.5, 0.5, 0],
        [0.5, 0, 0.5],
        [0, 0.5, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * c);
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 4) % 4);
      const basis = basisPoints[basisIndex];
      
      const y = (unitCellY + basis[1]) * latticeParam;
      
      return y + h * Math.cos(i * u + j * v) * 0.05;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      
      const basisPoints = [
        [0, 0, 0],
        [0.5, 0.5, 0],
        [0.5, 0, 0.5],
        [0, 0.5, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * c);
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 4) % 4);
      const basis = basisPoints[basisIndex];
      
      const z = (unitCellZ + basis[2]) * latticeParam;
      
      return z + k * Math.sin(l * u + m * v) * 0.04;
    }
  },

  // Hexagonal Close-Packed (HCP) Lattice - Alternative close-packed structure
  hcp_lattice: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      const cOverA = c; // c/a ratio for hexagonal lattice
      
      // Hexagonal basis vectors
      const basisPoints = [
        [0, 0, 0],
        [1/3, 2/3, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * b); // Hexagonal, so same as x
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 2) % 2);
      const basis = basisPoints[basisIndex];
      
      // Hexagonal coordinate transformation
      const x = (unitCellX + basis[0]) * latticeParam + 
                (unitCellY + basis[1]) * latticeParam * 0.5;
      
      return x + e * Math.sin(f * u + g * v) * 0.04;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      const cOverA = c;
      
      const basisPoints = [
        [0, 0, 0],
        [1/3, 2/3, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * b);
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 2) % 2);
      const basis = basisPoints[basisIndex];
      
      // Hexagonal coordinate transformation
      const y = (unitCellY + basis[1]) * latticeParam * Math.sqrt(3) / 2;
      
      return y + h * Math.cos(i * u + j * v) * 0.04;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const latticeParam = a;
      const cOverA = c;
      
      const basisPoints = [
        [0, 0, 0],
        [1/3, 2/3, 0.5]
      ];
      
      const unitCellX = Math.floor(u * b);
      const unitCellY = Math.floor(v * b);
      const unitCellZ = Math.floor((u + v) * d);
      
      const basisIndex = Math.floor((u * 2) % 2);
      const basis = basisPoints[basisIndex];
      
      const z = (unitCellZ + basis[2]) * latticeParam * cOverA;
      
      return z + k * Math.sin(l * u + m * v) * 0.03;
    }
  }
};

/**
 * Get group theory information for display
 */
export function getGroupTheoryInfo(type: string): {
  name: string;
  description: string;
  symmetryGroup: string;
  order: number | string;
  elements: string;
} {
  const info = {
    icosahedron_group: {
      name: "Icosahedral Group (I_h)",
      description: "Perfect icosahedron with 20 triangular faces and golden ratio proportions",
      symmetryGroup: "Icosahedral symmetry I_h",
      order: 120,
      elements: "60 rotations + 60 reflections, 5-fold and 3-fold rotation axes"
    },
    dodecahedron_group: {
      name: "Dodecahedral Group (I_h)",
      description: "Perfect dodecahedron with 12 pentagonal faces and golden ratio geometry",
      symmetryGroup: "Icosahedral symmetry I_h",
      order: 120,
      elements: "60 rotations + 60 reflections, dual to icosahedron"
    },
    cubic_lattice: {
      name: "Simple Cubic Lattice",
      description: "Basic cubic crystal structure with lattice points at cube corners",
      symmetryGroup: "Cubic point group O_h",
      order: 48,
      elements: "24 rotations + 24 reflections, primitive cubic unit cell"
    },
    fcc_lattice: {
      name: "Face-Centered Cubic (FCC)",
      description: "Close-packed cubic structure with atoms at face centers",
      symmetryGroup: "Cubic point group O_h",
      order: 48,
      elements: "4 atoms per unit cell, coordination number 12"
    },
    hcp_lattice: {
      name: "Hexagonal Close-Packed (HCP)",
      description: "Alternative close-packed structure with hexagonal symmetry",
      symmetryGroup: "Hexagonal point group D_{6h}",
      order: 24,
      elements: "2 atoms per unit cell, coordination number 12"
    }
  };

  return (info as any)[type] || {
    name: "Unknown Group Structure",
    description: "Mathematical symmetry group",
    symmetryGroup: "Unknown symmetry",
    order: "Unknown",
    elements: "Group elements"
  };
}