// Shape Information Display System
import { SurfaceParameters } from "../types/math";
import { getRiemannSurfaceInfo } from "./riemannSurfaces";
import { getSacredGeometryInfo } from "./sacredGeometry";
import { getGroupTheoryInfo } from "./groupTheory";
import { getCategoryTheoryInfo } from "./categoryTheory";
import { getTopologyKnotInfo } from "./topologyKnotsFixed";
import { getRealWorldObjectInfo } from "./realWorldObjects";

export interface ShapeInfo {
  name: string;
  type: string;
  vertices: number | string;
  geometry: string;
  parameters: string[];
  description: string;
  mathematical_basis: string;
}

// Comprehensive shape information database
export const SHAPE_INFORMATION: Record<string, ShapeInfo> = {
  // Prime Number Polygons - Special Mathematical Properties
  tridecagonal_prism: {
    name: "Tridecagon (13-sided polygon)",
    type: "Prime Geometry",
    vertices: 13,
    geometry: "Prime-sided polygon with singularity",
    parameters: ["a(scale)", "d(singularity)", "geometric-tension"],
    description: "13 is prime - creates mathematical singularity at center. The 'black hole' effect is intentional: prime-sided polygons cannot divide a circle evenly, creating geometric tension that concentrates toward the center.",
    mathematical_basis: "Prime number geometry: 360°/13 ≈ 27.69° creates irrational angular relationships and topological singularities"
  },

  heptagonal_prism: {
    name: "Heptagon (7-sided polygon)",
    type: "Prime Geometry",
    vertices: 7,
    geometry: "Prime-sided polygon with mild singularity",
    parameters: ["a(scale)", "d(concentration)", "prime-tension"],
    description: "7 is prime - creates subtle mathematical concentration at center. Prime polygons exhibit quantum-like behavior where geometric stress accumulates at singular points.",
    mathematical_basis: "Prime geometry: 360°/7 ≈ 51.43° creates non-constructible angular relationships"
  },

  hendecagonal_prism: {
    name: "Hendecagon (11-sided polygon)",
    type: "Prime Geometry",
    vertices: 11,
    geometry: "Prime-sided polygon with moderate singularity",
    parameters: ["a(scale)", "d(singularity)", "prime-effects"],
    description: "11 is prime - creates noticeable mathematical singularity. The geometric impossibility of even division manifests as energy concentration toward the center.",
    mathematical_basis: "Prime geometry: 360°/11 ≈ 32.73° creates irrational angular stress patterns"
  },

  heptadecagonal_prism: {
    name: "Heptadecagon (17-sided polygon)",
    type: "Prime Geometry",
    vertices: 17,
    geometry: "Prime-sided polygon with complex singularity",
    parameters: ["a(scale)", "d(singularity)", "complex-tension"],
    description: "17 is prime - creates complex mathematical singularity patterns. Higher prime numbers intensify the topological stress effects at the geometric center.",
    mathematical_basis: "Prime geometry: 360°/17 ≈ 21.18° creates intense angular relationship complexity"
  },

  enneadecagonal_prism: {
    name: "Enneadecagon (19-sided polygon)",
    type: "Prime Geometry",
    vertices: 19,
    geometry: "Prime-sided polygon with deep mathematical wells",
    parameters: ["a(scale)", "d(deep-singularity)", "prime-wells"],
    description: "19 is prime - creates deep mathematical wells at center. The higher the prime number, the more intense the geometric singularity becomes.",
    mathematical_basis: "Prime geometry: 360°/19 ≈ 18.95° creates profound topological stress concentration"
  },

  // COSMIC OBJECTS - Einstein Field Equations
  GRAVITY_WELL: {
    name: "Gravity Well",
    type: "Einstein Spacetime",
    vertices: 0,
    geometry: "Spacetime Curvature Visualization",
    parameters: ["a(mass)", "b(scale)", "d(lensing)", "e(metric)", "f(redshift)", "entropy"],
    description: "Visible gravitational field using Einstein Field Equations: Rμν - ½Rgμν = (8πG/c⁴)Tμν. Spacetime curvature Rs = 2GM/c² with gravitational effects and positive energy visualization. Particles follow inverse-square attraction force.",
    mathematical_basis: "Schwarzschild metric with visible spacetime distortion, gravitational entropy S = (kᵦc³A)/(4Gℏ)"
  },

  WHITE_HOLE: {
    name: "Time-Reversed White Hole",
    type: "Einstein Spacetime",
    vertices: 0,
    geometry: "Past-Pointing Event Horizon",
    parameters: ["a(mass)", "b(scale)", "d(oscillation)", "e(flux)", "f(blueshift)", "entropy-decrease"],
    description: "Hypothetical white hole - time-reversed black hole with same Schwarzschild radius but positive energy flux outward. Matter explodes out, nothing can enter. Creates thermodynamic paradoxes with negative entropy change.",
    mathematical_basis: "Same metric as black hole but reversed causality, gravitational blueshift, repulsive inverse-square force"
  },

  WORMHOLE: {
    name: "Einstein-Rosen Bridge",
    type: "Spacetime Topology",
    vertices: 0,
    geometry: "Throat Connecting Two Regions",
    parameters: ["a(throat-radius)", "c(length)", "d(curvature)", "e(stability)", "embedding"],
    description: "Theoretical wormhole connecting distant spacetime regions. Throat radius varies with distance, requires exotic matter for stability. Represents non-trivial spacetime topology.",
    mathematical_basis: "Morris-Thorne traversable wormhole metric with throat function r(z) = √(b² + z²)"
  },

  ERGOSPHERE: {
    name: "Kerr Black Hole Ergosphere",
    type: "Rotating Spacetime",
    vertices: 0,
    geometry: "Frame-Dragging Region",
    parameters: ["a(mass)", "b(spin)", "angular-momentum", "frame-drag", "rotation"],
    description: "Region around rotating black hole where spacetime is dragged by rotation. Frame-dragging effects cause objects to co-rotate. Demonstrates general relativistic effects beyond Schwarzschild solution.",
    mathematical_basis: "Kerr metric with angular momentum parameter, ergosphere radius depends on polar angle"
  },

  // Basic Surfaces
  cone: {
    name: "Cone",
    type: "Euclidean",
    vertices: 0,
    geometry: "Circular Base → Apex",
    parameters: ["a(radius)", "height"],
    description: "Circular cone with parametric height variation",
    mathematical_basis: "x=v·cos(u), y=v·sin(u), z=10-v"
  },
  
  sphere: {
    name: "Sphere",
    type: "Euclidean",
    vertices: 0,
    geometry: "Spherical Surface",
    parameters: ["a(radius)", "latitude", "longitude"],
    description: "Perfect sphere with radius control",
    mathematical_basis: "x=r·sin(φ)·cos(θ), y=r·sin(φ)·sin(θ), z=r·cos(φ)"
  },

  // Foundation shapes - Square comes before cube in design flow
  square: {
    name: "Square",
    type: "2D Foundation",
    vertices: 4,
    geometry: "Four Equal Sides",
    parameters: ["a(size)", "b(width)", "c(constraint)", "d(limit)"],
    description: "Perfect square foundation for all quadrilateral forms - flat 2D shape with dimensional limits",
    mathematical_basis: "4-sided polygon with equal edges, constrained by parameter d to prevent expansion beyond limits"
  },

  cube: {
    name: "Cube",
    type: "3D Extension",
    vertices: 8,
    geometry: "Six Square Faces",
    parameters: ["a(size)", "b(width)", "c(height)", "d(dimensional_limit)"],
    description: "Perfect cube built from square foundation with dimensional constraints - cannot expand beyond parameter d",
    mathematical_basis: "6-faced polyhedron with square foundation, size limited by min(a*b, |d|) for proper spacetime dynamics"
  },

  cylinder: {
    name: "Cylinder",
    type: "Euclidean",
    vertices: 0,
    geometry: "Circular Profile → Linear",
    parameters: ["a(radius)", "height"],
    description: "Circular cylinder with uniform radius",
    mathematical_basis: "x=r·cos(θ), y=r·sin(θ), z=h"
  },

  torus: {
    name: "Torus",
    type: "Euclidean",
    vertices: 0,
    geometry: "Major/Minor Radii",
    parameters: ["a(major)", "b(minor)"],
    description: "Donut shape with major and minor radii",
    mathematical_basis: "(R+r·cos(v))·cos(u), (R+r·cos(v))·sin(u), r·sin(v)"
  },

  hyperboloid: {
    name: "Hyperboloid",
    type: "Euclidean",
    vertices: 0,
    geometry: "Hyperbolic Cross-Section",
    parameters: ["a(scale)", "curvature"],
    description: "Hyperboloid of one sheet",
    mathematical_basis: "x=a·cosh(u)·cos(v), y=a·cosh(u)·sin(v), z=a·sinh(u)"
  },

  paraboloid: {
    name: "Paraboloid",
    type: "Euclidean",
    vertices: 0,
    geometry: "Parabolic Surface",
    parameters: ["a(curvature)", "u-range", "v-range"],
    description: "Elliptic paraboloid surface",
    mathematical_basis: "x=u, y=v, z=a(u²+v²)"
  },

  helicoid: {
    name: "Helicoid",
    type: "Euclidean",
    vertices: 0,
    geometry: "Helical Surface",
    parameters: ["a(pitch)", "radius"],
    description: "Minimal helical surface",
    mathematical_basis: "x=v·cos(u), y=v·sin(u), z=a·u"
  },

  mobius: {
    name: "Möbius Strip",
    type: "Non-Orientable",
    vertices: 0,
    geometry: "Twisted Loop",
    parameters: ["a(radius)", "twist", "width"],
    description: "Non-orientable surface with single twist",
    mathematical_basis: "(a+v·cos(u/2))·cos(u), (a+v·cos(u/2))·sin(u), v·sin(u/2)"
  },

  // Polygon Prisms
  triangular_prism: {
    name: "Triangular Prism",
    type: "Polygonal",
    vertices: 6,
    geometry: "3-sided → Linear",
    parameters: ["a(size)", "b(width)", "c(height)"],
    description: "Three-sided prismatic structure",
    mathematical_basis: "Triangular cross-section with linear extrusion"
  },

  tetrahedron: {
    name: "Tetrahedron",
    type: "Platonic",
    vertices: 4,
    geometry: "4 Triangular Faces",
    parameters: ["a(scale)", "symmetry"],
    description: "Regular tetrahedron - simplest polyhedron",
    mathematical_basis: "Four vertices forming equilateral triangular faces"
  },

  tridecagonal_pyramid: {
    name: "Tridecagonal Pyramid",
    type: "High-Order Pyramid",
    vertices: 14,
    geometry: "13-sided Base → Apex",
    parameters: ["a(base-radius)", "height", "d(taper)"],
    description: "13-sided base converging to single apex",
    mathematical_basis: "13 base vertices scaling to apex point"
  },

  // Star Polygons
  star_5_prism: {
    name: "5-Point Star Prism",
    type: "Star Polygon",
    vertices: 10,
    geometry: "Pentagram → Linear",
    parameters: ["a(outer)", "e(inner)", "f(outer-ratio)", "depth"],
    description: "Five-pointed star with alternating radii",
    mathematical_basis: "Alternating inner/outer radius pentagram"
  },

  // Complex Shapes
  heart_shape: {
    name: "Cardioid Heart",
    type: "Parametric Curve",
    vertices: 0,
    geometry: "Heart-shaped Profile",
    parameters: ["a(scale)", "d(shape)", "depth"],
    description: "Mathematical heart curve (cardioid)",
    mathematical_basis: "x=16sin³(t), y=13cos(t)-5cos(2t)-2cos(3t)-cos(4t)"
  },

  gear_tooth: {
    name: "Involute Gear",
    type: "Mechanical",
    vertices: 16,
    geometry: "Gear Teeth Profile",
    parameters: ["a(base-radius)", "teeth-count", "e(base)", "f(tip)"],
    description: "Involute gear tooth profile",
    mathematical_basis: "Involute curve generation with tooth spacing"
  },

  airfoil_naca: {
    name: "NACA Airfoil",
    type: "Aerodynamic",
    vertices: 0,
    geometry: "Wing Cross-Section",
    parameters: ["a(chord)", "d(thickness)", "e(camber)"],
    description: "NACA 4-digit airfoil profile",
    mathematical_basis: "yt=t(0.2969√x-0.1260x-0.3516x²+0.2843x³-0.1015x⁴)"
  },

  // 4D Projections


  cell_24: {
    name: "24-Cell (Icositetrachoron)",
    type: "4D Regular Polytope",
    vertices: 24,
    geometry: "Self-dual 4D polytope with 24 octahedral cells",
    parameters: ["a(scale)", "d(rotation)", "e(F₄-symmetry)", "octahedral-cells"],
    description: "Self-dual 4D polytope with vertices at (±1,±1,0,0) and permutations. Edge length √2, hypervolume 2.",
    mathematical_basis: "F₄ symmetry group (1152 elements), 24 octahedral cells, edge length √2"
  },

  klein_bottle_4d: {
    name: "Klein Bottle 4D",
    type: "Non-orientable 4D Surface",
    vertices: 0,
    geometry: "Non-orientable closed surface embedded in 4D",
    parameters: ["a(radius)", "b(u-scale)", "c(v-scale)", "d(cos-term)", "e(sin-term)", "f-m(topology)"],
    description: "Non-orientable closed surface properly embedded in 4D space without self-intersection. Complete 4D parametric equations including w-component.",
    mathematical_basis: "x=(r+cos(u/2)sin(v)-sin(u/2)sin(2v))cos(u), y=(r+cos(u/2)sin(v)-sin(u/2)sin(2v))sin(u), z=sin(u/2)sin(v)+cos(u/2)sin(2v), w=cos(u/2)cos(v)"
  },

  torus_4d: {
    name: "4D Torus (Duocylinder)",
    type: "4D Cartesian Product",
    vertices: 0,
    geometry: "S¹ × S¹ in 4D space",
    parameters: ["a(R₁)", "b(u-scale)", "c(v-scale)", "h(R₂)", "d-l(modulation)"],
    description: "Cartesian product of two circles S¹ × S¹. Four-dimensional torus with independent radii R₁ and R₂.",
    mathematical_basis: "x=R₁cos(u), y=R₁sin(u), z=R₂cos(v), w=R₂sin(v) where u,v ∈ [0,2π]"
  },

  hopf_fibration: {
    name: "Hopf Fibration",
    type: "S³ → S² Fiber Bundle",
    vertices: 0,
    geometry: "3-sphere to 2-sphere mapping",
    parameters: ["a(radius)", "b(fiber-param)", "c(base-param)", "d(projection)", "e-i(fiber-bundle)"],
    description: "S³ → S² fiber bundle mapping with circles S¹ as fibers. Stereographic projection from 3-sphere to ℝ³ ∪ {∞}.",
    mathematical_basis: "Base space: 2-sphere S², Fiber: circles S¹, Total space: 3-sphere S³, Stereographic projection"
  },

  mobius_4d: {
    name: "4D Möbius Strip (Cross-cap)",
    type: "Non-orientable 4D Surface",
    vertices: 0,
    geometry: "Non-orientable surface in 4D",
    parameters: ["a(scale)", "b(u-param)", "c(v-param)", "d-i(topology)", "cross-cap"],
    description: "Non-orientable surface properly embedded in 4D space. Cross-cap topology with u ∈ [0,2π], v ∈ [-π/2,π/2].",
    mathematical_basis: "x=cos(u)cos(v), y=sin(u)cos(v), z=sin(v)cos(u/2), w=sin(v)sin(u/2)"
  },

  hypercylinder: {
    name: "Hypercylinder",
    type: "4D Cylinder",
    vertices: 0,
    geometry: "3D cylinder extended into 4th dimension",
    parameters: ["a(radius)", "c(height)", "d(w-extension)", "e-i(4D-characteristics)"],
    description: "3D cylinder extended into 4th dimension. Equation: x² + y² ≤ r², z ∈ [0,h], w ∈ ℝ. Circular cross-sections varying along w-axis.",
    mathematical_basis: "x²+y²≤r² with infinite extension along w-axis, circular disk cross-sections"
  },

  hyperellipsoid_4d: {
    name: "4D Hyperellipsoid",
    type: "4D Ellipsoid",
    vertices: 0,
    geometry: "4D generalization of ellipsoid",
    parameters: ["a(semi-axis-a)", "b(semi-axis-b)", "c(semi-axis-c)", "d(semi-axis-d)", "e-j(4D-ellipse)"],
    description: "Four-dimensional ellipsoid with equation (x/a)² + (y/b)² + (z/c)² + (w/d)² = 1. Volume: (π²/2)abcd.",
    mathematical_basis: "(x/a)²+(y/b)²+(z/c)²+(w/d)²=1, Volume=(π²/2)abcd, complex elliptic surface integrals"
  },

  schlafli_double_six: {
    name: "Schläfli Double Six",
    type: "4D Projective Configuration",
    vertices: 30,
    geometry: "12 lines in 4D projective space",
    parameters: ["a(scale)", "d(intersection-pattern)", "e-f(projective)", "A₆-automorphism"],
    description: "Configuration of 12 lines in 4D projective space with 30 intersection points. Each line intersects exactly 5 others. Automorphism group: A₆.",
    mathematical_basis: "12 lines, 30 intersection points, each line intersects 5 others, A₆ automorphism group"
  },

  hyperprism_4d: {
    name: "4D Hyperprism Family",
    type: "3D Polytope × Interval",
    vertices: "Variable",
    geometry: "3D polytope extended into 4th dimension",
    parameters: ["a(base-size)", "d(polytope-type)", "h(interval-length)", "e-j(hyperprism)"],
    description: "3D polytope × interval structure. Examples: Cube×I, Dodecahedron×I, Icosahedron×I. General volume: V₃D × length.",
    mathematical_basis: "3D polytope cross products with intervals, Volume = V₃D × length"
  },

  clifford_torus: {
    name: "Clifford Torus",
    type: "Flat Torus in S³",
    vertices: 0,
    geometry: "Flat torus embedded in 3-sphere",
    parameters: ["a(scale)", "b(u-param)", "c(v-param)", "d-i(flat-torus)", "S³-embedding"],
    description: "Flat torus embedded in S³ with constant curvature = 0. Parametric equations use 1/√2 normalization factor.",
    mathematical_basis: "x=(1/√2)cos(u), y=(1/√2)sin(u), z=(1/√2)cos(v), w=(1/√2)sin(v), constant curvature = 0"
  },

  simplex_4d: {
    name: "4D Simplex",
    type: "4D Tetrahedron",
    vertices: 5,
    geometry: "5 Vertices → 4D Space",
    parameters: ["a(scale)", "4D-rotation", "projection"],
    description: "Four-dimensional simplex (5-cell)",
    mathematical_basis: "5 vertices in 4D forming tetrahedral arrangement"
  },

  hypersphere_4d: {
    name: "4D Hypersphere",
    type: "4D Sphere",
    vertices: 0,
    geometry: "4D Sphere → 3D Section",
    parameters: ["a(radius)", "w(4th-dimension)", "projection"],
    description: "Four-dimensional sphere cross-section",
    mathematical_basis: "x²+y²+z²+w²=r² with stereographic projection"
  },

  // Fractals
  koch_snowflake: {
    name: "Koch Snowflake",
    type: "Fractal",
    vertices: "∞",
    geometry: "Recursive Triangle",
    parameters: ["a(scale)", "d(iterations)", "e(length)", "recursion"],
    description: "Self-similar fractal curve",
    mathematical_basis: "Recursive triangle generation with 1/3 rule"
  },

  sierpinski_pyramid: {
    name: "Sierpiński Pyramid",
    type: "3D Fractal",
    vertices: "∞",
    geometry: "Recursive Tetrahedra",
    parameters: ["a(scale)", "d(levels)", "subdivision"],
    description: "3D Sierpiński triangle fractal",
    mathematical_basis: "Recursive tetrahedral subdivision"
  },

  dragon_curve: {
    name: "Dragon Curve",
    type: "L-System Fractal",
    vertices: "∞",
    geometry: "Self-Similar Curve",
    parameters: ["a(scale)", "d(iterations)", "angle"],
    description: "Dragon fractal using L-system generation",
    mathematical_basis: "L-system: X→X+YF+, Y→-FX-Y with 90° turns"
  },

  mandelbrot_solid: {
    name: "Mandelbrot Set",
    type: "Complex Fractal",
    vertices: 0,
    geometry: "Escape-Time Surface",
    parameters: ["a(scale)", "d(iterations)", "e(threshold)"],
    description: "3D representation of Mandelbrot set",
    mathematical_basis: "z_{n+1}=z_n²+c with escape-time algorithm"
  },

  // NON-EUCLIDEAN GEOMETRIES

  // Hyperbolic Geometry
  pseudosphere: {
    name: "Pseudosphere",
    type: "Hyperbolic",
    vertices: 0,
    geometry: "Negative Curvature Surface",
    parameters: ["a(scale)", "d(angle-mult)", "e(curvature)"],
    description: "Surface of constant negative curvature K=-1",
    mathematical_basis: "Tractrix revolution: x=sech(t), z=t-tanh(t)"
  },

  hyperbolic_paraboloid: {
    name: "Hyperbolic Paraboloid",
    type: "Hyperbolic",
    vertices: 0,
    geometry: "Saddle Surface",
    parameters: ["a(scale)", "d(u-scale)", "e(v-scale)", "curvature"],
    description: "Saddle-shaped surface with negative Gaussian curvature",
    mathematical_basis: "z = x²/a² - y²/b² (hyperbolic paraboloid)"
  },

  hyperbolic_pentagon: {
    name: "Hyperbolic Pentagon",
    type: "Hyperbolic Polygon",
    vertices: 5,
    geometry: "5-sided Hyperbolic",
    parameters: ["a(scale)", "d(hyperbolic-factor)", "e(radius)", "curvature"],
    description: "Regular pentagon in hyperbolic space",
    mathematical_basis: "Poincaré disk model with hyperbolic distance scaling"
  },

  hyperbolic_tiling: {
    name: "Hyperbolic Tiling",
    type: "Hyperbolic Pattern",
    vertices: "∞",
    geometry: "Poincaré Disk Tiling",
    parameters: ["a(scale)", "d(pattern-scale)", "e(radius)", "tiling-type"],
    description: "Hyperbolic tiling pattern in Poincaré disk",
    mathematical_basis: "Poincaré disk model with (7,3) heptagonal tiling"
  },

  // Spherical Geometry
  spherical_triangle: {
    name: "Spherical Triangle",
    type: "Spherical",
    vertices: 3,
    geometry: "Curved Triangle on Sphere",
    parameters: ["a(radius)", "d(latitude-range)", "e(vertex1)", "angles"],
    description: "Triangle with curved edges on sphere surface",
    mathematical_basis: "Great circle arcs connecting three spherical points"
  },

  spherical_polygon: {
    name: "Spherical Polygon",
    type: "Spherical",
    vertices: "3-11",
    geometry: "N-sided Spherical",
    parameters: ["a(radius)", "d(sides)", "e(latitude-var)", "curvature"],
    description: "Multi-sided polygon on sphere with curved edges",
    mathematical_basis: "Spherical linear interpolation along great circles"
  },

  // Minkowski Spacetime
  minkowski_hyperboloid: {
    name: "Minkowski Hyperboloid",
    type: "Spacetime",
    vertices: 0,
    geometry: "Spacetime Hyperboloid",
    parameters: ["a(scale)", "d(time-scale)", "e(proper-time)", "spacetime"],
    description: "Hyperboloid in Minkowski spacetime",
    mathematical_basis: "ds²=-c²dt²+dx²+dy²+dz² (Minkowski metric)"
  },

  light_cone: {
    name: "Light Cone",
    type: "Spacetime",
    vertices: 0,
    geometry: "Causal Structure",
    parameters: ["a(time-scale)", "d(time-coord)", "e(light-speed)", "causality"],
    description: "Fundamental spacetime light cone structure",
    mathematical_basis: "x²+y²=c²t² (light cone constraint)"
  },

  spacetime_geodesic: {
    name: "Spacetime Geodesic",
    type: "Spacetime",
    vertices: 0,
    geometry: "Curved Spacetime Path",
    parameters: ["a(scale)", "d(proper-time)", "e(curvature)", "geodesic"],
    description: "Curved path through spacetime",
    mathematical_basis: "Geodesic equation with spacetime curvature effects"
  }
};

