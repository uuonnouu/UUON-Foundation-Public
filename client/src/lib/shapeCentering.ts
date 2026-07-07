// Shape Centering and Parameter Isolation System
import { SurfaceType, SurfaceParameters } from "../../../shared/schema";
import { getShapeDefaults } from "./shapeDefaults";

export interface ShapeCenteringConfig {
  centerX: number;
  centerY: number;
  centerZ: number;
  scale: number;
  rotation: { x: number; y: number; z: number };
  parameterIsolation: boolean;
}

// Grid-centered configurations for all shapes
export const SHAPE_CENTERING: Record<SurfaceType, ShapeCenteringConfig> = {
  // Basic shapes - perfectly centered
  triangular_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  square: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cube: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  // Pentagon - grid-centered with balanced scaling
  pentagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.9, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  pentagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.9, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  // Hexagon - FIXED: properly centered to grid
  hexagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hexagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  // Heptagon through Dodecagon
  heptagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.8, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  heptagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.8, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  octagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.8, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  octagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.8, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  nonagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.75, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  nonagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.75, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  // Decagon - FIXED: properly centered to grid with balanced scaling
  decagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  decagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  hendecagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.7, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hendecagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.7, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  dodecagonal_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.7, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  dodecagonal_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 0.7, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  // Extended polygons removed (13-20) - jumping to 24+ sided for cleaner progression
  
  // High-precision polygons removed - cleaner system progression
  
  // All other shapes with default centering
  tetrahedron: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  triangular_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  square_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  square_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  
  // Continue with all remaining shapes using default centering
  hemisphere: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  spherical_cap: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  quarter_sphere: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  annulus_torus: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cylindrical_shell: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  star_5_prism: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  star_6_hexagram: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  star_8_octagram: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  concave_pentagon: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  concave_hexagon: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  crescent: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  heart_shape: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  kidney_shape: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  oval_prolate: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  oval_oblate: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  lens_biconvex: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  lens_biconcave: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  airfoil_naca: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  gear_tooth: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cam_profile: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  spline_surface: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  bezier_surface: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  nurbs_surface: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  koch_snowflake: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  sierpinski_pyramid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  dragon_curve: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  mandelbrot_solid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  gothic_arch: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  roman_arch: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  ogee_curve: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  s_curve_flowing: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },

  simplex_4d: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hypersphere_4d: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cell_16: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cell_120: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cell_600: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  pseudosphere: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hyperbolic_paraboloid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hyperbolic_pentagon: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hyperbolic_tiling: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  spherical_triangle: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  spherical_polygon: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  minkowski_hyperboloid: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  light_cone: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  spacetime_geodesic: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  square_root_riemann: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  logarithm_riemann: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  exponential_riemann: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  nth_root_riemann: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  modular_function: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  elliptic_function: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  root_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  sacral_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  solar_plexus_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  heart_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  throat_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  third_eye_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  crown_chakra: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  tree_of_life: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  icosahedron_group: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  dodecahedron_group: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  cubic_lattice: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  fcc_lattice: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  hcp_lattice: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  functor_mapping: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  natural_transformation: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  adjoint_functors: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  klein_bottle: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  trefoil_knot: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  figure8_knot: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  genus2_surface: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  genus3_surface: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  fiber_bundle: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  homotopy_deformation: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  sun: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  sunflower: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  letter_A: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  number_3: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  apple: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  star_3d: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  GRAVITY_WELL: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  WHITE_HOLE: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  WORMHOLE: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true },
  ERGOSPHERE: { centerX: 0, centerY: 0, centerZ: 0, scale: 1.0, rotation: { x: 0, y: 0, z: 0 }, parameterIsolation: true }
};

// Parameter isolation function - creates fresh parameters for each shape
export function getIsolatedShapeParameters(shapeType: SurfaceType): SurfaceParameters {
  console.log('Getting isolated parameters for shape:', shapeType);
  
  // Get the shape's default parameters
  const shapeDefaults = getShapeDefaults(shapeType);
  console.log('Shape defaults:', shapeDefaults);
  
  // Create completely isolated parameters with no contamination from previous selections
  const isolatedParameters: SurfaceParameters = {
    type: shapeType,
    uMin: shapeDefaults.uMin,
    uMax: shapeDefaults.uMax,
    vMin: shapeDefaults.vMin,
    vMax: shapeDefaults.vMax,
    uSegments: shapeDefaults.uSegments,
    vSegments: shapeDefaults.vSegments,
    a: shapeDefaults.a,
    b: shapeDefaults.b,
    c: shapeDefaults.c,
    d: shapeDefaults.d,
    e: shapeDefaults.e,
    f: shapeDefaults.f,
    g: shapeDefaults.g,
    h: shapeDefaults.h,
    i: shapeDefaults.i,
    j: shapeDefaults.j,
    k: shapeDefaults.k,
    l: shapeDefaults.l,
    m: shapeDefaults.m,
    n: shapeDefaults.n,
    o: shapeDefaults.o,
    p: shapeDefaults.p,
    q: shapeDefaults.q,
    r: shapeDefaults.r,
    s: shapeDefaults.s,
    t: shapeDefaults.t,
    u: shapeDefaults.u,
    v: shapeDefaults.v,
    w: shapeDefaults.w,
  };
  
  console.log('Isolated parameters created:', isolatedParameters);
  return isolatedParameters;
}

// Apply centering transform for Three.js positioning
export function applyCenteringTransform(shapeType: SurfaceType): { position: [number, number, number]; scale: number; rotation: [number, number, number] } {
  const config = SHAPE_CENTERING[shapeType];
  return {
    position: [config.centerX, config.centerY, config.centerZ],
    scale: config.scale,
    rotation: [config.rotation.x, config.rotation.y, config.rotation.z]
  };
}

