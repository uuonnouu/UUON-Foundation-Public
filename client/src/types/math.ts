export type SurfaceType = 
  // Triangle-based shapes
  "triangular_prism" | "tetrahedron" | "triangular_pyramid" | "cone" |
  // Quadrilateral-based shapes - Square foundation first
  "square" | "cube" | "square_prism" | "rectangular_prism" | "rhombic_prism" | "parallelepiped" | "trapezoidal_prism" | "kite_prism" |
  // Polygon-based shapes (5-12)
  "pentagonal_prism" | "pentagonal_pyramid" |
  "hexagonal_prism" | "hexagonal_pyramid" |
  "heptagonal_prism" | "heptagonal_pyramid" |
  "octagonal_prism" | "octagonal_pyramid" |
  "nonagonal_prism" | "nonagonal_pyramid" |
  "decagonal_prism" | "decagonal_pyramid" |
  "hendecagonal_prism" | "hendecagonal_pyramid" |
  "dodecagonal_prism" | "dodecagonal_pyramid" |
  // Extended polygons (13-20)
  "tridecagonal_prism" | "tridecagonal_pyramid" |
  "tetradecagonal_prism" | "tetradecagonal_pyramid" |
  "pentadecagonal_prism" | "pentadecagonal_pyramid" |
  "hexadecagonal_prism" | "hexadecagonal_pyramid" |
  "heptadecagonal_prism" | "heptadecagonal_pyramid" |
  "octadecagonal_prism" | "octadecagonal_pyramid" |
  "enneadecagonal_prism" | "enneadecagonal_pyramid" |
  "icosagonal_prism" | "icosagonal_pyramid" |
  // High-precision polygons
  "polygon_24" | "polygon_30" | "polygon_36" | "polygon_48" | "polygon_60" | "polygon_72" |
  // Curved shapes
  "cylinder" | "sphere" | "torus" | "spherical_cap" |
  "ellipsoid" | "elliptical_cylinder" | "elliptical_cone" |
  "paraboloid" | "hyperboloid" |
  "hemisphere" | "half_cylinder" | "quarter_sphere" | "quarter_cylinder" |
  "annulus_torus" | "cylindrical_shell" |
  // Star polygons
  "star_5_prism" | "star_6_hexagram" | "star_8_octagram" |
  // Concave polygons
  "concave_pentagon" | "concave_hexagon" |
  // Composite shapes
  "crescent" | "heart_shape" | "kidney_shape" | "oval_prolate" | "oval_oblate" |
  "lens_biconvex" | "lens_biconcave" |
  // Technical shapes
  "airfoil_naca" | "gear_tooth" | "cam_profile" | "spline_surface" | "bezier_surface" | "nurbs_surface" |
  // Fractal and mathematical shapes
  "koch_snowflake" | "sierpinski_pyramid" | "dragon_curve" | "mandelbrot_solid" |
  // Architectural and design profiles
  "gothic_arch" | "roman_arch" | "ogee_curve" | "s_curve_flowing" |
  // Higher-dimensional projections
  "simplex_4d" | "hypersphere_4d" | "cell_16" | "cell_120" | "cell_600" |
  // Non-Euclidean Geometries
  // Hyperbolic geometry
  "pseudosphere" | "hyperbolic_paraboloid" | "hyperbolic_pentagon" | "hyperbolic_tiling" |
  // Spherical geometry  
  "spherical_triangle" | "spherical_polygon" |
  // Minkowski spacetime
  "minkowski_hyperboloid" | "light_cone" | "spacetime_geodesic";

export type VisualizationMode = 
  | "wireframe" 
  | "points" 
  | "surface"
  | "star"
  | "plus" 
  | "cross"
  | "lines"
  | "particles"
  | "volume"
  | "isosurface"
  | "vectors"
  | "streamlines";

export interface CustomEquation {
  x: string;
  y: string;
  z: string;
}

export interface SurfaceParameters {
  type: SurfaceType;
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  uSegments: number;
  vSegments: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  i: number;
  j: number;
  k: number;
  l: number;
  m: number;
  n: number;
  o: number;
  p: number;
  q: number;
  r: number;
  s: number;
  t: number;
  u: number;
  v: number;
  w: number;
  customEquation: CustomEquation;
}

export interface MathConstants {
  PI: number;
  E: number;
}

export interface MathFunctions {
  sin: (x: number) => number;
  cos: (x: number) => number;
  tan: (x: number) => number;
  exp: (x: number) => number;
  log: (x: number) => number;
  sqrt: (x: number) => number;
  abs: (x: number) => number;
  pow: (x: number, y: number) => number;
}