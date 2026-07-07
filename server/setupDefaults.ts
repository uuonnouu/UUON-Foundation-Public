import { storage } from "./storage";
import { SurfaceParameters } from "../shared/schema";

// Default mathematical parameters for different shape types
const DEFAULT_CUBE_PARAMETERS: SurfaceParameters = {
  type: 'cube',
  uMin: 0,
  uMax: 6.28,
  vMin: 0,
  vMax: 6.28,
  uSegments: 50,
  vSegments: 50,
  a: 1.0,    // Size/scale
  b: 1.0,    // Secondary scale
  c: 0.0,    // Offset X
  d: 0.0,    // Offset Y
  e: 0.0,    // Offset Z
  f: 0.0,    // Rotation X
  g: 0.0,    // Rotation Y
  h: 0.0,    // Rotation Z
  i: 0.0,    // Modifier 1
  j: 0.0,    // Modifier 2
  k: 0.0,    // Modifier 3
  l: 0.0,    // Modifier 4
  m: 0.0,    // Modifier 5
  n: 0.0,    // Modifier 6
  o: 0.0,    // Modifier 7
  p: 0.0,    // Modifier 8
  q: 0.0,    // Modifier 9
  r: 0.0,    // Modifier 10
  s: 0.0,    // Modifier 11
  t: 0.0,    // Modifier 12
  u: 0.0,    // Modifier 13
  v: 0.0,    // Modifier 14
  w: 0.0     // Modifier 15
};

const DEFAULT_TRIANGLE_PARAMETERS: SurfaceParameters = {
  ...DEFAULT_CUBE_PARAMETERS,
  type: 'triangular_prism',
  uSegments: 3,
  vSegments: 3,
  a: 2.0
};

const DEFAULT_SPHERE_PARAMETERS: SurfaceParameters = {
  ...DEFAULT_CUBE_PARAMETERS,
  type: 'sphere',
  uMin: 0,
  uMax: 6.28,
  vMin: 0,
  vMax: 3.14,
  uSegments: 32,
  vSegments: 16,
  a: 2.0
};

const DEFAULT_CONE_PARAMETERS: SurfaceParameters = {
  ...DEFAULT_CUBE_PARAMETERS,
  type: 'cone',
  uMin: 0,
  uMax: 6.28,
  vMin: 0,
  vMax: 2.0,
  uSegments: 24,
  vSegments: 12,
  a: 2.0,
  b: 3.0
};

// Default visualizations for the community showcase
const DEFAULT_VISUALIZATIONS = [
  {
    name: "Perfect Cube - Wire Mesh Foundation",
    description: "Basic cube wireframe with mathematical precision - perfect for dimensional mathematics exploration",
    surfaceType: "cube",
    parameters: DEFAULT_CUBE_PARAMETERS,
    visualMode: "wireframe",
    colorMode: "neon",
    isPublic: true,
    userId: null, // System default
    viewCount: 0,
    likeCount: 5
  },
  {
    name: "Triangular Prism - Geometric Harmony",
    description: "Three-sided prism demonstrating balanced mathematical proportions with perfect angles",
    surfaceType: "triangular_prism", 
    parameters: DEFAULT_TRIANGLE_PARAMETERS,
    visualMode: "wireframe",
    colorMode: "plasma",
    isPublic: true,
    userId: null,
    viewCount: 0,
    likeCount: 3
  },
  {
    name: "Sphere - Universal Form",
    description: "Perfect sphere representing mathematical infinity and universal harmony",
    surfaceType: "sphere",
    parameters: DEFAULT_SPHERE_PARAMETERS,
    visualMode: "surface",
    colorMode: "rainbow",
    isPublic: true,
    userId: null,
    viewCount: 0,
    likeCount: 8
  },
  {
    name: "Cone - Dimensional Transition",
    description: "Cone structure showing transition from circle to point - mathematical transformation",
    surfaceType: "cone",
    parameters: DEFAULT_CONE_PARAMETERS,
    visualMode: "diamond_mesh",
    colorMode: "gradient",
    isPublic: true,
    userId: null,
    viewCount: 0,
    likeCount: 4
  },
  {
    name: "Cross Pattern - Sacred Geometry",
    description: "Cube transformed into cross pattern using plus visualization mode",
    surfaceType: "cube",
    parameters: {
      ...DEFAULT_CUBE_PARAMETERS,
      a: 1.5,
      b: 1.5,
      i: 1.0 // Cross enhancement
    },
    visualMode: "wireframe",
    colorMode: "neon",
    isPublic: true,
    userId: null,
    viewCount: 0,
    likeCount: 7
  }
];

