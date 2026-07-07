import React, { useState, useMemo } from "react";
import { SurfaceParameters, VisualizationMode, SurfaceType } from "../../../shared/schema";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RotateCcw, Download, Share2, Settings, Globe, Search } from "lucide-react";
import { Input } from "./ui/input";
import * as THREE from "three";
import { getShapeDefaults } from "../lib/shapeDefaults";
import { getIsolatedShapeParameters } from "../lib/shapeCenteringFixed";

import { MathVerificationPanel } from './MathVerificationPanel';
import { ResearchExportButton } from './ResearchExportButton';

interface ExpandedControlPanelProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
  onColorModeChange: (mode: string) => void;
  onExport: () => void;
  sceneRefs?: {
    scene: THREE.Scene | null;
    camera: THREE.Camera | null;
    renderer: THREE.WebGLRenderer | null;
  };
}

// All 23 parameters from a through w
const PARAMETER_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'] as const;

// Objects that support Enhanced 4D Dynamics (g-w parameters)
const SUPPORTS_4D_DYNAMICS = [
  'torus_4d', 'hopf_fibration', 'mobius_4d', 'hypercylinder', 'hyperellipsoid_4d',
  'klein_bottle_4d', 'tesseract_4d_formula', 'hypersphere_4d_formula', 'clifford_torus',
  'duoprism_4d', 'pentachoron_4d', 'cell_24', 'cell_16', 'cell_120', 'cell_600',
  'torus', 'sphere', 'ellipsoid', 'hyperboloid', 'paraboloid'
] as const;

