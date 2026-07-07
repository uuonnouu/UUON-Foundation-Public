// ============================================================
// MOS Index: Persistent Lattice Engine Integration
// Lattice reduction runs continuously, never stops
// ============================================================

import express, { Express } from "express";
import { registerRoutes } from "./routes";
import PersistentLatticeEngine from "./persistent-lattice-engine";
import { MIGRATION_INIT } from "./lattice-schema";

const app: Express = express();
const PORT = process.env.PORT || 1618;

// Persistent engine instance (singleton)
let latticeEngine: PersistentLatticeEngine | null = null;

/**
 * Initialize persistent lattice engine
 * MUST succeed or keep retrying
 */
async function initializeLatticeEngine() {
  try {
    const postgres = require("postgres");
    const redis = require("redis");

    // Connect to Neon PostgreSQL
    const sql = postgres(process.env.DATABASE_URL);

    // Connect to Redis
    const redisClient = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    await redisClient.connect();

    // Run migrations
    console.log("[MOS] Running lattice schema migrations...");
    try {
      await sql.unsafe(MIGRATION_INIT);
      console.log("[MOS] ✓ Schema migrations complete");
    } catch (error) {
      console.warn("[MOS] Schema migration partial (may already exist):", error);
    }

    // Initialize engine
    const backupPath = "/app/data/clouud-backup.json";
    latticeEngine = new PersistentLatticeEngine(
      sql,
      redisClient,
      backupPath
    );

    // Start engine
    await latticeEngine.start();

    // Monitor health
    latticeEngine.on("heartbeat", (health) => {
      console.log(`[Lattice] Health: ${health.stateCount} states, uptime OK`);
    });

    latticeEngine.on("checkpoint-error", (error) => {
      console.error("[Lattice] Checkpoint error (recovering):", error);
    });

    return latticeEngine;
  } catch (error) {
    console.error("[MOS] Lattice engine initialization failed:", error);
    throw error;
  }
}

/**
 * Start MOS with persistent lattice engine
 */
async function startMOS() {
  try {
    console.log("[MOS] STARTING WITH PERSISTENT LATTICE REDUCTION");

    // Initialize lattice engine FIRST
    await initializeLatticeEngine();
    console.log("[MOS] ✓ Lattice engine operational");

    // Middleware
    app.use(express.json());
    app.use(express.static("dist/public"));

    // Register all routes
    const server = await registerRoutes(app);

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`[MOS] ✓ HTTP server listening on port ${PORT}`);
      console.log("[MOS] ✓ MOS FULLY OPERATIONAL WITH PERSISTENT LATTICE REDUCTION");
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("[MOS] SIGTERM received, graceful shutdown...");
      if (latticeEngine) {
        await latticeEngine.shutdown();
      }
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("[MOS] SIGINT received, graceful shutdown...");
      if (latticeEngine) {
        await latticeEngine.shutdown();
      }
      process.exit(0);
    });
  } catch (error) {
    console.error("[MOS] Fatal startup error:", error);
    process.exit(1);
  }
}

// Start MOS
startMOS().catch((error) => {
  console.error("[MOS] Startup failed:", error);
  process.exit(1);
});

export { latticeEngine };
