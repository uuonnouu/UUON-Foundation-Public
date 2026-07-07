import { MathEngine } from "./mathEngine";
import { EXCLUSIVE_SHAPES } from "./exclusiveShapes";
import { RIEMANN_SURFACES } from "./riemannSurfaces";
import { SACRED_GEOMETRY } from "./sacredGeometry";
import { GROUP_THEORY } from "./groupTheory";
import { CATEGORY_THEORY } from "./categoryTheory";
import { TOPOLOGY_KNOTS } from "./topologyKnotsFixed";
import { REAL_WORLD_OBJECTS } from "./realWorldObjects";
import { GRAVITY_WELL, WHITE_HOLE, WORMHOLE, ERGOSPHERE } from "./cosmicObjects";
import { PENTACHORON, HEXACOSICHORON } from "./advancedMathObjects";
import { CELL_24, KLEIN_BOTTLE_4D } from "./24CellKleinBottle4D";
import { TORUS_4D, HOPF_FIBRATION, MOBIUS_4D, HYPERCYLINDER, HYPERELLIPSOID_4D, SCHLAFLI_DOUBLE_SIX, HYPERPRISM_4D, CLIFFORD_TORUS, ZIMMER_PROGRAM_4D } from "./advanced4DMathObjects";
import { HYPERCUBE_TESSERACT } from "./advancedMathObjects";
import { 
  TESSERACT_4D, HYPERSPHERE_4D, SIMPLEX_4D, CROSS_POLYTOPE_4D, DUOPRISM_4D, 
  STEREOGRAPHIC_4D, HYPERBOLOID_4D, LISSAJOUS_KNOT_4D, ICOSAHEDRAL_POLYTOPE_4D, 
  CALABI_YAU_4D, SEIFERT_SURFACE_4D, SPINOR_FIBRATION_4D, ROMAN_SURFACE_4D, 
  QUATERNIONIC_PROJECTIVE_LINE_4D, TWISTED_CUBIC_4D, MODULAR_SURFACE_KNOTS_4D, 
  QUANTUM_HALL_DROPLETS_4D, HYPERBOLIC_LIMIT_SETS_4D, 
  SEIBERG_WITTEN_MONOPOLES_4D, ARITHMETIC_HYPERBOLIC_MANIFOLDS_4D, 
  EXOTIC_SMOOTH_STRUCTURES_4D, PERFECTOID_SPACES_4D 
} from "./complete4DObjects";
import { RICCI_FLOW_SINGULARITIES_4D, GRAVITATIONAL_WAVE_RESONATORS_4D } from "./uncharted4DMathObjects";

export interface SurfaceEquation {
  x: (u: number, v: number, a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, uParam: number, vParam: number, w: number) => number;
  y: (u: number, v: number, a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, uParam: number, vParam: number, w: number) => number;
  z: (u: number, v: number, a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, uParam: number, vParam: number, w: number) => number;
  w?: (u: number, v: number, a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, uParam: number, vParam: number, w: number) => number;
}