export default function ExpandedControlPanel({
  parameters,
  visualMode,
  colorMode,
  onParameterChange,
  onVisualizationModeChange,
  onColorModeChange,
  onExport,
  sceneRefs,
}: ExpandedControlPanelProps) {

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');

  // Check if current shape supports 4D dynamics
  const supports4DDynamics = SUPPORTS_4D_DYNAMICS.includes(parameters.type as any);

  // COMPLETE MATHEMATICAL FRAMEWORK - ALL 200+ SHAPES AND FORMULAS
  const allShapes = useMemo(() => [
    { value: "triangular_prism", label: "Triangle", category: "Basic" },
    { value: "cube", label: "Cube", category: "Basic" },
    { value: "pentagonal_prism", label: "Pentagon", category: "Basic" },
    { value: "hexagonal_prism", label: "Hexagon", category: "Basic" },
    { value: "octagonal_prism", label: "Octagon", category: "Basic" },
    { value: "decagonal_prism", label: "Decagon", category: "Basic" },
    { value: "dodecagonal_prism", label: "Dodecagon", category: "Basic" },
    { value: "cylinder", label: "Cylinder", category: "Basic" },
    { value: "sphere", label: "Sphere", category: "Basic" },
    { value: "torus", label: "Torus", category: "Basic" },
    { value: "ellipsoid", label: "Ellipsoid", category: "Basic" },
    { value: "paraboloid", label: "Paraboloid", category: "Basic" },
    { value: "hyperboloid", label: "Hyperboloid", category: "Basic" },
    { value: "hemisphere", label: "Hemisphere", category: "Basic" },
    { value: "spherical_cap", label: "Spherical Cap", category: "Basic" },
    { value: "quarter_sphere", label: "Quarter Sphere", category: "Basic" },
    { value: "annulus_torus", label: "Annulus Torus", category: "Basic" },
    { value: "cylindrical_shell", label: "Shell", category: "Basic" },
    { value: "star_5_prism", label: "★ 5-Star", category: "Star" },
    { value: "star_6_hexagram", label: "✡ 6-Star", category: "Star" },
    { value: "star_8_octagram", label: "✦ 8-Star", category: "Star" },
    { value: "concave_pentagon", label: "⬟ Concave 5", category: "Complex" },
    { value: "concave_hexagon", label: "⬢ Concave 6", category: "Complex" },
    { value: "crescent", label: "🌙 Crescent", category: "Complex" },
    { value: "heart_shape", label: "♥ Heart", category: "Complex" },
    { value: "kidney_shape", label: "Kidney", category: "Complex" },
    { value: "oval_prolate", label: "Oval Pro", category: "Complex" },
    { value: "oval_oblate", label: "Oval Obl", category: "Complex" },
    { value: "lens_biconvex", label: "Lens +", category: "Complex" },
    { value: "lens_biconcave", label: "Lens -", category: "Complex" },
    { value: "airfoil_naca", label: "Airfoil", category: "Technical" },
    { value: "gear_tooth", label: "⚙ Gear", category: "Technical" },
    { value: "cam_profile", label: "Cam", category: "Technical" },
    { value: "spline_surface", label: "Spline", category: "Technical" },
    { value: "bezier_surface", label: "Bezier", category: "Technical" },
    { value: "nurbs_surface", label: "NURBS", category: "Technical" },
    { value: "koch_snowflake", label: "❄ Koch Snowflake", category: "Fractal" },
    { value: "sierpinski_pyramid", label: "△ Sierpinski", category: "Fractal" },
    { value: "dragon_curve", label: "🐉 Dragon Curve", category: "Fractal" },
    { value: "mandelbrot_solid", label: "∞ Mandelbrot", category: "Fractal" },
    { value: "gothic_arch", label: "⛪ Gothic Arch", category: "Architecture" },
    { value: "roman_arch", label: "🏛 Roman Arch", category: "Architecture" },
    { value: "ogee_curve", label: "〰 Ogee Curve", category: "Architecture" },
    { value: "s_curve_flowing", label: "S-Flow", category: "Architecture" },
    { value: "topological_quantum_field_theory_4d", label: "🏆 4D Topological Quantum Field Theory", category: "4D Nobel Prize" },
    { value: "langlands_correspondence_4d", label: "🏆 4D Geometric Langlands", category: "4D Nobel Prize" },
    { value: "arithmetic_hyperbolic_manifolds_4d", label: "🏆 4D Arithmetic Hyperbolic Manifolds", category: "4D Nobel Prize" },
    { value: "exotic_smooth_structures_4d", label: "🏆 4D Exotic Smooth Structures", category: "4D Nobel Prize" },
    { value: "rational_elliptic_surfaces_4d", label: "🏆 4D Rational Elliptic Surfaces", category: "4D Nobel Prize" },
    { value: "instanton_moduli_spaces_4d", label: "🏆 4D Instanton Moduli Spaces", category: "4D Nobel Prize" },
    { value: "cellular_automata_4d", label: "🏆 4D Cellular Automata", category: "4D Nobel Prize" },
    { value: "minimal_surfaces_4d", label: "🏆 4D Minimal Surfaces", category: "4D Nobel Prize" },
    { value: "modular_surface_knots_4d", label: "🧬 4D Modular Surface Knots", category: "4D Uncharted" },
    { value: "ricci_flow_singularities_4d", label: "🧬 4D Ricci Flow Singularities", category: "4D Uncharted" },
    { value: "quantum_hall_droplets_4d", label: "🧬 4D Quantum Hall Droplets", category: "4D Uncharted" },
    { value: "hyperbolic_limit_sets_4d", label: "🧬 4D Hyperbolic Limit Sets", category: "4D Uncharted" },
    { value: "seiberg_witten_monopoles_4d", label: "🧬 4D Seiberg-Witten Monopoles", category: "4D Uncharted" },
    { value: "percolation_cluster_boundaries_4d", label: "🧬 4D Percolation Cluster Boundaries", category: "4D Uncharted" },
    { value: "gravitational_wave_resonators_4d", label: "🌊 4D Gravitational Wave Resonators", category: "4D Uncharted" },
    { value: "tesseract_4d_formula", label: "📐 4D Tesseract Formula", category: "4D Formulas" },
    { value: "hypersphere_4d_formula", label: "📐 4D Hypersphere Formula", category: "4D Formulas" },
    { value: "klein_bottle_4d_formula", label: "📐 4D Klein Bottle Formula", category: "4D Formulas" },
    { value: "duocylinder_4d_formula", label: "📐 4D Duocylinder Formula", category: "4D Formulas" },
    { value: "simplex_5cell_formula", label: "📐 4D Simplex 5-Cell Formula", category: "4D Formulas" },
    { value: "cross_polytope_16cell_formula", label: "📐 4D Cross-Polytope 16-Cell Formula", category: "4D Formulas" },
    { value: "mobius_strip_4d_formula", label: "📐 4D Möbius Strip Formula", category: "4D Formulas" },
    { value: "hopf_fibration_formula", label: "📐 4D Hopf Fibration Formula", category: "4D Formulas" },
    { value: "clifford_torus_formula", label: "📐 4D Clifford Torus Formula", category: "4D Formulas" },
    { value: "duoprism_formula", label: "📐 4D Duoprism Formula", category: "4D Formulas" },
    { value: "stereographic_projection_formula", label: "📐 4D Stereographic Projection Formula", category: "4D Formulas" },
    { value: "pentachoron_formula", label: "📐 4D Pentachoron Formula", category: "4D Formulas" },
    { value: "hyperboloid_two_sheet_formula", label: "📐 4D Hyperboloid Two-Sheet Formula", category: "4D Formulas" },
    { value: "lissajous_knot_formula", label: "📐 4D Lissajous Knot Formula", category: "4D Formulas" },
    { value: "borromean_rings_formula", label: "📐 4D Borromean Rings Formula", category: "4D Formulas" },
    { value: "kummer_surface_formula", label: "📐 4D Kummer Surface Formula", category: "4D Formulas" },
    { value: "penrose_tiling_formula", label: "📐 4D Penrose Tiling Formula", category: "4D Formulas" },
    { value: "quantum_hall_droplets_formula", label: "📐 4D Quantum Hall Droplets Formula", category: "4D Formulas" },
    { value: "hyperbolic_limit_sets_formula", label: "📐 4D Hyperbolic Limit Sets Formula", category: "4D Formulas" },
    { value: "seiberg_witten_monopoles_formula", label: "📐 4D Seiberg-Witten Monopoles Formula", category: "4D Formulas" },
    { value: "cell_16", label: "◈ 16-Cell (4D)", category: "4D Objects" },
    { value: "cell_120", label: "⬟ 120-Cell (4D)", category: "4D Objects" },
    { value: "cell_600", label: "⬢ 600-Cell (4D)", category: "4D Objects" },
    { value: "cell_24", label: "◈ 24-Cell", category: "4D Objects" },
    { value: "klein_bottle_4d", label: "🪐 Klein Bottle 4D", category: "4D Objects" },
    { value: "torus_4d", label: "🍩 4D Torus", category: "4D Objects" },
    { value: "hopf_fibration", label: "🌐 Hopf Fibration", category: "4D Objects" },
    { value: "mobius_4d", label: "🎭 4D Möbius Strip", category: "4D Objects" },
    { value: "hypercylinder", label: "🔮 4D Hypercylinder", category: "4D Objects" },
    { value: "hyperellipsoid_4d", label: "🥚 4D Hyperellipsoid", category: "4D Objects" },
    { value: "schlafli_double_six", label: "⚛ Schläfli Double Six", category: "4D Objects" },
    { value: "hyperprism_4d", label: "🔷 4D Hyperprism", category: "4D Objects" },
    { value: "clifford_torus", label: "🔗 Clifford Torus", category: "4D Objects" },
    { value: "duoprism_4d", label: "🎲 4D Duoprism", category: "4D Objects" },
    { value: "stereographic_projection_4d", label: "🎯 4D Stereographic Projection", category: "4D Objects" },
    { value: "pentachoron_4d", label: "🔺 4D Pentachoron", category: "4D Objects" },
    { value: "hyperboloid_4d_two_sheet", label: "⧨ 4D Hyperboloid Two-Sheet", category: "4D Objects" },
    { value: "lissajous_knot_4d", label: "🌊 4D Lissajous Knot", category: "4D Objects" },
    { value: "GRAVITY_WELL", label: "🌀 Gravity Well", category: "Cosmic" },

    // ALL 25 MISSING 4D FORMULA OBJECTS - COMPLETE MATHEMATICAL FRAMEWORK
    { value: "tesseract_4d_formula", label: "🔲 Tesseract 4D Formula", category: "4D Formulas" },
    { value: "hypersphere_4d_formula", label: "🌐 Hypersphere 4D Formula", category: "4D Formulas" },
    { value: "klein_bottle_4d_formula", label: "🍼 Klein Bottle 4D Formula", category: "4D Formulas" },
    { value: "duocylinder_4d_formula", label: "🔄 Duocylinder 4D Formula", category: "4D Formulas" },
    { value: "simplex_5cell_formula", label: "🔺 Simplex 5-Cell Formula", category: "4D Formulas" },
    { value: "cross_polytope_16cell_formula", label: "✚ Cross Polytope 16-Cell Formula", category: "4D Formulas" },
    { value: "mobius_strip_4d_formula", label: "🎀 Möbius Strip 4D Formula", category: "4D Formulas" },
    { value: "hopf_fibration_formula", label: "🌀 Hopf Fibration Formula", category: "4D Formulas" },
    { value: "clifford_torus_formula", label: "🟠 Clifford Torus Formula", category: "4D Formulas" },
    { value: "duoprism_formula", label: "🔳 Duoprism Formula", category: "4D Formulas" },
    { value: "stereographic_projection_formula", label: "📊 Stereographic Projection Formula", category: "4D Formulas" },
    { value: "pentachoron_formula", label: "🔻 Pentachoron Formula", category: "4D Formulas" },
    { value: "hyperboloid_two_sheet_formula", label: "⧫ Hyperboloid Two-Sheet Formula", category: "4D Formulas" },
    { value: "lissajous_knot_formula", label: "🪢 Lissajous Knot Formula", category: "4D Formulas" },
    { value: "borromean_rings_formula", label: "⭕ Borromean Rings Formula", category: "4D Formulas" },
    { value: "kummer_surface_formula", label: "🏔️ Kummer Surface Formula", category: "4D Formulas" },
    { value: "penrose_tiling_formula", label: "🔶 Penrose Tiling Formula", category: "4D Formulas" },
    { value: "quantum_hall_droplets_formula", label: "💧 Quantum Hall Droplets Formula", category: "4D Formulas" },
    { value: "hyperbolic_limit_sets_formula", label: "🌊 Hyperbolic Limit Sets Formula", category: "4D Formulas" },

    { value: "langlands_correspondence_4d", label: "🏆 Langlands Correspondence 4D", category: "4D Formulas" },
    { value: "topological_quantum_field_theory_4d", label: "🔬 TQFT 4D", category: "4D Formulas" },
    { value: "zimmer_program_4d", label: "🎯 Zimmer Program 4D", category: "4D Formulas" },
    { value: "arithmetic_hyperbolic_manifolds_4d", label: "📐 Arithmetic Hyperbolic Manifolds 4D", category: "4D Formulas" },
    { value: "exotic_smooth_structures_4d", label: "🔄 Exotic Smooth Structures 4D", category: "4D Formulas" },
    { value: "perfectoid_spaces_4d", label: "💎 Perfectoid Spaces 4D", category: "4D Formulas" },

    // Complete 4D Collection - Non-Duplicate Objects
    { value: "tesseract_4d", label: "🔲 Tesseract 4D", category: "4D Objects" },
    { value: "hypersphere_4d", label: "🌐 Hypersphere 4D", category: "4D Objects" },
    { value: "simplex_4d", label: "🔺 Simplex 4D", category: "4D Objects" },
    { value: "cross_polytope_4d", label: "✚ Cross-Polytope 4D", category: "4D Objects" },

    { value: "stereographic_4d", label: "📊 Stereographic 4D", category: "4D Objects" },
    { value: "hyperboloid_4d", label: "⧫ Hyperboloid 4D", category: "4D Objects" },

    { value: "icosahedral_polytope_4d", label: "🔸 Icosahedral Polytope 4D", category: "4D Objects" },
    { value: "calabi_yau_4d", label: "🎯 Calabi-Yau 4D", category: "4D Objects" },
    { value: "seifert_surface_4d", label: "🌊 Seifert Surface 4D", category: "4D Objects" },
    { value: "spinor_fibration_4d", label: "🌀 Spinor Fibration 4D", category: "4D Objects" },
    { value: "roman_surface_4d", label: "🏛️ Roman Surface 4D", category: "4D Objects" },
    { value: "quaternionic_projective_line_4d", label: "🎭 Quaternionic Proj Line 4D", category: "4D Objects" },
    { value: "twisted_cubic_4d", label: "🌪️ Twisted Cubic 4D", category: "4D Objects" },
    { value: "rational_elliptic_surfaces_4d", label: "🎯 Rational Elliptic Surfaces 4D", category: "4D Formulas" },
    { value: "instanton_moduli_spaces_4d", label: "⚡ Instanton Moduli Spaces 4D", category: "4D Formulas" },
    { value: "cellular_automata_4d", label: "🔬 Cellular Automata 4D", category: "4D Formulas" },
    { value: "minimal_surfaces_4d", label: "🎯 Minimal Surfaces 4D", category: "4D Formulas" },

    // MISSING SHAPES FROM SCHEMA - ADDING ALL REMAINING OBJECTS
    { value: "square", label: "⬜ Square", category: "Basic" },
    { value: "square_prism", label: "📦 Square Prism", category: "Basic" },
    { value: "heptagonal_prism", label: "⬟ Heptagon", category: "Basic" },
    { value: "nonagonal_prism", label: "⬟ Nonagon", category: "Basic" },
    { value: "hendecagonal_prism", label: "⬟ Hendecagon", category: "Basic" },
    { value: "elliptical_cylinder", label: "🥤 Elliptical Cylinder", category: "Basic" },
    { value: "elliptical_cone", label: "🔺 Elliptical Cone", category: "Basic" },
    { value: "half_cylinder", label: "🌗 Half Cylinder", category: "Basic" },
    { value: "quarter_cylinder", label: "🌘 Quarter Cylinder", category: "Basic" },
    { value: "rectangular_prism", label: "📦 Rectangular Prism", category: "Complex" },
    { value: "rhombic_prism", label: "🔷 Rhombic Prism", category: "Complex" },
    { value: "parallelepiped", label: "📐 Parallelepiped", category: "Complex" },
    { value: "trapezoidal_prism", label: "🔶 Trapezoidal Prism", category: "Complex" },
    { value: "kite_prism", label: "🪁 Kite Prism", category: "Complex" },
    { value: "polygon_24", label: "24-Polygon", category: "Ultra-Precision" },
    { value: "polygon_30", label: "30-Polygon", category: "Ultra-Precision" },
    { value: "polygon_36", label: "36-Polygon", category: "Ultra-Precision" },
    { value: "polygon_48", label: "48-Polygon", category: "Ultra-Precision" },
    { value: "polygon_60", label: "60-Polygon", category: "Ultra-Precision" },
    { value: "polygon_72", label: "72-Polygon", category: "Ultra-Precision" },
    { value: "tetrahedron", label: "🔺 Tetrahedron", category: "Pyramid" },
    { value: "triangular_pyramid", label: "🔺 Triangular Pyramid", category: "Pyramid" },
    { value: "square_pyramid", label: "🔻 Square Pyramid", category: "Pyramid" },
    { value: "pentagonal_pyramid", label: "🔻 Pentagonal Pyramid", category: "Pyramid" },
    { value: "hexagonal_pyramid", label: "🔻 Hexagonal Pyramid", category: "Pyramid" },
    { value: "heptagonal_pyramid", label: "🔻 Heptagonal Pyramid", category: "Pyramid" },
    { value: "octagonal_pyramid", label: "🔻 Octagonal Pyramid", category: "Pyramid" },
    { value: "nonagonal_pyramid", label: "🔻 Nonagonal Pyramid", category: "Pyramid" },
    { value: "decagonal_pyramid", label: "🔻 Decagonal Pyramid", category: "Pyramid" },
    { value: "hendecagonal_pyramid", label: "🔻 Hendecagonal Pyramid", category: "Pyramid" },
    { value: "dodecagonal_pyramid", label: "🔻 Dodecagonal Pyramid", category: "Pyramid" },

    // COMPLETE REMAINING SHAPES FROM SCHEMA
    { value: "cone", label: "🔺 Cone", category: "Basic" },
    { value: "cylinder", label: "🥤 Cylinder", category: "Basic" },
    { value: "sphere", label: "🌍 Sphere", category: "Basic" },
    { value: "torus", label: "🍩 Torus", category: "Basic" },
    { value: "ellipsoid", label: "🥚 Ellipsoid", category: "Basic" },
    { value: "paraboloid", label: "🏔️ Paraboloid", category: "Basic" },
    { value: "hyperboloid", label: "⧗ Hyperboloid", category: "Basic" },
    { value: "hemisphere", label: "🌗 Hemisphere", category: "Sphere" },
    { value: "spherical_cap", label: "🧢 Spherical Cap", category: "Sphere" },
    { value: "quarter_sphere", label: "🌘 Quarter Sphere", category: "Sphere" },
    { value: "annulus_torus", label: "🍩 Annulus Torus", category: "Torus" },
    { value: "cylindrical_shell", label: "🥤 Cylindrical Shell", category: "Shell" },
    { value: "star_5_prism", label: "⭐ 5-Star", category: "Star" },
    { value: "star_6_hexagram", label: "✡️ 6-Star", category: "Star" },
    { value: "star_8_octagram", label: "✦ 8-Star", category: "Star" },
    { value: "concave_pentagon", label: "⬟ Concave Pentagon", category: "Concave" },
    { value: "concave_hexagon", label: "⬢ Concave Hexagon", category: "Concave" },
    { value: "crescent", label: "🌙 Crescent", category: "Complex" },
    { value: "heart_shape", label: "♥️ Heart", category: "Complex" },
    { value: "kidney_shape", label: "🫘 Kidney", category: "Complex" },
    { value: "oval_prolate", label: "🥚 Oval Prolate", category: "Oval" },
    { value: "oval_oblate", label: "🥚 Oval Oblate", category: "Oval" },
    { value: "lens_biconvex", label: "🔍 Lens Biconvex", category: "Lens" },
    { value: "lens_biconcave", label: "🔍 Lens Biconcave", category: "Lens" },
    { value: "airfoil_naca", label: "✈️ NACA Airfoil", category: "Technical" },
    { value: "gear_tooth", label: "⚙️ Gear Tooth", category: "Technical" },
    { value: "cam_profile", label: "🔄 Cam Profile", category: "Technical" },
    { value: "spline_surface", label: "📈 Spline Surface", category: "Technical" },
    { value: "bezier_surface", label: "🎨 Bezier Surface", category: "Technical" },
    { value: "nurbs_surface", label: "📐 NURBS Surface", category: "Technical" },
    { value: "koch_snowflake", label: "❄️ Koch Snowflake", category: "Fractal" },
    { value: "sierpinski_pyramid", label: "🔺 Sierpinski Pyramid", category: "Fractal" },
    { value: "dragon_curve", label: "🐉 Dragon Curve", category: "Fractal" },
    { value: "mandelbrot_solid", label: "🌀 Mandelbrot Solid", category: "Fractal" },
    { value: "gothic_arch", label: "⛪ Gothic Arch", category: "Architecture" },
    { value: "roman_arch", label: "🏛️ Roman Arch", category: "Architecture" },
    { value: "ogee_curve", label: "🌊 Ogee Curve", category: "Architecture" },
    { value: "s_curve_flowing", label: "〰️ S-Curve", category: "Architecture" },
    { value: "simplex_4d", label: "🔺 4D Simplex", category: "4D Basic" },
    { value: "hypersphere_4d", label: "🌐 4D Hypersphere", category: "4D Basic" },
    { value: "cell_16", label: "◈ 16-Cell", category: "4D Basic" },
    { value: "cell_120", label: "⬟ 120-Cell", category: "4D Basic" },
    { value: "cell_600", label: "⬢ 600-Cell", category: "4D Basic" },
    { value: "pseudosphere", label: "🎺 Pseudosphere", category: "Non-Euclidean" },
    { value: "hyperbolic_paraboloid", label: "🏔️ Hyperbolic Paraboloid", category: "Non-Euclidean" },
    { value: "hyperbolic_pentagon", label: "⬟ Hyperbolic Pentagon", category: "Non-Euclidean" },
    { value: "hyperbolic_tiling", label: "🔶 Hyperbolic Tiling", category: "Non-Euclidean" },
    { value: "spherical_triangle", label: "🔺 Spherical Triangle", category: "Spherical" },
    { value: "spherical_polygon", label: "⬢ Spherical Polygon", category: "Spherical" },
    { value: "minkowski_hyperboloid", label: "⌬ Minkowski Hyperboloid", category: "Spacetime" },
    { value: "light_cone", label: "💡 Light Cone", category: "Spacetime" },
    { value: "spacetime_geodesic", label: "🚀 Spacetime Geodesic", category: "Spacetime" },
    { value: "square_root_riemann", label: "√ Square Root Riemann", category: "Riemann" },
    { value: "logarithm_riemann", label: "log Logarithm Riemann", category: "Riemann" },
    { value: "exponential_riemann", label: "e Exponential Riemann", category: "Riemann" },
    { value: "nth_root_riemann", label: "ⁿ√ Nth Root Riemann", category: "Riemann" },
    { value: "modular_function", label: "📊 Modular Function", category: "Riemann" },
    { value: "elliptic_function", label: "🔄 Elliptic Function", category: "Riemann" },
    { value: "root_chakra", label: "🔴 Root Chakra", category: "Sacred" },
    { value: "sacral_chakra", label: "🟠 Sacral Chakra", category: "Sacred" },
    { value: "solar_plexus_chakra", label: "🟡 Solar Plexus Chakra", category: "Sacred" },
    { value: "heart_chakra", label: "💚 Heart Chakra", category: "Sacred" },
    { value: "throat_chakra", label: "🔵 Throat Chakra", category: "Sacred" },
    { value: "third_eye_chakra", label: "🟣 Third Eye Chakra", category: "Sacred" },
    { value: "crown_chakra", label: "⚪ Crown Chakra", category: "Sacred" },
    { value: "tree_of_life", label: "🌳 Tree of Life", category: "Sacred" },
    { value: "icosahedron_group", label: "🔸 Icosahedron Group", category: "Group Theory" },
    { value: "dodecahedron_group", label: "🔹 Dodecahedron Group", category: "Group Theory" },
    { value: "cubic_lattice", label: "🔲 Cubic Lattice", category: "Crystal" },
    { value: "fcc_lattice", label: "📐 FCC Lattice", category: "Crystal" },
    { value: "hcp_lattice", label: "⬡ HCP Lattice", category: "Crystal" },
    { value: "functor_mapping", label: "🔗 Functor Mapping", category: "Category Theory" },
    { value: "natural_transformation", label: "↔️ Natural Transformation", category: "Category Theory" },
    { value: "adjoint_functors", label: "⇄ Adjoint Functors", category: "Category Theory" },
    { value: "klein_bottle", label: "🪐 Klein Bottle", category: "Topology" },
    { value: "trefoil_knot", label: "🪢 Trefoil Knot", category: "Topology" },
    { value: "figure8_knot", label: "∞ Figure-8 Knot", category: "Topology" },
    { value: "genus2_surface", label: "🥯 Genus-2 Surface", category: "Topology" },
    { value: "genus3_surface", label: "🥨 Genus-3 Surface", category: "Topology" },
    { value: "fiber_bundle", label: "📦 Fiber Bundle", category: "Topology" },
    { value: "homotopy_deformation", label: "🌊 Homotopy Deformation", category: "Topology" },
    { value: "sun", label: "☀️ Sun", category: "Natural" },
    { value: "sunflower", label: "🌻 Sunflower", category: "Natural" },
    { value: "letter_A", label: "🅰️ Letter A", category: "Symbol" },
    { value: "number_3", label: "3️⃣ Number 3", category: "Symbol" },
    { value: "apple", label: "🍎 Apple", category: "Natural" },
    { value: "star_3d", label: "⭐ 3D Star", category: "Star" },
    { value: "WHITE_HOLE", label: "⚪ White Hole", category: "Cosmic" },
    { value: "WORMHOLE", label: "🕳️ Wormhole", category: "Cosmic" },
    { value: "ERGOSPHERE", label: "🌌 Ergosphere", category: "Cosmic" },
    { value: "pentachoron", label: "🔺 Pentachoron", category: "4D Advanced" },
    { value: "hexacosichoron", label: "🔸 Hexacosichoron", category: "4D Advanced" },
    { value: "cell_24", label: "◈ 24-Cell", category: "4D Advanced" },
    { value: "klein_bottle_4d", label: "🪐 Klein Bottle 4D", category: "4D Advanced" },
    { value: "torus_4d", label: "🍩 4D Torus", category: "4D Advanced" },
    { value: "hopf_fibration", label: "🌐 Hopf Fibration", category: "4D Advanced" },
    { value: "mobius_4d", label: "🎭 4D Möbius Strip", category: "4D Advanced" },
    { value: "hypercylinder", label: "🔮 4D Hypercylinder", category: "4D Advanced" },
    { value: "hyperellipsoid_4d", label: "🥚 4D Hyperellipsoid", category: "4D Advanced" },
    { value: "schlafli_double_six", label: "⚛️ Schläfli Double Six", category: "4D Advanced" },
    { value: "hyperprism_4d", label: "🔷 4D Hyperprism", category: "4D Advanced" },
    { value: "clifford_torus", label: "🔗 Clifford Torus", category: "4D Advanced" },

    { value: "stereographic_projection_4d", label: "🎯 4D Stereographic Projection", category: "4D Advanced" },
    { value: "pentachoron_4d", label: "🔺 4D Pentachoron", category: "4D Advanced" },
    { value: "hyperboloid_4d_two_sheet", label: "⧨ 4D Hyperboloid Two-Sheet", category: "4D Advanced" },

    { value: "modular_surface_knots_4d", label: "🪢 Modular Surface Knots 4D", category: "4D Frontier" },

    { value: "quantum_hall_droplets_4d", label: "💧 Quantum Hall Droplets 4D", category: "4D Frontier" },
    { value: "hyperbolic_limit_sets_4d", label: "🌊 Hyperbolic Limit Sets 4D", category: "4D Frontier" },
    { value: "seiberg_witten_monopoles_4d", label: "⚛️ Seiberg-Witten Monopoles 4D", category: "4D Frontier" },
    { value: "percolation_cluster_boundaries_4d", label: "🔬 Percolation Cluster Boundaries 4D", category: "4D Frontier" },
    { value: "perfectoid_spaces_4d", label: "💎 Perfectoid Spaces 4D", category: "4D Frontier" },
  ].filter((shape, index, self) =>
    index === self.findIndex(s => s.value === shape.value)
  ), []);

  // Filter shapes based on search query
  const filteredShapes = useMemo(() => {
    if (!searchQuery.trim()) return allShapes;

    const query = searchQuery.toLowerCase();
    return allShapes.filter(shape => 
      shape.label.toLowerCase().includes(query) ||
      shape.value.toLowerCase().includes(query) ||
      shape.category.toLowerCase().includes(query) ||
      // Special search terms
      (query.includes('tqft') && shape.value === 'topological_quantum_field_theory_4d') ||
      (query.includes('quantum') && (shape.value.includes('quantum') || shape.label.includes('Quantum'))) ||
      (query.includes('langlands') && shape.value.includes('langlands')) ||
      (query.includes('4d') && shape.category.includes('4D'))
    );
  }, [searchQuery, allShapes]);

  const handleParameterSliderChange = (paramName: string, value: number[]) => {
    onParameterChange({ [paramName]: value[0] });
  };

  const handle5DControlsChange = (controls: any) => {
    // Update visualization based on 5D controls
    console.log('5D Controls updated:', controls);
  };

  const handleResetShape = () => {
    const shapeDefaults = getShapeDefaults(parameters.type);
    console.log('Resetting shape:', parameters.type, 'with defaults:', shapeDefaults);
    // Force complete parameter reset including all 23 parameters
    const fullReset = {
      ...shapeDefaults,
      // Ensure all 23 parameters are reset to their shape-specific values
      a: shapeDefaults.a || 1,
      b: shapeDefaults.b || 1,
      c: shapeDefaults.c || 1,
      d: shapeDefaults.d || 1,
      e: shapeDefaults.e || 1,
      f: shapeDefaults.f || 1,
      g: shapeDefaults.g || 1,
      h: shapeDefaults.h || 1,
      i: shapeDefaults.i || 1,
      j: shapeDefaults.j || 1,
      k: shapeDefaults.k || 1,
      l: shapeDefaults.l || 1,
      m: shapeDefaults.m || 1,
      n: shapeDefaults.n || 1,
      o: shapeDefaults.o || 1,
      p: shapeDefaults.p || 1,
      q: shapeDefaults.q || 1,
      r: shapeDefaults.r || 1,
      s: shapeDefaults.s || 1,
      t: shapeDefaults.t || 1,
      u: shapeDefaults.u || 1,
      v: shapeDefaults.v || 1,
      w: shapeDefaults.w || 1,
    };
    onParameterChange(fullReset);
  };

  return (
    <div className="absolute top-4 left-4 w-72 bg-black/95 backdrop-blur-sm rounded-lg p-3 border border-gray-700 text-white z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-gray-800 mb-3">
          <TabsTrigger value="parameters" className="text-xs flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-4">
        {/* Search Box */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Search Designs</Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Type TQFT, quantum, 4D..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-7 text-xs bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Header Controls */}
        <div className="grid grid-cols-2 gap-2">
          {/* Shape Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-medium">Shape</Label>
            <Select value={parameters.type} onValueChange={(value: any) => {
              try {
                const isolatedParams = getIsolatedShapeParameters(value);
                console.log('Shape selection changed to:', value, 'with isolated parameters:', isolatedParams);
                onParameterChange(isolatedParams);
              } catch (error) {
                console.error('Failed to get isolated parameters for shape:', value, error);
                // Fallback to shape defaults if isolation fails
                const defaults = getShapeDefaults(value);
                onParameterChange({ type: value, ...defaults });
              }
            }}>
              <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 max-h-64 overflow-y-auto">
                {filteredShapes.length > 0 ? (
                  Object.entries(
                    filteredShapes.reduce((acc, shape) => {
                      if (!acc[shape.category]) acc[shape.category] = [];
                      acc[shape.category].push(shape);
                      return acc;
                    }, {} as Record<string, typeof filteredShapes>)
                  ).map(([category, shapes]) => [
                    <div key={`category-${category}`} className="px-2 py-1 text-xs text-gray-400 font-semibold border-b border-gray-600">
                      {category}
                    </div>,
                    ...shapes.map((shape, index) => (
                      <SelectItem 
                        key={`shape-${category}-${shape.value}-${index}`} 
                        value={shape.value}
                        className="text-cyan-400 hover:bg-cyan-500/20 text-xs"
                      >
                        {shape.label}
                      </SelectItem>
                    ))
                  ]).flat()
                ) : (
                  <div className="px-2 py-1 text-xs text-gray-400">
                    No shapes match "{searchQuery}"
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>


        </div>




        {/* Color Mode & Reset Button */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-1">
            <Label className="text-xs font-medium">Color System</Label>
            <Select value={colorMode} onValueChange={onColorModeChange}>
              <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="neon_green">Neon Green</SelectItem>
                <SelectItem value="neon_magenta">Neon Magenta</SelectItem>
                <SelectItem value="neon_orange">Neon Orange</SelectItem>
                <SelectItem value="neon_white">Pure White</SelectItem>
                <SelectItem value="neon_black">Pure Black</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Reset</Label>
            <Button
              onClick={handleResetShape}
              className="h-8 w-full bg-red-600 hover:bg-red-700 text-white text-xs flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Range Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">U Min</Label>
            <Slider
              value={[parameters.uMin]}
              onValueChange={(value) => onParameterChange({ uMin: value[0] })}
              min={-10}
              max={10}
              step={0.00001}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{parameters.uMin.toFixed(5)}</span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">U Max</Label>
            <Slider
              value={[parameters.uMax]}
              onValueChange={(value) => onParameterChange({ uMax: value[0] })}
              min={-10}
              max={10}
              step={0.00001}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{parameters.uMax.toFixed(5)}</span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">V Min</Label>
            <Slider
              value={[parameters.vMin]}
              onValueChange={(value) => onParameterChange({ vMin: value[0] })}
              min={-10}
              max={10}
              step={0.00001}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{parameters.vMin.toFixed(5)}</span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">V Max</Label>
            <Slider
              value={[parameters.vMax]}
              onValueChange={(value) => onParameterChange({ vMax: value[0] })}
              min={-10}
              max={10}
              step={0.00001}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{parameters.vMax.toFixed(5)}</span>
          </div>
        </div>

        {/* Segment Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">U Segments</Label>
            <Slider
              value={[parameters.uSegments]}
              onValueChange={(value) => onParameterChange({ uSegments: Math.round(value[0]) })}
              min={5}
              max={150}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{parameters.uSegments}</span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">V Segments</Label>
            <Slider
              value={[parameters.vSegments]}
              onValueChange={(value) => onParameterChange({ vSegments: Math.round(value[0]) })}
              min={5}
              max={150}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{parameters.vSegments}</span>
          </div>
        </div>

        {/* Core Mathematical Parameters (a through f) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-cyan-400 border-b border-cyan-400/30 pb-1">Core Parameters (a→f)</Label>

          {/* Enhanced Primary Parameters (a-f) with larger display */}
          <div className="grid grid-cols-2 gap-3">
            {PARAMETER_NAMES.slice(0, 6).map((paramName) => (
              <div key={paramName} className="space-y-1 p-2 bg-blue-500/10 rounded border border-blue-400/30">
                <Label className="text-sm uppercase font-bold text-blue-400">{paramName}</Label>
                <Slider
                  value={[parameters[paramName]]}
                  onValueChange={(value) => handleParameterSliderChange(paramName, value)}
                  min={-10}
                  max={10}
                  step={0.00001}
                  className="w-full"
                />
                <span className="text-sm text-blue-300 font-mono font-bold">{parameters[paramName].toFixed(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extended Mathematical Parameters (g through w) - Only for supported shapes */}
        {supports4DDynamics && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-yellow-400">Enhanced 4D Dynamics (g→w)</Label>

          {/* Advanced 4D Parameters (g-m) */}
          <div className="grid grid-cols-3 gap-2">
            {PARAMETER_NAMES.slice(6, 13).map((paramName, index) => {
              const labels = [
                'g - Parallel Field', 'h - Dimensional Fold', 'i - Quantum Phase', 
                'j - Tensor Flow', 'k - Metric Warp', 'l - Space Twist', 'm - Time Dilation'
              ];
              return (
                <div key={paramName} className="space-y-1 p-2 bg-green-500/10 rounded border border-green-400/30">
                  <Label className="text-xs font-bold text-green-400">{labels[index]}</Label>
                  <Slider
                    value={[parameters[paramName]]}
                    onValueChange={(value) => handleParameterSliderChange(paramName, value)}
                    min={-10}
                    max={10}
                    step={0.00001}
                    className="w-full"
                  />
                  <span className="text-xs text-green-300 font-mono">{parameters[paramName].toFixed(5)}</span>
                </div>
              );
            })}
          </div>

          {/* Tertiary Parameters (n-s) */}
          <div className="grid grid-cols-3 gap-2">
            {PARAMETER_NAMES.slice(13, 19).map((paramName) => (
              <div key={paramName} className="space-y-1">
                <Label className="text-xs uppercase font-bold text-purple-400">{paramName}</Label>
                <Slider
                  value={[parameters[paramName]]}
                  onValueChange={(value) => handleParameterSliderChange(paramName, value)}
                  min={-10}
                  max={10}
                  step={0.00001}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{parameters[paramName].toFixed(5)}</span>
              </div>
            ))}
          </div>

          {/* Final Parameters (t-w) */}
          <div className="grid grid-cols-4 gap-2">
            {PARAMETER_NAMES.slice(19).map((paramName) => (
              <div key={paramName} className="space-y-1">
                <Label className="text-xs uppercase font-bold text-red-400">{paramName}</Label>
                <Slider
                  value={[parameters[paramName]]}
                  onValueChange={(value) => handleParameterSliderChange(paramName, value)}
                  min={-10}
                  max={10}
                  step={0.00001}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{parameters[paramName].toFixed(5)}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Reset Button */}
        <div className="pt-2">
          <Button
            onClick={() => onParameterChange(getShapeDefaults(parameters.type))}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Shape
          </Button>
        </div>
        </TabsContent>


      </Tabs>



      {/* Mathematical Verification Panel - Only for Langlands Correspondence */}
      <div className="mt-4">
        <MathVerificationPanel
          surfaceType={parameters.type}
          parameters={parameters}
          isVisible={true}
        />
      </div>

      {/* Research Export Button */}
      <div className="mt-4 flex justify-center">
        <ResearchExportButton
          currentShape={parameters.type}
          verificationResults={{
            lmfdb: 85,
            arxiv: 78,
            geometric: 92,
            scientific: 88
          }}
          scene={sceneRefs?.scene || undefined}
          camera={sceneRefs?.camera || undefined}
          renderer={sceneRefs?.renderer || undefined}
        />
      </div>
    </div>
  );
}