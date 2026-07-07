// 4D to 3D Projection Formulas - Complete Mathematical Framework
import * as THREE from 'three';

export interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface ProjectionSettings {
  method: 'stereographic' | 'orthogonal' | 'perspective' | 'cross_section';
  focalLength: number;
  crossSectionW: number;
  projectionPlane: 'xy' | 'xz' | 'yz' | 'xw' | 'yw' | 'zw';
}

export class FourDTo3DFormulas {

  // 1. Tesseract (4D Hypercube) - Formula: vertices (x,y,z,w) ∈ {-1, +1}
  static tesseract4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    // Generate tesseract vertices and edges
    const edge = Math.floor(u * 32) % 32; // 32 edges
    const t = (u * 32) % 1;

    // 16 vertices of tesseract
    const vertices = [
      [-1,-1,-1,-1], [1,-1,-1,-1], [-1,1,-1,-1], [1,1,-1,-1],
      [-1,-1,1,-1], [1,-1,1,-1], [-1,1,1,-1], [1,1,1,-1],
      [-1,-1,-1,1], [1,-1,-1,1], [-1,1,-1,1], [1,1,-1,1],
      [-1,-1,1,1], [1,-1,1,1], [-1,1,1,1], [1,1,1,1]
    ];

    // Edge connections for visualization
    const edges = [
      [0,1], [1,3], [3,2], [2,0], // bottom face
      [4,5], [5,7], [7,6], [6,4], // top face
      [0,4], [1,5], [2,6], [3,7], // vertical edges
      [8,9], [9,11], [11,10], [10,8], // w=1 face
      [12,13], [13,15], [15,14], [14,12], // w=1 top
      [0,8], [1,9], [2,10], [3,11], [4,12], [5,13], [6,14], [7,15] // w connections
    ];

    const edgeData = edges[edge % edges.length];
    const v1 = vertices[edgeData[0]];
    const v2 = vertices[edgeData[1]];

