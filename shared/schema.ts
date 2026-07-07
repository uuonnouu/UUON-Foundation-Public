import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mathematical Visualizations Table
export const visualizations = pgTable("visualizations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  surfaceType: text("surface_type").notNull(),
  parameters: json("parameters").notNull(), // Stores all 23 parameters (a-w) plus UV ranges
  visualMode: text("visual_mode").notNull().default('surface'),
  colorMode: text("color_mode").notNull().default('plasma'),
  isPublic: boolean("is_public").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Removed collaborative sessions table - feature not in use

// Parameter History Table (for undo/redo functionality)
export const parameterHistory = pgTable("parameter_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  parameters: json("parameters").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Performance Metrics Table
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  surfaceType: text("surface_type").notNull(),
  triangleCount: integer("triangle_count"),
  fps: real("fps"),
  renderTime: real("render_time"), // milliseconds
  memoryUsage: real("memory_usage"), // MB
  deviceInfo: json("device_info"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Removed community creations table - feature not in use

// Scientific 4D Research Schema - Comprehensive research data storage
export const scientific4DResearch = pgTable("scientific_4d_research", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  
  // Research Identification
  researchTitle: text("research_title").notNull(),
  researchType: text("research_type").notNull(), // "langlands_correspondence", "geometric_analysis", "topology_study", "4d_projection"
  researchCategory: text("research_category").notNull(), // "peer_review", "experimental", "validated", "breakthrough"
  publicationStatus: text("publication_status").default("draft"), // "draft", "submitted", "peer_review", "published"
  
  // 4D Mathematical Object Data
  surfaceType: text("surface_type").notNull(),
  parameters: json("parameters").notNull(), // Complete 23-parameter system (a-w)
  enhancedParameters: json("enhanced_parameters").notNull(), // G-M enhancement settings
  defaultDesign: json("default_design").notNull(), // Original shape without enhancements
  
  // Visual Documentation
  screenshotUrls: json("screenshot_urls").default('[]'), // Array of image URLs
  videoUrls: json("video_urls").default('[]'), // Array of video documentation URLs
  visualizationSettings: json("visualization_settings").notNull(), // Camera, lighting, colors, zoom
  renderingQuality: text("rendering_quality").default("high"), // "low", "medium", "high", "research_grade"
  
  // Mathematical Validation
  verificationResults: json("verification_results").notNull(), // All 4 API validation results
  proofOfWork: json("proof_of_work").notNull(), // Mathematical proof documentation
  lmfdbValidation: json("lmfdb_validation").notNull(), // LMFDB database verification
  arxivReferences: json("arxiv_references").default('[]'), // Research paper citations
  oeisSequences: json("oeis_sequences").default('[]'), // Integer sequence validations
  geometricAnalysis: json("geometric_analysis").notNull(), // Open3D-inspired validation
  scientificComputing: json("scientific_computing").notNull(), // VTK-inspired validation
  
  // Research Metrics
  confidenceScore: real("confidence_score").notNull(), // Combined validation percentage
  medianScore: real("median_score").notNull(),
  meanScore: real("mean_score").notNull(),
  reproducibilityScore: real("reproducibility_score").default(0.0), // Research reproducibility
  
  // Peer Review Data
  reviewStatus: text("review_status").default("pending"), // "pending", "approved", "rejected", "revision_required"
  reviewerNotes: json("reviewer_notes").default('[]'),
  citations: integer("citations").default(0),
  downloadCount: integer("download_count").default(0),
  
  // Collaboration
  collaborators: json("collaborators").default('[]'), // Array of user IDs
  sharedWithInstitutions: json("shared_with_institutions").default('[]'),
  isPublicResearch: boolean("is_public_research").default(false),
  
  // Technical Metadata
  renderingMetrics: json("rendering_metrics").notNull(), // Performance data
  systemSpecs: json("system_specs").notNull(), // Hardware used for research
  softwareVersion: text("software_version").notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  lastModified: timestamp("last_modified").defaultNow(),
  publishedAt: timestamp("published_at"),
  lastValidated: timestamp("last_validated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVisualizationSchema = createInsertSchema(visualizations).pick({
  name: true,
  description: true,
  surfaceType: true,
  parameters: true,
  visualMode: true,
  colorMode: true,
  isPublic: true,
});

// Sessions table removed - collaborative sessions feature not in use

export const insertScientific4DResearchSchema = createInsertSchema(scientific4DResearch).pick({
  researchTitle: true,
  researchType: true,
  researchCategory: true,
  surfaceType: true,
  parameters: true,
  enhancedParameters: true,
  defaultDesign: true,
  verificationResults: true,
  proofOfWork: true,
  lmfdbValidation: true,
  geometricAnalysis: true,
  scientificComputing: true,
  confidenceScore: true,
  medianScore: true,
  meanScore: true,
  visualizationSettings: true,
  renderingMetrics: true,
  systemSpecs: true,
  softwareVersion: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Visualization = typeof visualizations.$inferSelect;
export type ParameterHistory = typeof parameterHistory.$inferSelect;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type Scientific4DResearch = typeof scientific4DResearch.$inferSelect;
export type InsertScientific4DResearch = z.infer<typeof insertScientific4DResearchSchema>;

// Surface parameter types for mathematical visualization
export type SurfaceType = 
  | 'triangular_prism' | 'square' | 'cube' | 'square_prism' | 'pentagonal_prism' | 'hexagonal_prism' | 'heptagonal_prism'
  | 'octagonal_prism' | 'nonagonal_prism' | 'decagonal_prism' | 'hendecagonal_prism' | 'dodecagonal_prism'
  | 'cone' | 'cylinder' | 'sphere' | 'torus' | 'ellipsoid' | 'elliptical_cylinder' | 'elliptical_cone'
  | 'paraboloid' | 'hyperboloid' | 'half_cylinder' | 'quarter_cylinder'
  | 'rectangular_prism' | 'rhombic_prism' | 'parallelepiped' | 'trapezoidal_prism' | 'kite_prism'
  | 'tridecagonal_prism' | 'tridecagonal_pyramid' | 'tetradecagonal_prism' | 'tetradecagonal_pyramid'
  | 'pentadecagonal_prism' | 'pentadecagonal_pyramid' | 'hexadecagonal_prism' | 'hexadecagonal_pyramid'
  | 'heptadecagonal_prism' | 'heptadecagonal_pyramid' | 'octadecagonal_prism' | 'octadecagonal_pyramid'
  | 'enneadecagonal_prism' | 'enneadecagonal_pyramid' | 'icosagonal_prism' | 'icosagonal_pyramid'
  | 'polygon_24' | 'polygon_30' | 'polygon_36' | 'polygon_48' | 'polygon_60' | 'polygon_72'
  | 'tetrahedron' | 'triangular_pyramid' | 'square_pyramid' | 'pentagonal_pyramid' | 'hexagonal_pyramid'
  | 'heptagonal_pyramid' | 'octagonal_pyramid' | 'nonagonal_pyramid' | 'decagonal_pyramid'
  | 'hendecagonal_pyramid' | 'dodecagonal_pyramid' | 'hemisphere' | 'spherical_cap' | 'quarter_sphere'
  | 'annulus_torus' | 'cylindrical_shell' | 'star_5_prism' | 'star_6_hexagram' | 'star_8_octagram'
  | 'concave_pentagon' | 'concave_hexagon' | 'crescent' | 'heart_shape' | 'kidney_shape'
  | 'oval_prolate' | 'oval_oblate' | 'lens_biconvex' | 'lens_biconcave' | 'airfoil_naca'
  | 'gear_tooth' | 'cam_profile' | 'spline_surface' | 'bezier_surface' | 'nurbs_surface'
  | 'koch_snowflake' | 'sierpinski_pyramid' | 'dragon_curve' | 'mandelbrot_solid'
  | 'gothic_arch' | 'roman_arch' | 'ogee_curve' | 's_curve_flowing'
  | 'simplex_4d' | 'hypersphere_4d' | 'hypercube_tesseract' | 'cell_16' | 'cell_120' | 'cell_600'
  | 'pseudosphere' | 'hyperbolic_paraboloid' | 'hyperbolic_pentagon' | 'hyperbolic_tiling'
  | 'spherical_triangle' | 'spherical_polygon' | 'minkowski_hyperboloid' | 'light_cone' | 'spacetime_geodesic'
  | 'square_root_riemann' | 'logarithm_riemann' | 'exponential_riemann' | 'nth_root_riemann' | 'modular_function' | 'elliptic_function'
  | 'root_chakra' | 'sacral_chakra' | 'solar_plexus_chakra' | 'heart_chakra' | 'throat_chakra' | 'third_eye_chakra' | 'crown_chakra' | 'tree_of_life'
  | 'icosahedron_group' | 'dodecahedron_group' | 'cubic_lattice' | 'fcc_lattice' | 'hcp_lattice'
  | 'functor_mapping' | 'natural_transformation' | 'adjoint_functors'
  | 'klein_bottle' | 'trefoil_knot' | 'figure8_knot' | 'genus2_surface' | 'genus3_surface' | 'fiber_bundle' | 'homotopy_deformation'
  | 'sun' | 'sunflower' | 'letter_A' | 'number_3' | 'apple' | 'star_3d' | 'nautilus_shell'
  | 'GRAVITY_WELL' | 'WHITE_HOLE' | 'WORMHOLE' | 'ERGOSPHERE'
  | 'pentachoron' | 'hexacosichoron' | 'cell_24' | 'klein_bottle_4d'
  | 'torus_4d' | 'hopf_fibration' | 'mobius_4d' | 'hypercylinder' | 'hyperellipsoid_4d'
  | 'schlafli_double_six' | 'hyperprism_4d' | 'clifford_torus' | 'duoprism_4d' | 'stereographic_projection_4d'
  | 'pentachoron_4d' | 'hyperboloid_4d_two_sheet' | 'lissajous_knot_4d'
  | 'modular_surface_knots_4d' | 'ricci_flow_singularities_4d' | 'quantum_hall_droplets_4d'
  | 'hyperbolic_limit_sets_4d' | 'seiberg_witten_monopoles_4d' | 'percolation_cluster_boundaries_4d'
  | 'gravitational_wave_resonators_4d'
  
  // 4D Formula Objects - Complete Mathematical Framework
  | 'tesseract_4d_formula' | 'hypersphere_4d_formula' | 'klein_bottle_4d_formula'
  | 'duocylinder_4d_formula' | 'simplex_5cell_formula' | 'cross_polytope_16cell_formula'
  | 'mobius_strip_4d_formula' | 'hopf_fibration_formula' | 'clifford_torus_formula'
  | 'duoprism_formula' | 'stereographic_projection_formula' | 'pentachoron_formula'
  | 'hyperboloid_two_sheet_formula' | 'lissajous_knot_formula' | 'borromean_rings_formula'
  | 'kummer_surface_formula' | 'penrose_tiling_formula' | 'quantum_hall_droplets_formula'
  | 'hyperbolic_limit_sets_formula' | 'seiberg_witten_monopoles_formula' | 'langlands_correspondence_4d'
  | 'topological_quantum_field_theory_4d' | 'arithmetic_hyperbolic_manifolds_4d' | 'exotic_smooth_structures_4d'
  | 'rational_elliptic_surfaces_4d' | 'instanton_moduli_spaces_4d' | 'cellular_automata_4d' | 'minimal_surfaces_4d'
  | 'perfectoid_spaces_4d'
  | 'zimmer_program_4d';

export type VisualizationMode = 'surface' | 'wireframe' | 'points' | 'diamond_mesh' | 'metal_texture' | 'glass' | 'dynamic_plasma';

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
}
