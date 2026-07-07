
import { Request, Response, Router } from "express";
import { setupDefaultSettings } from "./setupDefaults";
import { ensureDefaultsExist } from "./initializeDatabase";
import { storage } from "./storage";
import { migrateDatabase, verifySchema } from "./migrateSchema";

const router = Router();

// Reset database to defaults
router.post("/api/database/reset-defaults", async (req: Request, res: Response) => {
  try {
    console.log("🔄 Resetting database to defaults...");
    const result = await setupDefaultSettings();
    res.json({ 
      success: true, 
      message: "Database reset to defaults successfully",
      data: result 
    });
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to reset database", 
      error: error.message 
    });
  }
});

// Check database status
router.get("/api/database/status", async (req: Request, res: Response) => {
  try {
    const systemUser = await storage.getUserByUsername("dimensional_system");
    const publicVisualizations = await storage.getPublicVisualizations();
    const communityCreations = await storage.getCommunityCreations();
    
    // Calculate approximate database size
    const estimatedSize = (publicVisualizations.length * 2) + (communityCreations.length * 1.5);
    
    res.json({
      success: true,
      status: {
        systemUser: !!systemUser,
        publicVisualizations: publicVisualizations.length,
        communityCreations: communityCreations.length,
        initialized: !!systemUser && publicVisualizations.length > 0,
        estimatedSizeMB: estimatedSize.toFixed(2),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("❌ Error checking database status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check database status", 
      error: error.message 
    });
  }
});

// Ensure defaults exist
router.post("/api/database/ensure-defaults", async (req: Request, res: Response) => {
  try {
    const result = await ensureDefaultsExist();
    res.json({ 
      success: result, 
      message: result ? "Defaults ensured" : "Failed to ensure defaults" 
    });
  } catch (error) {
    console.error("❌ Error ensuring defaults:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to ensure defaults", 
      error: error.message 
    });
  }
});

// Migrate database schema
router.post("/api/database/migrate-schema", async (req: Request, res: Response) => {
  try {
    console.log("🔄 Migrating database schema...");
    const result = await migrateDatabase();
    
    res.json({
      success: true,
      message: "Database schema migrated successfully",
      data: result
    });
  } catch (error) {
    console.error("❌ Error migrating database schema:", error);
    res.status(500).json({
      success: false,
      message: "Failed to migrate database schema",
      error: error.message
    });
  }
});

// Verify database schema
router.get("/api/database/verify-schema", async (req: Request, res: Response) => {
  try {
    const result = await verifySchema();
    
    res.json({
      success: result.valid,
      message: result.valid ? "Schema verified successfully" : "Schema verification failed",
      data: result
    });
  } catch (error) {
    console.error("❌ Error verifying database schema:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify database schema",
      error: error.message
    });
  }
});

// Get database metrics
router.get("/api/database/metrics", async (req: Request, res: Response) => {
  try {
    const [publicViz, communityCreations, systemUser, schemaCheck] = await Promise.all([
      storage.getPublicVisualizations(),
      storage.getCommunityCreations(),
      storage.getUserByUsername("dimensional_system"),
      verifySchema()
    ]);

    const metrics = {
      totalRecords: publicViz.length + communityCreations.length + (systemUser ? 1 : 0),
      publicVisualizations: publicViz.length,
      communityCreations: communityCreations.length,
      systemUserExists: !!systemUser,
      schemaValid: schemaCheck.valid,
      tablesExist: schemaCheck.tables || [],
      lastUpdated: new Date().toISOString(),
      health: (publicViz.length > 0 && communityCreations.length > 0 && schemaCheck.valid) ? "healthy" : "needs_initialization"
    };

    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error("❌ Error fetching database metrics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch database metrics", 
      error: error.message 
    });
  }
});

// Force database refresh
router.post("/api/database/force-refresh", async (req: Request, res: Response) => {
  try {
    console.log("🔄 Force refreshing database...");
    const result = await setupDefaultSettings();
    
    // Get updated metrics
    const publicViz = await storage.getPublicVisualizations();
    const communityCreations = await storage.getCommunityCreations();
    
    res.json({ 
      success: true, 
      message: "Database force refreshed successfully",
      data: result,
      updatedCounts: {
        publicVisualizations: publicViz.length,
        communityCreations: communityCreations.length
      }
    });
  } catch (error) {
    console.error("❌ Error force refreshing database:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to force refresh database", 
      error: error.message 
    });
  }
});

export default router;