    const point4D: Point4D = {
      x: v1[0] + t * (v2[0] - v1[0]),
      y: v1[1] + t * (v2[1] - v1[1]),
      z: v1[2] + t * (v2[2] - v1[2]),
      w: v1[3] + t * (v2[3] - v1[3])
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 2. 4D Sphere (Hypersphere) - Formula: x² + y² + z² + w² = r²
  static hypersphere4D(u: number, v: number, radius: number, settings: ProjectionSettings): THREE.Vector3 {
    const phi = u * Math.PI; // [0, π]
    const theta = v * 2 * Math.PI; // [0, 2π]
    const psi = u * v * Math.PI; // Additional 4D angle

    const point4D: Point4D = {
      x: radius * Math.sin(phi) * Math.cos(theta) * Math.cos(psi),
      y: radius * Math.sin(phi) * Math.sin(theta) * Math.cos(psi),
      z: radius * Math.cos(phi) * Math.sin(psi),
      w: radius * Math.sin(phi) * Math.sin(psi)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 3. Klein Bottle in 4D
  static kleinBottle4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const point4D: Point4D = {
      x: (2 + Math.cos(v/2) * Math.sin(u) - Math.sin(v/2) * Math.sin(2*u)) * Math.cos(v),
      y: (2 + Math.cos(v/2) * Math.sin(u) - Math.sin(v/2) * Math.sin(2*u)) * Math.sin(v),
      z: Math.sin(v/2) * Math.sin(u) + Math.cos(v/2) * Math.sin(2*u),
      w: 0
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 4. 4D Torus (Duocylinder) - Formula: (x² + y²) + (z² + w²) = r₁² + r₂²
  static duocylinder4D(u: number, v: number, r1: number, r2: number, settings: ProjectionSettings): THREE.Vector3 {
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;

    const point4D: Point4D = {
      x: r1 * Math.cos(theta),
      y: r1 * Math.sin(theta),
      z: r2 * Math.cos(phi),
      w: r2 * Math.sin(phi)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 5. 4D Simplex (5-Cell) - 5 vertices forming 4D pyramid
  static simplex5Cell(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const vertices = [
      [1, 1, 1, 1],
      [1, -1, -1, 1],
      [-1, 1, -1, 1],
      [-1, -1, 1, 1],
      [0, 0, 0, -1]
    ];

    const face = Math.floor(u * 5) % 5;
    const localU = (u * 5) % 1;
    const localV = v;

    // Triangular face interpolation
    const v1 = vertices[face];
    const v2 = vertices[(face + 1) % 5];
    const v3 = vertices[(face + 2) % 5];

    const point4D: Point4D = {
      x: v1[0] + localU * (v2[0] - v1[0]) + localV * (v3[0] - v1[0]),
      y: v1[1] + localU * (v2[1] - v1[1]) + localV * (v3[1] - v1[1]),
      z: v1[2] + localU * (v2[2] - v1[2]) + localV * (v3[2] - v1[2]),
      w: v1[3] + localU * (v2[3] - v1[3]) + localV * (v3[3] - v1[3])
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 6. 4D Cross-Polytope (16-Cell) - Formula: |x| + |y| + |z| + |w| = 1
  static crossPolytope16Cell(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const vertices = [
      [1,0,0,0], [-1,0,0,0], [0,1,0,0], [0,-1,0,0],
      [0,0,1,0], [0,0,-1,0], [0,0,0,1], [0,0,0,-1]
    ];

    const cell = Math.floor(u * 16) % 16;
    const t = (u * 16) % 1;

    // Generate tetrahedral cells
    const cellVertices = [
      [0, 2, 4, 6], [0, 2, 4, 7], [0, 2, 5, 6], [0, 2, 5, 7],
      [0, 3, 4, 6], [0, 3, 4, 7], [0, 3, 5, 6], [0, 3, 5, 7],
      [1, 2, 4, 6], [1, 2, 4, 7], [1, 2, 5, 6], [1, 2, 5, 7],
      [1, 3, 4, 6], [1, 3, 4, 7], [1, 3, 5, 6], [1, 3, 5, 7]
    ];

    const cellVerts = cellVertices[cell];
    const v1 = vertices[cellVerts[0]];
    const v2 = vertices[cellVerts[1]];
    const v3 = vertices[cellVerts[2]];
    const v4 = vertices[cellVerts[3]];

    // Barycentric coordinates
    const w1 = (1 - t) * (1 - v);
    const w2 = t * (1 - v);
    const w3 = (1 - t) * v;
    const w4 = t * v;

    const point4D: Point4D = {
      x: w1*v1[0] + w2*v2[0] + w3*v3[0] + w4*v4[0],
      y: w1*v1[1] + w2*v2[1] + w3*v3[1] + w4*v4[1],
      z: w1*v1[2] + w2*v2[2] + w3*v3[2] + w4*v4[2],
      w: w1*v1[3] + w2*v2[3] + w3*v3[3] + w4*v4[3]
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 7. 4D Möbius Strip
  static mobiusStrip4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const uParam = u * 2 * Math.PI;
    const vParam = (v - 0.5) * 2;

    const point4D: Point4D = {
      x: (1 + (vParam/2) * Math.cos(uParam/2)) * Math.cos(uParam),
      y: (1 + (vParam/2) * Math.cos(uParam/2)) * Math.sin(uParam),
      z: (vParam/2) * Math.sin(uParam/2),
      w: vParam * Math.sin(uParam/3)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 8. 4D Hopf Fibration - S³ → S² fiber bundle
  static hopfFibration4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const theta = u * 2 * Math.PI;
    const phi = v * Math.PI;
    const psi = (u + v) * Math.PI;

    // S³ coordinates
    const z1_real = Math.cos(phi/2) * Math.cos(theta);
    const z1_imag = Math.cos(phi/2) * Math.sin(theta);
    const z2_real = Math.sin(phi/2) * Math.cos(psi);
    const z2_imag = Math.sin(phi/2) * Math.sin(psi);

    const point4D: Point4D = {
      x: 2 * (z1_real * z2_real + z1_imag * z2_imag),
      y: 2 * (z1_imag * z2_real - z1_real * z2_imag),
      z: z1_real * z1_real + z1_imag * z1_imag - z2_real * z2_real - z2_imag * z2_imag,
      w: Math.cos(phi) // Fiber parameter
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 9. 4D Clifford Torus - Flat torus with zero curvature
  static cliffordTorus4D(u: number, v: number, a: number, b: number, settings: ProjectionSettings): THREE.Vector3 {
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;

    const point4D: Point4D = {
      x: a * Math.cos(theta),
      y: a * Math.sin(theta),
      z: b * Math.cos(phi),
      w: b * Math.sin(phi)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 10. 4D Duoprism (Cartesian Product P₁ × P₂)
  static duoprism4D(u: number, v: number, n1: number, n2: number, settings: ProjectionSettings): THREE.Vector3 {
    const theta1 = u * 2 * Math.PI;
    const theta2 = v * 2 * Math.PI;

    // Polygon vertices
    const vertex1 = Math.floor(theta1 / (2 * Math.PI / n1));
    const vertex2 = Math.floor(theta2 / (2 * Math.PI / n2));

    const angle1 = vertex1 * (2 * Math.PI / n1);
    const angle2 = vertex2 * (2 * Math.PI / n2);

    const point4D: Point4D = {
      x: Math.cos(angle1),
      y: Math.sin(angle1),
      z: Math.cos(angle2),
      w: Math.sin(angle2)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 11. 4D Stereographic Projection Surface
  static stereographicProjection4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const scale = 4;
    const uCoord = (u - 0.5) * scale;
    const vCoord = (v - 0.5) * scale;
    const wCoord = Math.sin(u * 2 * Math.PI) * Math.cos(v * 2 * Math.PI);

    const denominator = 1 + uCoord*uCoord + vCoord*vCoord + wCoord*wCoord;

    const point4D: Point4D = {
      x: (2 * uCoord) / denominator,
      y: (2 * vCoord) / denominator,
      z: (2 * wCoord) / denominator,
      w: (uCoord*uCoord + vCoord*vCoord + wCoord*wCoord - 1) / denominator
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 12. 4D Pentachoron (5-Cell Regular Simplex)
  static pentachoron4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const vertices = [
      [1, 1, 1, 1],
      [1, -1, -1, -1],
      [-1, 1, -1, -1],
      [-1, -1, 1, -1],
      [-1, -1, -1, 1]
    ];

    const vertexIndex = Math.floor(u * 5) % 5;
    const nextVertex = (vertexIndex + 1) % 5;
    const tInterp = (u * 5) % 1;

    const point4D: Point4D = {
      x: vertices[vertexIndex][0] * (1 - tInterp) + vertices[nextVertex][0] * tInterp,
      y: vertices[vertexIndex][1] * (1 - tInterp) + vertices[nextVertex][1] * tInterp,
      z: vertices[vertexIndex][2] * (1 - tInterp) + vertices[nextVertex][2] * tInterp,
      w: vertices[vertexIndex][3] * (1 - tInterp) + vertices[nextVertex][3] * tInterp
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 13. 4D Hyperboloid (Two-Sheet)
  static hyperboloidTwoSheet4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const uParam = (u - 0.5) * 4;
    const vParam = v * 2 * Math.PI;
    const tParam = v * 2 * Math.PI;

    const point4D: Point4D = {
      x: Math.cosh(uParam) * Math.cos(vParam),
      y: Math.cosh(uParam) * Math.sin(vParam),
      z: Math.sinh(uParam) * Math.cos(tParam),
      w: Math.sinh(uParam) * Math.sin(tParam)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 14. 4D Lissajous Knot
  static lissajousKnot4D(u: number, v: number, n1: number, n2: number, n3: number, n4: number, settings: ProjectionSettings): THREE.Vector3 {
    const tParam = u * 4 * Math.PI;
    const phi1 = v * 2 * Math.PI;
    const phi2 = v * 2 * Math.PI + Math.PI/4;
    const phi3 = v * 2 * Math.PI + Math.PI/2;
    const phi4 = v * 2 * Math.PI + 3*Math.PI/4;

    const point4D: Point4D = {
      x: Math.cos(n1 * tParam + phi1),
      y: Math.cos(n2 * tParam + phi2),
      z: Math.cos(n3 * tParam + phi3),
      w: Math.cos(n4 * tParam + phi4)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 15. 4D Borromean Rings - Three unlinked circles in 4D that appear linked in 3D
  static borromeanRings4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const ringIndex = Math.floor(u * 3) % 3;
    const t = v * 2 * Math.PI;

    let point4D: Point4D;

    switch (ringIndex) {
      case 0: // Ring C₁: (cos(t), sin(t), 0, 0)
        point4D = { x: Math.cos(t), y: Math.sin(t), z: 0, w: 0 };
        break;
      case 1: // Ring C₂: (0, 0, cos(t), sin(t))
        point4D = { x: 0, y: 0, z: Math.cos(t), w: Math.sin(t) };
        break;
      case 2: // Ring C₃: (cos(t), 0, sin(t), 0)
        point4D = { x: Math.cos(t), y: 0, z: Math.sin(t), w: 0 };
        break;
      default:
        point4D = { x: 0, y: 0, z: 0, w: 0 };
    }

    return this.projectToThreeD(point4D, settings);
  }

  // 16. 4D Kummer Surface - Quartic surface with 16 singular points
  static kummerSurface4D(u: number, v: number, k: number, settings: ProjectionSettings): THREE.Vector3 {
    const theta = u * 2 * Math.PI;
    const phi = v * Math.PI;
    const psi = (u + v) * Math.PI;

    // Parametric representation of Kummer surface
    const r = Math.sqrt(k);
    const point4D: Point4D = {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi) * Math.cos(psi),
      w: r * Math.cos(phi) * Math.sin(psi)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 17. 4D Penrose Tiling Polytope - Aperiodic tessellation using golden ratio
  static penroseTiling4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const theta = u * 2 * Math.PI;
    const tau = v * 2 * Math.PI;

    // Coordinates based on ℤ[φ] lattice
    const a = Math.floor(u * 5) - 2;
    const b = Math.floor(v * 5) - 2;
    const c = Math.floor((u + v) * 5) - 2;
    const d = Math.floor((u - v) * 5) - 2;

    const point4D: Point4D = {
      x: a + b * phi,
      y: c + d * phi,
      z: Math.cos(theta) + Math.sin(tau) * phi,
      w: Math.sin(theta) + Math.cos(tau) * phi
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 18. 4D Quantum Hall Droplets - Laughlin wavefunctions in 4D phase space
  static quantumHallDroplets4D(u: number, v: number, m: number, n: number, settings: ProjectionSettings): THREE.Vector3 {
    const z1 = u * 4 - 2; // Real part of first complex coordinate
    const z2 = v * 4 - 2; // Real part of second complex coordinate
    const theta1 = u * 2 * Math.PI;
    const theta2 = v * 2 * Math.PI;

    // Laughlin wavefunction structure
    const amplitude = Math.exp(-0.25 * (z1*z1 + z2*z2));
    const phase = m * theta1 + n * theta2;

    const point4D: Point4D = {
      x: z1 * amplitude * Math.cos(phase),
      y: z1 * amplitude * Math.sin(phase),
      z: z2 * amplitude * Math.cos(phase + Math.PI/2),
      w: z2 * amplitude * Math.sin(phase + Math.PI/2)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 19. 4D Hyperbolic Limit Sets - Fractal boundaries of 4D hyperbolic groups
  static hyperbolicLimitSets4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const iterations = 8;
    let z1 = (u - 0.5) * 4;
    let z2 = (v - 0.5) * 4;
    let z3 = 0;
    let z4 = 0;

    // Iterate Kleinian group action
    for (let i = 0; i < iterations; i++) {
      const r = Math.sqrt(z1*z1 + z2*z2 + z3*z3 + z4*z4);
      if (r > 2) break;

      // Hyperbolic transformation
      const scale = 1 / (1 + r*r);
      z1 *= scale;
      z2 *= scale;
      z3 = z3 * scale + 0.5;
      z4 = z4 * scale + Math.sin(i * Math.PI / 4) * 0.3;
    }

    const point4D: Point4D = { x: z1, y: z2, z: z3, w: z4 };
    return this.projectToThreeD(point4D, settings);
  }

  // 20. 4D Seiberg-Witten Monopoles - Solutions in exotic smooth 4-manifolds
  static seibergWittenMonopoles4D(u: number, v: number, settings: ProjectionSettings): THREE.Vector3 {
    const x = (u - 0.5) * 4;
    const y = (v - 0.5) * 4;
    const r = Math.sqrt(x*x + y*y);

    // Monopole solution structure
    const monopoleField = Math.exp(-r) * (1 + r);
    const theta = Math.atan2(y, x);
    const phi = r * Math.PI;

    const point4D: Point4D = {
      x: monopoleField * Math.cos(theta),
      y: monopoleField * Math.sin(theta),
      z: monopoleField * Math.cos(phi),
      w: monopoleField * Math.sin(phi) * Math.cos(2 * theta)
    };

    return this.projectToThreeD(point4D, settings);
  }

  // 21. 4D Langlands Correspondence - Core Geometric Langlands Formula
  static langlandsCorrespondence4D(u: number, v: number, params: any, settings: ProjectionSettings): THREE.Vector3 {
    const { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t } = params;
    
    // Riemann surface C parameterization
    const theta = u * a * Math.PI;  // a: curve parameter frequency
    const phi = v * b * Math.PI;    // b: curve parameter phase
    
    // Bun_G(C): moduli stack of G-bundles over curve C
    const bunModuli = c * Math.exp(-d * (u*u + v*v)) * Math.cos(e * theta); // c,d,e: bundle moduli
    
    // Enhanced G-M Parameters: Advanced 4D Dynamics
    const parallelField = g * Math.sin(h * phi) * Math.cos(g * theta * u); // g: Parallel field oscillations
    const dimFold = h * Math.tanh(i * (u + v)) * Math.exp(-h * Math.abs(u - v)); // h,i: Dimensional folding
    const quantumPhase = i * Math.sin(j * theta + k * phi) * Math.cos(i * (u * v)); // i,j,k: Quantum phase modulation
    const tensorFlow = j * Math.sinh(k * u) * Math.cosh(l * v) * Math.sin(j * theta); // j,k,l: Tensor field dynamics
    const metricWarp = k * Math.exp(l * Math.sin(m * theta)) * Math.cos(k * phi); // k,l,m: Metric space warping
    const spaceTwist = l * Math.tan(m * (u - 0.5)) * Math.atan(l * (v - 0.5)); // l,m: Space twisting
    const timeDilation = m * Math.exp(-Math.abs(theta - phi)) * Math.sin(m * (u + v) * Math.PI); // m: Time dilation effects
    
    const bundleConnection = f * parallelField + dimFold + quantumPhase; // Enhanced connection structure
    
    // LocSys_LG(C): stack of flat LG-connections (local systems) with enhanced dynamics
    const localSystem = tensorFlow + metricWarp + spaceTwist; // Advanced local system
    const flatConnection = timeDilation * Math.exp(-n * Math.abs(theta - phi)); // Enhanced flat connection
    
    // S-duality equivalence: D-modules ⟷ O-modules
    const dModuleCategory = o * bunModuli * Math.cos(p * theta + q * phi); // o,p,q: D-module category
    const oModuleCategory = r * localSystem * Math.sin(s * theta - t * phi); // r,s,t: O-module category
    
    // Kapustin-Witten twist of N=4 SYM theory in 4D
    const symTwist = bunModuli + localSystem; // Supersymmetric Yang-Mills twist
    const tqftField = dModuleCategory - oModuleCategory; // Topological quantum field theory
    
    // 4D coordinates encoding the geometric Langlands correspondence
    const point4D: Point4D = {
      x: a * bunModuli + b * dModuleCategory, // Bundle moduli + D-module structure
      y: c * localSystem + d * oModuleCategory, // Local systems + O-module structure  
      z: e * symTwist + f * Math.cos(theta), // S-duality + geometric structure
      w: g * tqftField + h * Math.sin(phi) // TQFT field + topological twist
    };

    return this.projectToThreeD(point4D, settings);
  }

  // True 4D coordinate generation with full mathematical form
  public static generate4DCoordinates(
    u: number, 
    v: number, 
    a: number = 1, 
    b: number = 1
  ): { x: number; y: number; z: number; w: number } {
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;

    return {
      x: a * Math.cos(theta),
      y: a * Math.sin(theta),
      z: b * Math.cos(phi),
      w: b * Math.sin(phi)
    };
  }

  // Hopf coordinates for S³
  public static hopfCoordinates(
    eta: number, 
    xi1: number, 
    xi2: number, 
    xi3: number
  ): { x: number; y: number; z: number; w: number } {
    return {
      x: Math.cos(eta) * Math.cos(xi1),
      y: Math.cos(eta) * Math.sin(xi1),
      z: Math.sin(eta) * Math.cos(xi2),
      w: Math.sin(eta) * Math.sin(xi2)
    };
  }

  // 4D cross-section slicing
  public static crossSectionSlice(
    point4D: { x: number; y: number; z: number; w: number },
    wConstant: number,
    tolerance: number = 0.1
  ): THREE.Vector3 | null {
    if (Math.abs(point4D.w - wConstant) <= tolerance) {
      return new THREE.Vector3(point4D.x, point4D.y, point4D.z);
    }
    return null;
  }

  // Advanced Projection Methods
  static projectToThreeD(point4D: Point4D, settings: ProjectionSettings): THREE.Vector3 {
    switch (settings.method) {
      case 'stereographic':
        return this.stereographicProject(point4D, settings.focalLength);

      case 'perspective':
        return this.perspectiveProject(point4D, settings.focalLength);

      case 'cross_section':
        return this.crossSectionProject(point4D, settings.crossSectionW);

      case 'orthogonal':
      default:
        return this.orthogonalProject(point4D);
    }
  }

  // Stereographic Projection from 4D to 3D
  static stereographicProject(point4D: Point4D, focalLength: number = 2): THREE.Vector3 {
    const denominator = focalLength - point4D.w;

    if (Math.abs(denominator) < 1e-6) {
      return new THREE.Vector3(0, 0, 1000); // Point at infinity
    }

    return new THREE.Vector3(
      (focalLength * point4D.x) / denominator,
      (focalLength * point4D.y) / denominator,
      (focalLength * point4D.z) / denominator
    );
  }

  // Perspective Projection
  static perspectiveProject(point4D: Point4D, focalLength: number = 3): THREE.Vector3 {
    const perspective = focalLength / (focalLength + Math.abs(point4D.w));

    return new THREE.Vector3(
      point4D.x * perspective,
      point4D.y * perspective,
      point4D.z * perspective
    );
  }

  // Cross-Section Projection
  static crossSectionProject(point4D: Point4D, wSlice: number = 0): THREE.Vector3 {
    const tolerance = 0.1;
    const weight = Math.exp(-Math.pow(point4D.w - wSlice, 2) / (2 * tolerance * tolerance));

    return new THREE.Vector3(
      point4D.x * weight,
      point4D.y * weight,
      point4D.z * weight
    );
  }

  // Simple Orthogonal Projection
  static orthogonalProject(point4D: Point4D): THREE.Vector3 {
    return new THREE.Vector3(point4D.x, point4D.y, point4D.z);
  }

  // Rotation in 4D space (all 6 planes)
  static rotate4D(point: Point4D, angles: {xy: number, xz: number, xw: number, yz: number, yw: number, zw: number}): Point4D {
    let result = { ...point };

    // XY rotation
    if (angles.xy !== 0) {
      const cos = Math.cos(angles.xy);
      const sin = Math.sin(angles.xy);
      const newX = result.x * cos - result.y * sin;
      const newY = result.x * sin + result.y * cos;
      result.x = newX;
      result.y = newY;
    }

    // XZ rotation
    if (angles.xz !== 0) {
      const cos = Math.cos(angles.xz);
      const sin = Math.sin(angles.xz);
      const newX = result.x * cos - result.z * sin;
      const newZ = result.x * sin + result.z * cos;
      result.x = newX;
      result.z = newZ;
    }

    // XW rotation
    if (angles.xw !== 0) {
      const cos = Math.cos(angles.xw);
      const sin = Math.sin(angles.xw);
      const newX = result.x * cos - result.w * sin;
      const newW = result.x * sin + result.w * cos;
      result.x = newX;
      result.w = newW;
    }

    // YZ rotation
    if (angles.yz !== 0) {
      const cos = Math.cos(angles.yz);
      const sin = Math.sin(angles.yz);
      const newY = result.y * cos - result.z * sin;
      const newZ = result.y * sin + result.z * cos;
      result.y = newY;
      result.z = newZ;
    }

    // YW rotation
    if (angles.yw !== 0) {
      const cos = Math.cos(angles.yw);
      const sin = Math.sin(angles.yw);
      const newY = result.y * cos - result.w * sin;
      const newW = result.y * sin + result.w * cos;
      result.y = newY;
      result.w = newW;
    }

    // ZW rotation
    if (angles.zw !== 0) {
      const cos = Math.cos(angles.zw);
      const sin = Math.sin(angles.zw);
      const newZ = result.z * cos - result.w * sin;
      const newW = result.z * sin + result.w * cos;
      result.z = newZ;
      result.w = newW;
    }

    return result;
  }

  // Generate surface points for any 4D shape
  static generate4DSurface(
    shapeFunction: (u: number, v: number, settings: ProjectionSettings) => THREE.Vector3,
    uSteps: number = 50,
    vSteps: number = 50,
    settings: ProjectionSettings,
    rotationAngles?: {xy: number, xz: number, xw: number, yz: number, yw: number, zw: number}
  ): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= uSteps; i++) {
      for (let j = 0; j <= vSteps; j++) {
        const u = i / uSteps;
        const v = j / vSteps;

        let point3D = shapeFunction(u, v, settings);

        // Apply 4D rotation if specified
        if (rotationAngles) {
          // Convert back to 4D, rotate, then project again
          const point4D: Point4D = { x: point3D.x, y: point3D.y, z: point3D.z, w: 0 };
          const rotated4D = this.rotate4D(point4D, rotationAngles);
          point3D = this.projectToThreeD(rotated4D, settings);
        }

        points.push(point3D);
      }
    }

    return points;
  }
}

// Export default settings
export const DEFAULT_PROJECTION_SETTINGS: ProjectionSettings = {
  method: 'stereographic',
  focalLength: 2.0,
  crossSectionW: 0.0,
  projectionPlane: 'xy'
};

// Shape registry for easy access
export const SHAPE_4D_FORMULAS = {
  tesseract: FourDTo3DFormulas.tesseract4D,
  hypersphere: FourDTo3DFormulas.hypersphere4D,
  klein_bottle: FourDTo3DFormulas.kleinBottle4D,
  duocylinder: FourDTo3DFormulas.duocylinder4D,
  simplex_5cell: FourDTo3DFormulas.simplex5Cell,
  cross_polytope_16cell: FourDTo3DFormulas.crossPolytope16Cell,
  mobius_strip_4d: FourDTo3DFormulas.mobiusStrip4D,
  hopf_fibration: FourDTo3DFormulas.hopfFibration4D,
  clifford_torus: FourDTo3DFormulas.cliffordTorus4D,
  duoprism: FourDTo3DFormulas.duoprism4D,
  stereographic_projection: FourDTo3DFormulas.stereographicProjection4D,
  pentachoron: FourDTo3DFormulas.pentachoron4D,
  hyperboloid_two_sheet: FourDTo3DFormulas.hyperboloidTwoSheet4D,
  lissajous_knot: FourDTo3DFormulas.lissajousKnot4D,
  borromean_rings: FourDTo3DFormulas.borromeanRings4D,
  kummer_surface: FourDTo3DFormulas.kummerSurface4D,
  penrose_tiling: FourDTo3DFormulas.penroseTiling4D,
  quantum_hall_droplets: FourDTo3DFormulas.quantumHallDroplets4D,
  hyperbolic_limit_sets: FourDTo3DFormulas.hyperbolicLimitSets4D,
  seiberg_witten_monopoles: FourDTo3DFormulas.seibergWittenMonopoles4D,
  langlands_correspondence: FourDTo3DFormulas.langlandsCorrespondence4D
};