// Function to get shape information
export function getShapeInfo(shapeType: string, parameters: SurfaceParameters): string {
  const info = SHAPE_INFORMATION[shapeType];
  if (!info) {
    return `${shapeType} | Unknown | Vertices: N/A | Parameters: Standard`;
  }

  // Calculate dynamic vertex count for relevant shapes
  let vertexCount: string | number = info.vertices;
  if (typeof vertexCount === 'string' && vertexCount !== '∞') {
    // Handle special cases like variable polygon sides
    if (shapeType.includes('spherical_polygon')) {
      vertexCount = Math.floor(parameters.d * 8) + 3;
    } else if (shapeType.includes('gear')) {
      vertexCount = Math.floor(parameters.d * 12) + 8;
    }
  }

  // Active parameters (non-default values)
  const activeParams = [];
  if (parameters.a !== 2) activeParams.push(`a:${parameters.a.toFixed(3)}`);
  if (parameters.b !== 1) activeParams.push(`b:${parameters.b.toFixed(3)}`);
  if (parameters.c !== 1) activeParams.push(`c:${parameters.c.toFixed(3)}`);
  if (parameters.d !== 1) activeParams.push(`d:${parameters.d.toFixed(3)}`);
  if (parameters.e !== 1) activeParams.push(`e:${parameters.e.toFixed(3)}`);
  if (parameters.f !== 1) activeParams.push(`f:${parameters.f.toFixed(3)}`);

  const paramString = activeParams.length > 0 ? activeParams.join(', ') : 'default';

  return `${info.name} | ${info.type} | Vertices: ${vertexCount} | ${info.geometry} | Active: ${paramString}`;
}