// Default system user for community content
const DEFAULT_SYSTEM_USER = {
  username: "dimensional_system",
  password: "$2b$10$rGBgT8jF8nq4YxLjN9XvNu7X5KJ9ZqNvWjB5rCxD6wN8Y3sF2uL4e" // "mathematics2024"
};

// Performance metrics defaults
const DEFAULT_PERFORMANCE_METRICS = [
  {
    userId: null,
    sessionId: "system-performance",
    renderTime: 16.67, // 60 FPS target
    triangleCount: 1000,
    memoryUsage: 50.0,
    qualityLevel: "medium",
    frameRate: 60.0,
    timestamp: new Date()
  }
];

export const setupDefaultCollaborativeSessions = async () => {
  // Collaborative sessions removed per user request
  console.log("🤝 Collaborative sessions feature disabled");
  return 0;
};

export const setupDefaultCommunityCreations = async () => {
  // Community creations removed per user request
  console.log("🎨 Community creations feature disabled");
  return 0;
};

export async function setupDefaultSettings() {
  try {
    console.log("🔧 Setting up default database settings...");

    // Create system user first
    console.log("📝 Creating system user...");
    let systemUser;
    try {
      systemUser = await storage.createUser(DEFAULT_SYSTEM_USER);
      console.log("✅ System user created:", systemUser.username);
    } catch (error) {
      // User might already exist
      systemUser = await storage.getUserByUsername("dimensional_system");
      console.log("✅ System user already exists:", systemUser?.username);
    }

    // Create default visualizations
    console.log("📊 Creating default visualizations...");
    for (const viz of DEFAULT_VISUALIZATIONS) {
      try {
        const visualization = await storage.saveVisualization({
          ...viz,
          userId: systemUser?.id || null
        });
        console.log(`✅ Created visualization: ${visualization.name}`);
      } catch (error) {
        console.log(`⚠️  Visualization might already exist: ${viz.name}`);
      }
    }

    // Create default performance metrics
    console.log("📈 Creating default performance metrics...");
    for (const metrics of DEFAULT_PERFORMANCE_METRICS) {
      try {
        await storage.savePerformanceMetrics({
          ...metrics,
          userId: systemUser?.id || null
        });
        console.log("✅ Created performance metrics");
      } catch (error) {
        console.log("⚠️  Performance metrics might already exist");
      }
    }

    // Set up performance baselines
    const metricCount = 0; // storage.setupDefaultPerformanceMetrics() disabled

    // Collaborative and community features disabled
    const sessionCount = 0;
    const communityCount = 0;

    const visualizationCount = DEFAULT_VISUALIZATIONS.length;

    console.log("🎉 Default settings setup completed successfully!");
    console.log("📋 Summary:");
    console.log(`   • Default visualizations: ${visualizationCount}`);
    console.log(`   • Performance baselines: ${metricCount}`);
    console.log(`   • Collaborative/Community features: Disabled`);

    return {
      success: true,
      systemUser,
      visualizations: visualizationCount,
      metrics: metricCount
    };

  } catch (error) {
    console.error("❌ Error setting up default settings:", error);
    throw error;
  }
}

// Export defaults for use in other parts of the system
export {
  DEFAULT_CUBE_PARAMETERS,
  DEFAULT_TRIANGLE_PARAMETERS,
  DEFAULT_SPHERE_PARAMETERS,
  DEFAULT_CONE_PARAMETERS,
  DEFAULT_VISUALIZATIONS,
  DEFAULT_SYSTEM_USER,
  DEFAULT_PERFORMANCE_METRICS
};