export const PREDEFINED_SURFACES: Record<string, SurfaceEquation> = {
  cone: {
    // Standard cone: v=0 → base circle (radius a), v=1 → apex (radius 0)
    // u ∈ [0, 2π], v ∈ [0, 1];  a = base radius,  c = height
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseRadius = a * (1 - v) * Math.cos(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u) * Math.cos(g * v * Math.PI);
        const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v));
        const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v));
        return baseRadius + (parallelField + dimFold + quantumPhase) * 0.1;
      }
      return baseRadius;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseRadius = a * (1 - v) * Math.sin(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u);
        const metricWarp = k * Math.exp(l * Math.sin(m * u)) * Math.cos(k * v);
        return baseRadius + (tensorFlow + metricWarp) * 0.1;
      }
      return baseRadius;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseHeight = c * v;  // v=0: base at z=0;  v=1: apex at z=c
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5));
        const timeDilation = m * Math.exp(-Math.abs(u - v)) * Math.sin(m * (u + v) * Math.PI);
        return baseHeight + (spaceTwist + timeDilation) * 0.15;
      }
      return baseHeight;
    }
  },
  
  sphere: {
    // Standard sphere in spherical coordinates
    // u ∈ [0, 2π] = longitude, v ∈ [0, π] = co-latitude (pole to pole)
    // a = radius; b/c/d/e/f unused at defaults (available for G-M modulation)
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const base = a * Math.sin(v) * Math.cos(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u) * Math.cos(g * v * Math.PI);
        const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v));
        return base + (parallelField + quantumPhase) * 0.1;
      }
      return base;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const base = a * Math.sin(v) * Math.sin(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v));
        const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u);
        return base + (dimFold + tensorFlow) * 0.1;
      }
      return base;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      return a * Math.cos(v);
    }
  },
  
  cylinder: {
    // Standard cylinder: u ∈ [0, 2π], v is height axis
    // a = radius,  c = height scale;  b is available as tube thickness/unused
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => a * Math.cos(u),
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => a * Math.sin(u),
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => v * c
  },
  
  torus: {
    // Standard torus: u ∈ [0, 2π] = longitude, v ∈ [0, 2π] = tube angle
    // a = major radius (center to tube center),  b = tube radius
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseX = (a + b * Math.cos(v)) * Math.cos(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u * Math.PI) * Math.cos(g * v * Math.PI);
        const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v));
        return baseX + (parallelField + quantumPhase) * 0.2;
      }
      return baseX;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseY = (a + b * Math.cos(v)) * Math.sin(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v));
        const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u);
        return baseY + (dimFold + tensorFlow) * 0.2;
      }
      return baseY;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseZ = b * Math.sin(v);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const metricWarp = k * Math.exp(l * Math.sin(m * u)) * Math.cos(k * v);
        const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5));
        return baseZ + (metricWarp + spaceTwist) * 0.15;
      }
      return baseZ;
    }
  },

  annulus_torus: {
    // Annular torus with flattened cross-section (ring-within-ring appearance)
    // u ∈ [0, 2π], v ∈ [0, 2π];  a = major radius, b = tube radius, c = cross-section flatness
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseX = (a + b * Math.cos(v)) * Math.cos(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u * Math.PI) * Math.cos(g * v * Math.PI);
        const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v));
        return baseX + (parallelField + quantumPhase) * 0.2;
      }
      return baseX;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseY = (a + b * Math.cos(v)) * Math.sin(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v));
        const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u);
        return baseY + (dimFold + tensorFlow) * 0.2;
      }
      return baseY;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseZ = b * c * Math.sin(v);  // c < 1 flattens the cross-section
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const metricWarp = k * Math.exp(l * Math.sin(m * u)) * Math.cos(k * v);
        const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5));
        return baseZ + (metricWarp + spaceTwist) * 0.15;
      }
      return baseZ;
    }
  },

  hyperboloid: {
    // One-sheet hyperboloid: u ∈ [-π, π], v ∈ [0, 2π]
    // a = scale, b = waist radius stretch (cosh stretch on u)
    // Formula: x²/a² + y²/a² - z²/b² = 1 in hyperbolic coords
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseX = a * Math.cosh(u * b) * Math.cos(v);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u) * Math.cos(g * v * Math.PI);
        const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v));
        return baseX + (parallelField + quantumPhase) * 0.1;
      }
      return baseX;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseY = a * Math.cosh(u * b) * Math.sin(v);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v));
        const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u);
        return baseY + (dimFold + tensorFlow) * 0.1;
      }
      return baseY;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseZ = a * Math.sinh(u * b);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5));
        const timeDilation = m * Math.exp(-Math.abs(u - v)) * Math.sin(m * (u + v) * Math.PI);
        return baseZ + (spaceTwist + timeDilation) * 0.15;
      }
      return baseZ;
    }
  },
  
  paraboloid: {
    // Elliptic paraboloid: z = c*(x²/a² + y²/b²) in Cartesian form
    // u ∈ [-2, 2], v ∈ [-2, 2];  a = x scale, b = y scale, c = curvature height
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseX = u * a;
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u) * Math.cos(g * v * Math.PI);
        return baseX + parallelField * 0.1;
      }
      return baseX;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseY = v * b;
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v));
        return baseY + dimFold * 0.1;
      }
      return baseY;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseZ = c * (u * u + v * v);  // z = c(x² + y²), paraboloid opening upward
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const metricWarp = k * Math.exp(l * Math.sin(m * u)) * Math.cos(k * v);
        return baseZ + metricWarp * 0.2;
      }
      return baseZ;
    }
  },
  
  helicoid: {
    // Helicoid: ruled surface swept by a line rotating + rising along a central axis
    // u ∈ [0, 4π] = rotation angle (2 full turns), v ∈ [-1, 1] = radial arm
    // a = arm radius scale,  c = pitch (height per radian / 2π)
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseX = v * a * Math.cos(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const parallelField = g * Math.sin(h * u) * Math.cos(g * v * Math.PI);
        const quantumPhase = i * Math.sin(j * u + k * v) * Math.cos(i * (u * v));
        return baseX + (parallelField + quantumPhase) * 0.15;
      }
      return baseX;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseY = v * a * Math.sin(u);
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * Math.PI * u);
        const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5));
        return baseY + (tensorFlow + spaceTwist) * 0.15;
      }
      return baseY;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const baseZ = c * u;  // height rises linearly with rotation angle
      const hasEnhancements = g !== 1 || h !== 1 || i !== 1 || j !== 1 || k !== 1 || l !== 1 || m !== 1;
      if (hasEnhancements) {
        const timeDilation = m * Math.exp(-Math.abs(u - v)) * Math.sin(m * (u + v) * Math.PI);
        return baseZ + timeDilation * 0.2;
      }
      return baseZ;
    }
  },
  
  mobius: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => (a + v * b * Math.cos(u * c / 2)) * Math.cos(u * d),
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => (a + v * b * Math.cos(u * c / 2)) * Math.sin(u * d),
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => v * b * Math.sin(u * c / 2)
  },

  // BASIC POLYGON SURFACES
  
  // Triangular shapes - PERFECT MATHEMATICAL FOUNDATION
  triangular_prism: {
    x: (u, v, a = 2, b = 1, c = 1) => {
      // Perfect equilateral triangle with exact 120° angles
      const normalizedU = u % (2 * Math.PI);
      const segment = normalizedU / (2 * Math.PI / 3);
      const segmentIndex = Math.floor(segment);
      const t = segment - segmentIndex;
      
      // Three perfect vertices of equilateral triangle
      const vertices = [
        [a * b, 0],                           // Vertex 1: (a, 0)
        [a * b * -0.5, a * b * Math.sqrt(3) / 2],  // Vertex 2: (-a/2, a√3/2)
        [a * b * -0.5, a * b * -Math.sqrt(3) / 2]  // Vertex 3: (-a/2, -a√3/2)
      ];
      
      const v1 = vertices[segmentIndex % 3];
      const v2 = vertices[(segmentIndex + 1) % 3];
      
      return v1[0] + t * (v2[0] - v1[0]);
    },
    y: (u, v, a = 2, b = 1, c = 1) => {
      // Perfect equilateral triangle with exact 120° angles
      const normalizedU = u % (2 * Math.PI);
      const segment = normalizedU / (2 * Math.PI / 3);
      const segmentIndex = Math.floor(segment);
      const t = segment - segmentIndex;
      
      // Three perfect vertices of equilateral triangle
      const vertices = [
        [a * b, 0],                           // Vertex 1: (a, 0)
        [a * b * -0.5, a * b * Math.sqrt(3) / 2],  // Vertex 2: (-a/2, a√3/2)
        [a * b * -0.5, a * b * -Math.sqrt(3) / 2]  // Vertex 3: (-a/2, -a√3/2)
      ];
      
      const v1 = vertices[segmentIndex % 3];
      const v2 = vertices[(segmentIndex + 1) % 3];
      
      return v1[1] + t * (v2[1] - v1[1]);
    },
    z: (u, v, a = 2, b = 1, c = 1) => (v - 0.5) * 2 * c
  },
  
  tetrahedron: {
    x: (u, v, a = 2, b = 1, c = 1) => {
      // Perfect tetrahedron with 4 triangular faces
      // Base triangle vertices in perfect equilateral formation
      const sqrt3 = Math.sqrt(3);
      const vertices = [
        [a * b, 0, 0],                                    // Base vertex 1
        [a * b * -0.5, a * b * sqrt3 / 2, 0],           // Base vertex 2  
        [a * b * -0.5, a * b * -sqrt3 / 2, 0],          // Base vertex 3
        [0, 0, a * c * sqrt3 / sqrt3]                    // Apex vertex (perfect height)
      ];
      
      const face = Math.floor(u * 4) % 4;
      const localU = (u * 4) % 1;
      const localV = v;
      
      let v1, v2, v3;
      if (face === 0) { v1 = vertices[0]; v2 = vertices[1]; v3 = vertices[3]; }
      else if (face === 1) { v1 = vertices[1]; v2 = vertices[2]; v3 = vertices[3]; }
      else if (face === 2) { v1 = vertices[2]; v2 = vertices[0]; v3 = vertices[3]; }
      else { v1 = vertices[0]; v2 = vertices[2]; v3 = vertices[1]; } // Base
      
      return v1[0] + localU * (v2[0] - v1[0]) + localV * (v3[0] - v1[0]);
    },
    y: (u, v, a = 2, b = 1, c = 1) => {
      const sqrt3 = Math.sqrt(3);
      const vertices = [
        [a * b, 0, 0],
        [a * b * -0.5, a * b * sqrt3 / 2, 0],
        [a * b * -0.5, a * b * -sqrt3 / 2, 0],
        [0, 0, a * c * sqrt3 / sqrt3]
      ];
      
      const face = Math.floor(u * 4) % 4;
      const localU = (u * 4) % 1;
      const localV = v;
      
      let v1, v2, v3;
      if (face === 0) { v1 = vertices[0]; v2 = vertices[1]; v3 = vertices[3]; }
      else if (face === 1) { v1 = vertices[1]; v2 = vertices[2]; v3 = vertices[3]; }
      else if (face === 2) { v1 = vertices[2]; v2 = vertices[0]; v3 = vertices[3]; }
      else { v1 = vertices[0]; v2 = vertices[2]; v3 = vertices[1]; }
      
      return v1[1] + localU * (v2[1] - v1[1]) + localV * (v3[1] - v1[1]);
    },
    z: (u, v, a = 2, b = 1, c = 1) => {
      const sqrt3 = Math.sqrt(3);
      const vertices = [
        [a * b, 0, 0],
        [a * b * -0.5, a * b * sqrt3 / 2, 0],
        [a * b * -0.5, a * b * -sqrt3 / 2, 0],
        [0, 0, a * c * sqrt3 / sqrt3]
      ];
      
      const face = Math.floor(u * 4) % 4;
      const localU = (u * 4) % 1;
      const localV = v;
      
      let v1, v2, v3;
      if (face === 0) { v1 = vertices[0]; v2 = vertices[1]; v3 = vertices[3]; }
      else if (face === 1) { v1 = vertices[1]; v2 = vertices[2]; v3 = vertices[3]; }
      else if (face === 2) { v1 = vertices[2]; v2 = vertices[0]; v3 = vertices[3]; }
      else { v1 = vertices[0]; v2 = vertices[2]; v3 = vertices[1]; }
      
      return v1[2] + localU * (v2[2] - v1[2]) + localV * (v3[2] - v1[2]);
    }
  },
  
  triangular_pyramid: {
    x: (u, v, a = 2, b = 1, c = 1) => {
      // Perfect triangular pyramid with equilateral base
      const normalizedU = u % (2 * Math.PI);
      const segment = normalizedU / (2 * Math.PI / 3);
      const segmentIndex = Math.floor(segment);
      const t = segment - segmentIndex;
      
      // Perfect equilateral triangle base vertices
      const vertices = [
        [a * b, 0],
        [a * b * -0.5, a * b * Math.sqrt(3) / 2],
        [a * b * -0.5, a * b * -Math.sqrt(3) / 2]
      ];
      
      const v1 = vertices[segmentIndex % 3];
      const v2 = vertices[(segmentIndex + 1) % 3];
      
      // Linear interpolation from base to apex
      const baseX = v1[0] + t * (v2[0] - v1[0]);
      return baseX * (1 - v);
    },
    y: (u, v, a = 2, b = 1, c = 1) => {
      const normalizedU = u % (2 * Math.PI);
      const segment = normalizedU / (2 * Math.PI / 3);
      const segmentIndex = Math.floor(segment);
      const t = segment - segmentIndex;
      
      const vertices = [
        [a * b, 0],
        [a * b * -0.5, a * b * Math.sqrt(3) / 2],
        [a * b * -0.5, a * b * -Math.sqrt(3) / 2]
      ];
      
      const v1 = vertices[segmentIndex % 3];
      const v2 = vertices[(segmentIndex + 1) % 3];
      
      const baseY = v1[1] + t * (v2[1] - v1[1]);
      return baseY * (1 - v);
    },
    z: (u, v, a = 2, b = 1, c = 1) => v * a * c
  },

  // Quadrilateral shapes - SQUARE FOUNDATION FIRST
  square: {
    x: (u, v, a = 2, b = 1, c = 1) => {
      // Perfect flat square - the foundation for all quadrilateral forms
      const side = Math.floor(u * 4) % 4;
      const t = (u * 4) % 1;
      
      // Square boundary limits - cannot expand beyond parameter d
      const maxSize = Math.min(a * b, a * b * Math.abs(c)); // Limited by parameter constraints
      
      switch (side) {
        case 0: return maxSize;                          // Right edge (+X)
        case 1: return maxSize * (1 - 2 * t);          // Top edge (varying X)
        case 2: return -maxSize;                         // Left edge (-X)
        case 3: return maxSize * (2 * t - 1);          // Bottom edge (varying X)
        default: return 0;
      }
    },
    y: (u, v, a = 2, b = 1, c = 1) => {
      const side = Math.floor(u * 4) % 4;
      const t = (u * 4) % 1;
      
      const maxSize = Math.min(a * b, a * b * Math.abs(c));
      
      switch (side) {
        case 0: return maxSize * (2 * t - 1);          // Right edge (varying Y)
        case 1: return maxSize;                          // Top edge (+Y)
        case 2: return maxSize * (1 - 2 * t);          // Left edge (varying Y)
        case 3: return -maxSize;                         // Bottom edge (-Y)
        default: return 0;
      }
    },
    z: (u, v, a = 2, b = 1, c = 1) => 0 // Flat square in XY plane
  },
  // 6-Face explicit switch — cube / square prism / rectangular prism
  // u ∈ [0,1] divided into 6 equal bands (one per face), v ∈ [0,1]
  // uSegments must be a multiple of 6 (use 60) so each face gets equal sampling.
  //
  // Parameters:
  //   a = x half-extent (±x faces)
  //   c = y half-extent (±y faces)
  //   d = z half-extent (±z faces)
  //   b = unused (available for future softening — leave at 1)

  cube: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const fs = (ui % 1) * 2 - 1;
      if (face === 0) return +a; if (face === 1) return -a; return a * fs;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const fs = (ui % 1) * 2 - 1; const ft = v * 2 - 1;
      if (face === 0) return c * fs; if (face === 1) return c * fs;
      if (face === 2) return +c; if (face === 3) return -c; return c * ft;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const ft = v * 2 - 1;
      if (face === 4) return +d; if (face === 5) return -d; return d * ft;
    }
  },

  // Square prism — 6-face formula, square base (a=c), taller (d > a)
  square_prism: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const fs = (ui % 1) * 2 - 1;
      if (face === 0) return +a; if (face === 1) return -a; return a * fs;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const fs = (ui % 1) * 2 - 1; const ft = v * 2 - 1;
      if (face === 0) return c * fs; if (face === 1) return c * fs;
      if (face === 2) return +c; if (face === 3) return -c; return c * ft;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const ft = v * 2 - 1;
      if (face === 4) return +d; if (face === 5) return -d; return d * ft;
    }
  },

  // Rectangular prism — 6-face formula, all three dimensions independent (a ≠ c ≠ d)
  rectangular_prism: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const fs = (ui % 1) * 2 - 1;
      if (face === 0) return +a; if (face === 1) return -a; return a * fs;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const fs = (ui % 1) * 2 - 1; const ft = v * 2 - 1;
      if (face === 0) return c * fs; if (face === 1) return c * fs;
      if (face === 2) return +c; if (face === 3) return -c; return c * ft;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const ui = Math.min(u * 6, 5.9999); const face = Math.floor(ui); const ft = v * 2 - 1;
      if (face === 4) return +d; if (face === 5) return -d; return d * ft;
    }
  },

  // Square pyramid — n=4 LERP approach, u ∈ [0,1] traces 4 square edges
  // v ∈ [0, 1]: v=1 = base (full square), v=0 = apex (point at top)
  // a = base half-size (inscribed circle radius),  c = height
  square_pyramid: {
    x: (u, v, a, b, c) => {
      const n = 4, k = Math.floor(u * n) % n, ft = (u * n) % 1;
      return a * v * ((1 - ft) * Math.cos(2 * Math.PI * k / n) + ft * Math.cos(2 * Math.PI * (k + 1) / n));
    },
    y: (u, v, a, b, c) => {
      const n = 4, k = Math.floor(u * n) % n, ft = (u * n) % 1;
      return a * v * ((1 - ft) * Math.sin(2 * Math.PI * k / n) + ft * Math.sin(2 * Math.PI * (k + 1) / n));
    },
    z: (u, v, a, b, c) => c * (1 - v)  // v=0: apex at height c;  v=1: base at z=0
  },

  // n-gon prism helper: u ∈ [0,1] traces the n edges, v = height
  // a = radius, b = height half-extent (ignored here, controlled by vMin/vMax)
  // Formula: linear interpolation between adjacent vertices of a regular n-gon

  // Pentagon (n=5) — u ∈ [0,1], v = z height
  pentagonal_prism: {
    x: (u, v, a) => { const n=5, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=5, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  pentagonal_pyramid: {
    x: (u, v, a) => { const n=5, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=5, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Hexagon (n=6)
  hexagonal_prism: {
    x: (u, v, a) => { const n=6, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=6, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  hexagonal_pyramid: {
    x: (u, v, a) => { const n=6, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=6, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Heptagon (n=7)
  heptagonal_prism: {
    x: (u, v, a) => { const n=7, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=7, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  heptagonal_pyramid: {
    x: (u, v, a) => { const n=7, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=7, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Octagon (n=8)
  octagonal_prism: {
    x: (u, v, a) => { const n=8, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=8, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  octagonal_pyramid: {
    x: (u, v, a) => { const n=8, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=8, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Nonagon (n=9)
  nonagonal_prism: {
    x: (u, v, a) => { const n=9, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=9, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  nonagonal_pyramid: {
    x: (u, v, a) => { const n=9, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=9, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Decagon (n=10)
  decagonal_prism: {
    x: (u, v, a) => { const n=10, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=10, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  decagonal_pyramid: {
    x: (u, v, a) => { const n=10, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=10, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Hendecagon (n=11)
  hendecagonal_prism: {
    x: (u, v, a) => { const n=11, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=11, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  hendecagonal_pyramid: {
    x: (u, v, a) => { const n=11, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=11, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Dodecagon (n=12)
  dodecagonal_prism: {
    x: (u, v, a) => { const n=12, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=12, k=Math.floor(u*n)%n, t=(u*n)%1; return a*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v) => v
  },
  dodecagonal_pyramid: {
    x: (u, v, a) => { const n=12, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.cos(2*Math.PI*k/n)+t*Math.cos(2*Math.PI*(k+1)/n)); },
    y: (u, v, a) => { const n=12, k=Math.floor(u*n)%n, t=(u*n)%1; return a*v*((1-t)*Math.sin(2*Math.PI*k/n)+t*Math.sin(2*Math.PI*(k+1)/n)); },
    z: (u, v, a) => a * (1 - v)
  },

  // Additional quadrilateral variations
  rhombic_prism: {
    x: (u, v, a = 2, b = 1.5) => a * Math.cos(u) + b * Math.cos(u + Math.PI/4),
    y: (u, v, a = 2, b = 1.5) => a * Math.sin(u) + b * Math.sin(u + Math.PI/4),
    z: (u, v) => v
  },
  
  parallelepiped: {
    x: (u, v, a = 2, b = 1) => a * Math.cos(u) + b * v * Math.cos(u + Math.PI/6),
    y: (u, v, a = 2, b = 1) => a * Math.sin(u) + b * v * Math.sin(u + Math.PI/6),
    z: (u, v) => v
  },
  
  trapezoidal_prism: {
    x: (u, v, a = 2, b = 1) => (a - b * v) * Math.cos(u),
    y: (u, v, a = 2, b = 1) => (a - b * v) * Math.sin(u),
    z: (u, v) => v
  },
  
  kite_prism: {
    x: (u, v, a = 2, b = 1) => a * Math.cos(u * 2) + b * Math.cos(u),
    y: (u, v, a = 2, b = 1) => a * Math.sin(u * 2) + b * Math.sin(u),
    z: (u, v) => v
  }
};

export function createCustomSurface(
  xEquation: string,
  yEquation: string,
  zEquation: string
): SurfaceEquation {
  return {
    x: (u, v, a, b, c) => MathEngine.evaluate(xEquation, { u, v, a, b, c }),
    y: (u, v, a, b, c) => MathEngine.evaluate(yEquation, { u, v, a, b, c }),
    z: (u, v, a, b, c) => MathEngine.evaluate(zEquation, { u, v, a, b, c })
  };
}

export function getSurfaceEquation(
  type: string,
  customEquation?: { x: string; y: string; z: string }
): SurfaceEquation {
  if (type === "custom" && customEquation) {
    return createCustomSurface(customEquation.x, customEquation.y, customEquation.z);
  }
  
  // Check cosmic objects first, then other categories
  const COSMIC_OBJECTS: Record<string, SurfaceEquation> = { 
    'GRAVITY_WELL': GRAVITY_WELL, 
    'WHITE_HOLE': WHITE_HOLE, 
    'WORMHOLE': WORMHOLE, 
    'ERGOSPHERE': ERGOSPHERE 
  };
  
  // Advanced mathematical objects - higher-dimensional projections, fractals, technical shapes
  const ADVANCED_MATH_OBJECTS: Record<string, SurfaceEquation> = {
    'pentachoron': PENTACHORON,
    'hexacosichoron': HEXACOSICHORON,
    'cell_24': CELL_24,
    'klein_bottle_4d': KLEIN_BOTTLE_4D,
    'torus_4d': TORUS_4D,
    'hopf_fibration': HOPF_FIBRATION,
    'mobius_4d': MOBIUS_4D,
    'hypercylinder': HYPERCYLINDER,
    'hyperellipsoid_4d': HYPERELLIPSOID_4D,
    'schlafli_double_six': SCHLAFLI_DOUBLE_SIX,
    'hyperprism_4d': HYPERPRISM_4D,
    'clifford_torus': CLIFFORD_TORUS,
    'zimmer_program_4d': ZIMMER_PROGRAM_4D
  };

  // Complete 4D Objects Collection - ALL 42 Mathematical Objects
  const COMPLETE_4D_OBJECTS: Record<string, SurfaceEquation> = {
    'tesseract_4d': TESSERACT_4D,
    'hypersphere_4d': HYPERSPHERE_4D,
    'simplex_4d': SIMPLEX_4D,
    'hypercube_tesseract': HYPERCUBE_TESSERACT,
    'cross_polytope_4d': CROSS_POLYTOPE_4D,
    'duoprism_4d': DUOPRISM_4D,
    'stereographic_4d': STEREOGRAPHIC_4D,
    'hyperboloid_4d': HYPERBOLOID_4D,
    'lissajous_knot_4d': LISSAJOUS_KNOT_4D,
    'icosahedral_polytope_4d': ICOSAHEDRAL_POLYTOPE_4D,
    'calabi_yau_4d': CALABI_YAU_4D,
    'seifert_surface_4d': SEIFERT_SURFACE_4D,
    'spinor_fibration_4d': SPINOR_FIBRATION_4D,
    'roman_surface_4d': ROMAN_SURFACE_4D,
    'quaternionic_projective_line_4d': QUATERNIONIC_PROJECTIVE_LINE_4D,
    'twisted_cubic_4d': TWISTED_CUBIC_4D,
    'modular_surface_knots_4d': MODULAR_SURFACE_KNOTS_4D,

    'quantum_hall_droplets_4d': QUANTUM_HALL_DROPLETS_4D,
    'hyperbolic_limit_sets_4d': HYPERBOLIC_LIMIT_SETS_4D,
    'seiberg_witten_monopoles_4d': SEIBERG_WITTEN_MONOPOLES_4D,
    'arithmetic_hyperbolic_manifolds_4d': ARITHMETIC_HYPERBOLIC_MANIFOLDS_4D,
    'exotic_smooth_structures_4d': EXOTIC_SMOOTH_STRUCTURES_4D,
    'perfectoid_spaces_4d': PERFECTOID_SPACES_4D
  };

  // Uncharted 4D Objects - Frontier Mathematical Research
  const UNCHARTED_4D_OBJECTS: Record<string, SurfaceEquation> = {
    'ricci_flow_singularities_4d': RICCI_FLOW_SINGULARITIES_4D,
    'gravitational_wave_resonators_4d': GRAVITATIONAL_WAVE_RESONATORS_4D
  };
  
  return UNCHARTED_4D_OBJECTS[type] || COMPLETE_4D_OBJECTS[type] || COSMIC_OBJECTS[type] || ADVANCED_MATH_OBJECTS[type] || REAL_WORLD_OBJECTS[type] || TOPOLOGY_KNOTS[type] || CATEGORY_THEORY[type] || GROUP_THEORY[type] || SACRED_GEOMETRY[type] || RIEMANN_SURFACES[type] || EXCLUSIVE_SHAPES[type] || PREDEFINED_SURFACES[type] || PREDEFINED_SURFACES.cone;
}