// Function to get mathematical basis
export function getShapeMathBasis(shapeType: string): string {
  const info = SHAPE_INFORMATION[shapeType];
  return info ? info.mathematical_basis : 'Standard parametric equations';
}

// Function to get extended description
export function getShapeDescription(shapeType: string): string {
  const info = SHAPE_INFORMATION[shapeType];
  if (info) return info.description;
  
  // Check for real-world objects
  const realWorldTypes = ['sun', 'sunflower', 'letter_A', 'number_3', 'apple', 'star_3d'];
  if (realWorldTypes.includes(shapeType)) {
    const realWorldInfo = getRealWorldObjectInfo(shapeType);
    return realWorldInfo.mathematical_basis;
  }
  
  // Check for advanced mathematical structures
  const categoryTypes = ['functor_mapping', 'natural_transformation', 'adjoint_functors'];
  if (categoryTypes.includes(shapeType)) {
    const categoryInfo = getCategoryTheoryInfo(shapeType);
    return categoryInfo.description;
  }
  
  const topologyTypes = ['klein_bottle', 'trefoil_knot', 'figure8_knot', 'genus2_surface', 'genus3_surface', 'fiber_bundle', 'homotopy_deformation'];
  if (topologyTypes.includes(shapeType)) {
    const topologyInfo = getTopologyKnotInfo(shapeType);
    return topologyInfo.mathematical_basis;
  }
  
  const groupTypes = ['icosahedron_group', 'dodecahedron_group', 'cubic_lattice', 'fcc_lattice', 'hcp_lattice'];
  if (groupTypes.includes(shapeType)) {
    const groupInfo = getGroupTheoryInfo(shapeType);
    return groupInfo.description;
  }
  
  const sacredTypes = ['root_chakra', 'sacral_chakra', 'solar_plexus_chakra', 'heart_chakra', 'throat_chakra', 'third_eye_chakra', 'crown_chakra', 'tree_of_life'];
  if (sacredTypes.includes(shapeType)) {
    const sacredInfo = getSacredGeometryInfo(shapeType);
    return sacredInfo.description;
  }
  
  // Check for Riemann surface information
  const riemannTypes = ['square_root_riemann', 'logarithm_riemann', 'exponential_riemann', 'nth_root_riemann', 'modular_function', 'elliptic_function'];
  if (riemannTypes.includes(shapeType)) {
    const riemannInfo = getRiemannSurfaceInfo(shapeType);
    return riemannInfo.mathematicalBasis;
  }
  
  return 'Mathematical surface';
}