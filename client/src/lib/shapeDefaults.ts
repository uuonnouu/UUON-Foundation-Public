import { SurfaceType, SurfaceParameters } from "../../../shared/schema";

// Shape-specific default parameters to ensure each shape loads in its proper whole form
export const SHAPE_DEFAULTS: Record<SurfaceType, Partial<SurfaceParameters>> = {
  // Triangle-based shapes - RESTORED VIBRANCY
  triangular_prism: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1, uSegments: 30, vSegments: 20, a: 2, b: 1, c: 2, d: 1, e: 1, f: 1 },
  tetrahedron: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  triangular_pyramid: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1, uSegments: 30, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  // Square pyramid: u ∈ [0,1] for n=4 LERP, v=0 apex → v=1 base; a=base radius, c=height
  square_pyramid: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 20, a: 2, b: 1, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  // Cone: u ∈ [0, 2π], v ∈ [0, 1]; a=base radius, c=height; b/d/e/f unused
  cone: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1, uSegments: 40, vSegments: 20, a: 2, b: 1, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Quadrilateral-based shapes - DYNAMIC EXPANSION
  square: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1, uSegments: 16, vSegments: 16, a: 3.5, b: 2, c: 1.5, d: 2.5, e: 1.8, f: 2.1 },
  // 6-face switch family: cube / square_prism / rectangular_prism
  // u ∈ [0,1] split into 6 face bands — uSegments MUST be a multiple of 6
  // a = x half-extent, c = y half-extent, d = z half-extent; b = unused (leave at 1)
  cube:              { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 20, a: 2,   b: 1, c: 2,   d: 2,   e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  square_prism:      { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 20, a: 1.5, b: 1, c: 1.5, d: 3,   e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  rectangular_prism: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 20, a: 3,   b: 1, c: 1.5, d: 2,   e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  rhombic_prism: { uMin: 0, uMax: Math.PI * 2, vMin: -3, vMax: 3, uSegments: 20, vSegments: 20, a: 4.5, b: 3.2, c: 2.4, d: 2.9, e: 3.4, f: 2.6 },
  parallelepiped: { uMin: 0, uMax: Math.PI * 2, vMin: -3, vMax: 3, uSegments: 20, vSegments: 20, a: 4.8, b: 2.9, c: 1.8, d: 3.1, e: 2.3, f: 3.5 },
  trapezoidal_prism: { uMin: 0, uMax: Math.PI * 2, vMin: -3, vMax: 3, uSegments: 20, vSegments: 20, a: 4.3, b: 3.1, c: 2.6, d: 2.7, e: 3.8, f: 2.2 },
  kite_prism: { uMin: 0, uMax: Math.PI * 2, vMin: -3, vMax: 3, uSegments: 20, vSegments: 20, a: 4.6, b: 3.4, c: 2.3, d: 3.3, e: 2.8, f: 3.1 },

  // Polygon-based shapes (5-12): uMin/uMax = 0/1 so the n-gon edge formula works correctly
  pentagonal_prism:    { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 30, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  pentagonal_pyramid:  { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 30, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  hexagonal_prism:     { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 36, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  hexagonal_pyramid:   { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 36, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  heptagonal_prism:    { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 42, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  heptagonal_pyramid:  { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 42, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  octagonal_prism:     { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 48, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  octagonal_pyramid:   { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 48, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  nonagonal_prism:     { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 54, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  nonagonal_pyramid:   { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 54, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  decagonal_prism:     { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 60, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  decagonal_pyramid:   { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 60, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  hendecagonal_prism:  { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 66, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  hendecagonal_pyramid:{ uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 66, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  dodecagonal_prism:   { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 72, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  dodecagonal_pyramid: { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 72, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },

  // Extended polygons (13-20): uMin/uMax = 0/1 for correct n-gon formula
  tridecagonal_prism:    { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 78, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  tridecagonal_pyramid:  { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 78, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  tetradecagonal_prism:  { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 84, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  tetradecagonal_pyramid:{ uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 84, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  pentadecagonal_prism:  { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 90, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  pentadecagonal_pyramid:{ uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 90, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  hexadecagonal_prism:   { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 96, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  hexadecagonal_pyramid: { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 96, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  heptadecagonal_prism:  { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 102,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  heptadecagonal_pyramid:{ uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 102,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  octadecagonal_prism:   { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 108,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  octadecagonal_pyramid: { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 108,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  enneadecagonal_prism:  { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 114,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  enneadecagonal_pyramid:{ uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 114,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  icosagonal_prism:      { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 120,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },
  icosagonal_pyramid:    { uMin: 0, uMax: 1, vMin: 0,  vMax: 1, uSegments: 120,vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1 },

  // High-precision polygons (24-72 sides): uMin/uMax = 0/1
  polygon_24: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 72,  vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  polygon_30: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 90,  vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  polygon_36: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 108, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  polygon_48: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 144, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  polygon_60: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 180, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  polygon_72: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 216, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Curved shapes — clean baseline parameters
  // cylinder: u ∈ [0,2π], v ∈ [-1,1]; a=radius, c=half-height (via v); b=unused(1)
  cylinder: { uMin: 0, uMax: Math.PI * 2, vMin: -1, vMax: 1, uSegments: 40, vSegments: 10, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  // sphere: u ∈ [0,2π], v ∈ [0,π]; a=radius; b-f unused (must be 1 for clean sphere)
  sphere: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 60, vSegments: 40, a: 3, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  // torus: u ∈ [0,2π], v ∈ [0,2π]; a=major radius, b=tube radius; c-f unused (must be 1)
  torus: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2, uSegments: 60, vSegments: 30, a: 3, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  spherical_cap: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 40, vSegments: 20, a: 2.3, b: 1.6, c: 1.9, d: 1.4, e: 2.0, f: 1.2, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  ellipsoid: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 40, vSegments: 30, a: 3.4, b: 2.7, c: 1.8, d: 2.2, e: 1.9, f: 2.4, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  elliptical_cylinder: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 40, vSegments: 20, a: 3.1, b: 2.5, c: 1.6, d: 2.0, e: 1.7, f: 2.1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  elliptical_cone: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1, uSegments: 40, vSegments: 20, a: 3.0, b: 2.3, c: 1.5, d: 1.8, e: 2.1, f: 1.4, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  // paraboloid: u ∈ [-2,2], v ∈ [-2,2]; x=u*a, y=v*b, z=c*(u²+v²); c small = wide bowl
  paraboloid: { uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 30, vSegments: 30, a: 1, b: 1, c: 0.3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  // hyperboloid: u ∈ [-π,π], v ∈ [0,2π]; a=scale, b=waist stretch; c/d unused (1)
  hyperboloid: { uMin: -Math.PI, uMax: Math.PI, vMin: 0, vMax: Math.PI * 2, uSegments: 40, vSegments: 40, a: 2, b: 0.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hemisphere: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 40, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  half_cylinder: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 25, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  quarter_sphere: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 20, vSegments: 15, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  quarter_cylinder: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 15, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  annulus_torus: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2, uSegments: 50, vSegments: 30, a: 4, b: 1, c: 0.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cylindrical_shell: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 60, vSegments: 15, a: 3, b: 0.2, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Star polygons - complex mathematical forms
  star_5_prism: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 100, vSegments: 20, a: 2, b: 0.4, c: 1 },
  star_6_hexagram: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 120, vSegments: 20, a: 2, b: 0.5, c: 1 },
  star_8_octagram: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 160, vSegments: 20, a: 2, b: 0.6, c: 1 },

  // Concave polygons
  concave_pentagon: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 100, vSegments: 20, a: 2, b: 0.3, c: 1 },
  concave_hexagon: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 120, vSegments: 20, a: 2, b: 0.4, c: 1 },

  // Composite and compound shapes
  crescent: { uMin: 0, uMax: Math.PI * 2, vMin: -1, vMax: 1, uSegments: 80, vSegments: 30, a: 2, b: 1.2, c: 0.6 },
  heart_shape: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 100, vSegments: 20, a: 1, b: 1, c: 1 },
  kidney_shape: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 80, vSegments: 20, a: 2, b: 1.3, c: 0.7 },
  oval_prolate: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 50, vSegments: 30, a: 3, b: 1.5, c: 1 },
  oval_oblate: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 50, vSegments: 30, a: 3, b: 1.5, c: 1 },
  lens_biconvex: { uMin: 0, uMax: Math.PI * 2, vMin: -1, vMax: 1, uSegments: 60, vSegments: 30, a: 2, b: 1, c: 0.8 },
  lens_biconcave: { uMin: 0, uMax: Math.PI * 2, vMin: -1, vMax: 1, uSegments: 60, vSegments: 30, a: 2, b: 1, c: 0.8 },

  // Technical and specialized shapes
  airfoil_naca: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 30, a: 3, b: 0.12, c: 1 },
  gear_tooth: { uMin: 0, uMax: Math.PI * 2, vMin: -1, vMax: 1, uSegments: 120, vSegments: 20, a: 2, b: 0.3, c: 1 },
  cam_profile: { uMin: 0, uMax: Math.PI * 2, vMin: -1, vMax: 1, uSegments: 100, vSegments: 20, a: 2, b: 0.5, c: 1 },
  spline_surface: { uMin: -1, uMax: 1, vMin: -1, vMax: 1, uSegments: 40, vSegments: 40, a: 2, b: 1, c: 1 },
  bezier_surface: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 40, a: 2, b: 1, c: 1 },
  nurbs_surface: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 40, a: 2, b: 1, c: 1 },

  // Fractal and mathematical shapes - Enhanced Core Parameters
  koch_snowflake: { uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2, uSegments: 180, vSegments: 20, a: 2.5, b: 1, c: 1.5, d: 2, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  sierpinski_pyramid: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120, a: 3, b: 1, c: 1, d: 3, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  dragon_curve: { uMin: 0, uMax: 1, vMin: -1, vMax: 1, uSegments: 100, vSegments: 20, a: 2.6, b: 1.5, c: 1.8, d: 3.2, e: 2.1, f: 1.4, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  mandelbrot_solid: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100, a: 1.8, b: 1.4, c: 2.3, d: 1.6, e: 2.0, f: 1.2, g: 0.5, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Architectural and design profiles
  gothic_arch: { uMin: 0, uMax: Math.PI, vMin: -2, vMax: 2, uSegments: 60, vSegments: 20, a: 2, b: 1, c: 1, d: 0.3, e: 0.8, f: 1, g: 1, h: 0.1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  roman_arch: { uMin: 0, uMax: Math.PI, vMin: -2, vMax: 2, uSegments: 60, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  ogee_curve: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 80, vSegments: 20, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 0.2, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  s_curve_flowing: { uMin: 0, uMax: 1, vMin: -2, vMax: 2, uSegments: 80, vSegments: 20, a: 2, b: 1, c: 1, d: 2, e: 1, f: 2, g: 0.5, h: 1, i: 1, j: 3, k: 0.3, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Higher-dimensional projections

  simplex_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0.5, h: 2, i: 0.5, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hypersphere_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50, a: 2, b: 1, c: 1, d: 1, e: 1, f: 0.5, g: 0.3, h: 2, i: 0.8, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hypercube_tesseract: { uMin: -1, uMax: 1, vMin: -1, vMax: 1, uSegments: 32, vSegments: 24, a: 2, b: 2, c: 2, d: 2, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cell_16: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 2, j: 0.5, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cell_120: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 30, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 0.6, i: 1.618, j: 0.3, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cell_600: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 200, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 0.4, i: 1.618, j: 0.2, k: 0.1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Non-Euclidean Geometries
  // Hyperbolic geometry
  pseudosphere: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 50, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperbolic_paraboloid: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60, a: 3, b: 1, c: 1, d: 2, e: 2, f: 1, g: 2, h: 2, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperbolic_pentagon: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 40, a: 2, b: 1, c: 1, d: 0.5, e: 1, f: 0.3, g: 0.2, h: 1, i: 1, j: 2, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperbolic_tiling: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 80, a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 0.1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Spherical geometry
  spherical_triangle: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40, a: 2, b: 1, c: 1, d: 0.5, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  spherical_polygon: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 50, a: 2, b: 1, c: 1, d: 0.5, e: 0.3, f: 0.5, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Minkowski spacetime
  minkowski_hyperboloid: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 50, a: 2, b: 1, c: 1, d: 2, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  light_cone: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 3, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  spacetime_geodesic: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 30, a: 2, b: 1, c: 1, d: 1, e: 0.5, f: 1, g: 0.2, h: 1, i: 1, j: 0.5, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Riemann Surface Cross-Sections - Abstract Mathematical Objects
  square_root_riemann: { uMin: 0.1, uMax: 3, vMin: 0, vMax: 4 * Math.PI, uSegments: 80, vSegments: 60, a: 1, b: 0.5, c: 1, d: 0, e: 0.2, f: 0.2, g: 2, h: 0.5, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  logarithm_riemann: { uMin: -2, uMax: 2, vMin: 0, vMax: 6 * Math.PI, uSegments: 100, vSegments: 80, a: 1, b: 0, c: 1, d: 0, e: 0.1, f: 0.1, g: 1, h: 0.3, i: 2, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  exponential_riemann: { uMin: -2, uMax: 2, vMin: 0, vMax: 2 * Math.PI, uSegments: 80, vSegments: 50, a: 1, b: 0, c: 1, d: 0, e: 0.1, f: 0.1, g: 1, h: 0.5, i: 2, j: 2, k: 2, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  nth_root_riemann: { uMin: 0.1, uMax: 3, vMin: 0, vMax: 6 * Math.PI, uSegments: 90, vSegments: 70, a: 1, b: 0.5, c: 1, d: 0, e: 3, f: 0.15, g: 0.15, h: 1.5, i: 1.5, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  modular_function: { uMin: -2, uMax: 2, vMin: 0.1, vMax: 3, uSegments: 100, vSegments: 60, a: 1, b: 0, c: 1, d: 0.1, e: 1, f: 0, g: 0, h: 1, i: 0.2, j: 2, k: 2, l: 2, m: 0.5, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  elliptic_function: { uMin: 0, uMax: 4 * Math.PI, vMin: -2, vMax: 2, uSegments: 120, vSegments: 40, a: 1, b: 0, c: 1, d: 0, e: 2, f: 1, g: 1.5, h: 1, i: 0.5, j: 1, k: 1, l: 0.3, m: 1, n: 1, o: 0.4, p: 2, q: 2, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Sacred Geometry - Chakra Symbols and Tree of Life
  root_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 120, vSegments: 30, a: 1.5, b: 2, c: 0.8, d: 2.5, e: 0.2, f: 4, g: 0.15, h: 6, i: 0.1, j: 8, k: 0.5, l: 0.3, m: 2, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  sacral_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 120, vSegments: 30, a: 1.2, b: 2.2, c: 0.7, d: 2.8, e: 0.15, f: 6, g: 0.1, h: 8, i: 0.6, j: 0.4, k: 3, l: 2, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  solar_plexus_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 100, vSegments: 30, a: 1.8, b: 2.5, c: 0.6, d: 3, e: 0.12, f: 10, g: 0.08, h: 12, i: 0.05, j: 15, k: 0.4, l: 0.25, m: 3, n: 2, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  heart_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 120, vSegments: 30, a: 1.6, b: 2.4, c: 0.9, d: 3.2, e: 0.1, f: 12, g: 0.06, h: 16, i: 0.04, j: 20, k: 0.3, l: 0.2, m: 4, n: 3, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  throat_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 160, vSegments: 30, a: 1.4, b: 2.6, c: 1.1, d: 3.4, e: 0.08, f: 16, g: 0.05, h: 20, i: 0.03, j: 24, k: 0.25, l: 0.15, m: 5, n: 4, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  third_eye_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 80, vSegments: 30, a: 1.3, b: 2.8, c: 1.5, d: 3.6, e: 0.15, f: 3, g: 0.1, h: 4, i: 0.08, j: 6, k: 0.2, l: 0.12, m: 6, n: 5, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  crown_chakra: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 120, vSegments: 50, a: 2, b: 1, c: 1.8, d: 1, e: 0.05, f: 1, g: 0.3, h: 0.8, i: 0.4, j: 2, k: 3, l: 4, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  tree_of_life: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 120, vSegments: 40, a: 2, b: 1.5, c: 1.2, d: 1.8, e: 0.1, f: 8, g: 4, h: 0.3, i: 0.6, j: 6, k: 3, l: 0.5, m: 2, n: 1.5, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Group Theory - Symmetry Groups and Crystal Structures
  icosahedron_group: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 200, vSegments: 60, a: 2, b: 0.1, c: 3, d: 2, e: 0.05, f: 4, g: 2, h: 0.03, i: 6, j: 3, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  dodecahedron_group: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 240, vSegments: 50, a: 2.2, b: 0.08, c: 4, d: 2.5, e: 0.04, f: 5, g: 2.5, h: 0.03, i: 8, j: 4, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cubic_lattice: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80, a: 1.5, b: 4, c: 4, d: 4, e: 0.1, f: 2, g: 1, h: 0.1, i: 2, j: 1, k: 0.08, l: 3, m: 2, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  fcc_lattice: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 80, a: 1.8, b: 3, c: 3, d: 3, e: 0.05, f: 4, g: 2, h: 0.05, i: 4, j: 2, k: 0.04, l: 5, m: 3, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hcp_lattice: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 60, a: 1.6, b: 3, c: 1.633, d: 3, e: 0.04, f: 6, g: 3, h: 0.04, i: 6, j: 3, k: 0.03, l: 8, m: 4, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Category Theory - Abstract Mathematical Structures
  functor_mapping: { uMin: -3, uMax: 3, vMin: -3, vMax: 3, uSegments: 40, vSegments: 40, a: 3, b: 2, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  natural_transformation: { uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 50, vSegments: 30, a: 2, b: 1.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  adjoint_functors: { uMin: -3, uMax: 3, vMin: -2, vMax: 2, uSegments: 60, vSegments: 40, a: 2.5, b: 2, c: 1.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Topology & Knot Theory - Topological Invariants and Knot Structures
  klein_bottle: { uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 80, vSegments: 50, a: 2.5, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  mobius: { uMin: 0, uMax: 2 * Math.PI, vMin: -1, vMax: 1, uSegments: 120, vSegments: 20, a: 2, b: 0.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  // helicoid: u ∈ [0, 4π] = 2 full rotations, v ∈ [-1, 1] = arm; a=radius, c=pitch
  helicoid: { uMin: 0, uMax: 4 * Math.PI, vMin: -1, vMax: 1, uSegments: 80, vSegments: 20, a: 2, b: 1, c: 0.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  trefoil_knot: { uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 150, vSegments: 24, a: 2, b: 0.8, c: 0.25, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  figure8_knot: { uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 150, vSegments: 24, a: 1.5, b: 0.8, c: 0.25, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  genus2_surface: { uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 0.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  genus3_surface: { uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 100, vSegments: 50, a: 2.5, b: 1, c: 0.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  fiber_bundle: { uMin: -Math.PI, uMax: Math.PI, vMin: -Math.PI, vMax: Math.PI, uSegments: 60, vSegments: 40, a: 2, b: 1, c: 0.3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  homotopy_deformation: { uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 50, vSegments: 50, a: 2, b: 1.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Real-World Objects - Recognizable Shapes and Natural Forms
  sun: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60, a: 2, b: 0.3, c: 1, d: 0.5, e: 0.4, f: 8, g: 6, h: 0.5, i: 4, j: 3, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  sunflower: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 80, a: 3, b: 0.2, c: 0.5, d: 13, e: 1, f: 0.8, g: 0.5, h: 0.3, i: 21, j: 0.8, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  letter_A: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 20, a: 1.5, b: 2, c: 0.3, d: 0.02, e: 10, f: 0.02, g: 15, h: 0.1, i: 0.01, j: 20, k: 25, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  number_3: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 25, a: 1.2, b: 2, c: 0.4, d: 0.02, e: 12, f: 0.02, g: 18, h: 0.15, i: 0.01, j: 22, k: 28, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  apple: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 50, a: 1.8, b: 0.3, c: 0.2, d: 0.4, e: 0.1, f: 0.2, g: 0.08, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  star_3d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 15, a: 2, b: 1, c: 0.5, d: 0.05, e: 5, f: 0.05, g: 5, h: 0.2, i: 0.1, j: 5, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  nautilus_shell: { uMin: -10.0, uMax: 10.0, vMin: -10.0, vMax: 7.7, uSegments: 80, vSegments: 60, a: 10.00, b: 0.84, c: 0.42, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Cosmic Objects - Spacetime and Gravitational Physics
  GRAVITY_WELL: { uMin: -5, uMax: 5, vMin: -5, vMax: 5, uSegments: 50, vSegments: 50, a: 3, b: 2, c: 1.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  WHITE_HOLE: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 50, vSegments: 50, a: 2, b: 1.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  WORMHOLE: { uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI, vMax: Math.PI, uSegments: 50, vSegments: 50, a: 2.5, b: 1, c: 0.5, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  ERGOSPHERE: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 50, vSegments: 50, a: 1.8, b: 0.9, c: 1.2, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Advanced Mathematical Objects - Higher-Dimensional Projections
  pentachoron: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hexacosichoron: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60, a: 2, b: 1, c: 1, d: 1, e: 5, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cell_24: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 60, a: 2, b: 1, c: 1, d: 1, e: 1, f: 4, g: 0.3, h: 0.2, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  klein_bottle_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50, a: 2, b: 1, c: 1, d: 1, e: 1, f: 0.3, g: 0.2, h: 0.15, i: 0.1, j: 1, k: 0.12, l: 1, m: 0.1, n: 0.08, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // New 4D Mathematical Objects
  torus_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 0.2, e: 0.15, f: 1, g: 1, h: 1.5, i: 1, j: 2.5, k: 0.8, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hopf_fibration: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50, a: 2, b: 1, c: 1, d: 0.5, e: 0.3, f: 0.2, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  mobius_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 90, vSegments: 30, a: 2, b: 1, c: 1, d: 0.25, e: 0.18, f: 1, g: 0.7, h: 1, i: 0.9, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hypercylinder: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40, a: 2, b: 1, c: 3, d: 1.5, e: 0.2, f: 1, g: 2.8, h: 0.4, i: 0.8, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperellipsoid_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1.2, c: 0.8, d: 1.5, e: 0.2, f: 1, g: 1, h: 2.5, i: 0.6, j: 0.9, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // Additional 4D Mathematical Objects
  schlafli_double_six: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 30, a: 2, b: 1, c: 1, d: 0.5, e: 0.3, f: 0.2, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperprism_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 0.25, f: 0.18, g: 2.0, h: 2.5, i: 0.8, j: 1.2, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  clifford_torus: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 0.2, e: 0.15, f: 1.8, g: 1, h: 1, i: 0.9, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  duoprism_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 0.3, e: 0.2, f: 1.5, g: 1, h: 1.8, i: 0.7, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  stereographic_projection_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 90, vSegments: 50, a: 2, b: 1, c: 1, d: 0.8, e: 0.5, f: 0.3, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  pentachoron_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 0.6, f: 0.4, g: 0.8, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperboloid_4d_two_sheet: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 50, a: 2, b: 1, c: 1, d: 1.5, e: 0.8, f: 0.6, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  lissajous_knot_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 60, a: 2, b: 1, c: 1, d: 3, e: 2, f: 5, g: 0.5, h: 0.3, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Uncharted 4D Territories - Breakthrough Research Objects (Optimized)
  modular_surface_knots_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 25, a: 2, b: 1, c: 1, d: 1.5, e: 0.1, f: 0.8, g: 0.6, h: 0.3, i: 0.2, j: 1.2, k: 0.9, l: 3, m: 0.15, n: 1, o: 2, p: 0.4, q: 1, r: 1, s: 3.14, t: 0.5, u: 1, v: 1, w: 0.1 },

  quantum_hall_droplets_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 2, b: 1.5, c: 1.2, d: 0.5, e: 0.8, f: 0.3, g: 3, h: 3, i: 1, j: 2, k: 0.5, l: 0.8, m: 1, n: 0.4, o: 1.5, p: 0.2, q: 1, r: 2, s: 0.6, t: 0.3, u: 1, v: 1, w: 0.5 },
  hyperbolic_limit_sets_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 1.2, e: 0.3, f: 0.8, g: 0.5, h: 0.4, i: 0.6, j: 1.1, k: 0.9, l: 3, m: 1.5, n: 1, o: 1, p: 2.5, q: 0.3, r: 3, s: 2, t: 0.7, u: 1, v: 1, w: 0.8 },
  seiberg_witten_monopoles_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 70, vSegments: 35, a: 2, b: 1, c: 0.1, d: 1.5, e: 1, f: 0.1, g: 0.8, h: 2, i: 0.1, j: 1.5, k: 1.2, l: 2, m: 1.8, n: 0.5, o: 0.8, p: 1, q: 1.5, r: 2, s: 1.2, t: 0.6, u: 1, v: 1, w: 0.3 },
  percolation_cluster_boundaries_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 25, a: 1, b: 0.01, c: 10, d: 10, e: 5, f: 7, g: 2, h: 0.5, i: 2, j: 1, k: 1.5, l: 0.8, m: 0.4, n: 1.5, o: 1, p: 0.3, q: 1, r: 0.5, s: 10, t: 0.2, u: 0.1, v: 0.05, w: 0.01 },

  // Frontier 4D Objects - Nobel Prize Potential Research Areas
  arithmetic_hyperbolic_manifolds_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2.5, b: 1.2, c: 0.8, d: 1.5, e: 0.6, f: 2.1, g: 1.8, h: 0.9, i: 0.4, j: 1.7, k: 0.7, l: 2.3, m: 1.1, n: 0.5, o: 1.9, p: 0.3, q: 2.6, r: 1.4, s: 0.8, t: 2.2, u: 1, v: 1, w: 1.6 },
  exotic_smooth_structures_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50, a: 2, b: 0.001, c: 1.5, d: 0.5, e: 0.002, f: 0.3, g: 0.1, h: 2.5, i: 10, j: 0.05, k: 1.2, l: 0.8, m: 0.6, n: 15, o: 1.8, p: 2.1, q: 0.4, r: 0.7, s: 1.3, t: 0.9, u: 1, v: 1, w: 0.001 },
  rational_elliptic_surfaces_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 90, vSegments: 45, a: 2, b: 1, c: 1, d: 1.5, e: 0.8, f: 1.2, g: 2.1, h: 0.9, i: 1.7, j: 2.3, k: 0.6, l: 1.4, m: 0.5, n: 1.6, o: 3, p: 2, q: 0.7, r: 0.5, s: 1.1, t: 3, u: 1, v: 1, w: 1 },
  instanton_moduli_spaces_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 85, vSegments: 42, a: 1, b: 2, c: 1.5, d: 0.1, e: 0.8, f: 0.1, g: 2.1, h: 1.3, i: 0.7, j: 1.8, k: 2.5, l: 0.9, m: 1, n: 0.02, o: 0.1, p: 0.6, q: 0.4, r: 1.2, s: 0.3, t: 1, u: 1, v: 1, w: 0.5 },
  cellular_automata_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 10, b: 10, c: 5, d: 5, e: 10, f: 0.1, g: 0.1, h: 0.1, i: 0.1, j: 4, k: 5, l: 0.5, m: 0.2, n: 0.1, o: 0.2, p: 0.3, q: 0.2, r: 0.1, s: 0.1, t: 0.3, u: 1, v: 1, w: 1 },
  minimal_surfaces_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 1.5, e: 0.8, f: 0.6, g: 0.3, h: 2.5, i: 1.8, j: 0.02, k: 5, l: 0.1, m: 1.2, n: 0.9, o: 0.7, p: 0.4, q: 0.2, r: 0.5, s: 0.6, t: 0.25, u: 1, v: 1, w: 1 },

  // 4D Formula Objects - Complete Mathematical Framework
  tesseract_4d_formula: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hypersphere_4d_formula: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI, uSegments: 100, vSegments: 50, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  klein_bottle_4d_formula: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2, uSegments: 90, vSegments: 45, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  duocylinder_4d_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1.5, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  simplex_5cell_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  cross_polytope_16cell_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 70, vSegments: 35, a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  mobius_strip_4d_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 1, b: 2, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hopf_fibration_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 90, vSegments: 45, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  clifford_torus_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 1.5, b: 1.2, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  duoprism_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 6, b: 8, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  stereographic_projection_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50, a: 4, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  pentachoron_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperboloid_two_sheet_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  lissajous_knot_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 20, a: 3, b: 4, c: 5, d: 2, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  borromean_rings_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 90, vSegments: 45, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  kummer_surface_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  penrose_tiling_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 1.618, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  quantum_hall_droplets_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 70, vSegments: 35, a: 3, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  hyperbolic_limit_sets_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 0.285, b: 0.01, c: 4, d: 10, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  seiberg_witten_monopoles_formula: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30, a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },
  
  // 4D Langlands Correspondence - Key to proving Langlands conjectures (20/23 parameters active)
  langlands_correspondence_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50, a: 2, b: 1.618, c: 1, d: 1, e: 2, f: 0.5, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 0.5, n: 1, o: 2, p: 2, q: 0.3, r: 1, s: 1, t: 0.2, u: 1, v: 1, w: 1 },
  
  // 4D Topological Quantum Field Theory - TQFT invariants for 4D smooth Poincaré conjecture (22/23 parameters active)
  topological_quantum_field_theory_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 60, a: 2.5, b: 1.414, c: 1.732, d: 0.8, e: 1.2, f: 0.6, g: 2.1, h: 1.5, i: 0.9, j: 1.8, k: 0.7, l: 2.3, m: 1.1, n: 0.5, o: 1.9, p: 2.7, q: 0.4, r: 1.6, s: 2.2, t: 0.3, u: 1, v: 1, w: 1.3 },

  // 4D Zimmer Program Objects - Higher-rank lattice rigidity theory (20/23 parameters active)
  zimmer_program_4d: { uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40, a: 3, b: 1.618, c: 2.414, d: 0.5, e: 1, f: 1.732, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1 },

  // Complete 4D Objects Collection - cleaned up entries
  ricci_flow_singularities_4d: { 
    uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
    uSegments: 100, vSegments: 100, 
    a: 2, b: 2, c: 3, d: 1, e: 1, f: 2, 
    g: 0.5, h: 1, i: 2, j: 1, k: 1, l: 1, 
    m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, 
    s: 1, t: 1, u: 1, v: 1, w: 1
  },

  // 4D Perfectoid Spaces - Adic spaces and p-adic Hodge theory (21/23 parameters active)
  perfectoid_spaces_4d: { 
    uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
    uSegments: 90, vSegments: 45, 
    a: 2.8, b: 1.414, c: 1.732, d: 0.9, e: 1.3, f: 0.7, 
    g: 2.2, h: 1.6, i: 1.0, j: 1.9, k: 0.8, l: 2.4, 
    m: 1.2, n: 0.6, o: 2.0, p: 2.8, q: 0.5, r: 1.7, 
    s: 2.3, t: 1, u: 1, v: 1, w: 1.4
  },

  // 4D Gravitational Wave Resonators - Einstein field equations with exotic matter (22/23 parameters active)
  gravitational_wave_resonators_4d: { 
    uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
    uSegments: 120, vSegments: 80, 
    a: 2.0, b: 1.0, c: 100, d: 1e-21, e: 1.5, f: 1.2, 
    g: 1.8, h: 0.9, i: 2.5, j: 1.1, k: 0.7, l: 1.6, 
    m: 8, n: 1.3, o: 100, p: 2.2, q: 0.8, r: 1.9, 
    s: 1.4, t: 1, u: 1, v: 1, w: 1.7
  }
};

export function getShapeDefaults(shapeType: SurfaceType): Partial<SurfaceParameters> {
  return SHAPE_DEFAULTS[shapeType] || SHAPE_DEFAULTS.cone;
}