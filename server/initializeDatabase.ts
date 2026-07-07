
import { setupDefaultSettings } from "./setupDefaults";
import { storage } from "./storage";
import { migrateDatabase, verifySchema } from "./migrateSchema";

export async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database with schema migration...");
    
    // First, ensure database schema is created
    await migrateDatabase();
    
    // Verify schema integrity
    const schemaCheck = await verifySchema();
    if (!schemaCheck.valid) {
      throw new Error(`Schema verification failed: ${schemaCheck.error || 'Missing tables'}`);
    }
    
    console.log("✅ Database schema verified successfully");
    
    // Check if system user already exists
    const systemUser = await storage.getUserByUsername("dimensional_system");
    
    if (!systemUser) {
      console.log("📦 Setting up fresh database with defaults...");
      const result = await setupDefaultSettings();
      console.log("✅ Database initialization completed:", result);
      return result;
    } else {
      console.log("✅ System user exists, checking data completeness...");
      
      // Check if we have sufficient default data
      const publicViz = await storage.getPublicVisualizations();
      
      if (publicViz.length === 0) {
        console.log("⚠️ Missing default data, refreshing defaults...");
        const result = await setupDefaultSettings();
        return result;
      }
      
      return { 
        success: true, 
        message: "Database already initialized",
        stats: {
          publicVisualizations: publicViz.length
        }
      };
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    console.error("Error details:", error.message);
    throw error;
  }
}

export async function ensureDefaultsExist() {
  try {
    // Check for essential defaults
    const publicVisualizations = await storage.getPublicVisualizations();
    
    if (publicVisualizations.length === 0) {
      console.log("🔄 No public visualizations found, setting up defaults...");
      await setupDefaultSettings();
    }
    
    return true;
  } catch (error) {
    console.error("❌ Error ensuring defaults exist:", error);
    return false;
  }
}
