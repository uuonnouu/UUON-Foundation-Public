
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { 
  users, 
  visualizations, 
  sessions, 
  parameterHistory, 
  performanceMetrics, 
  communityCreations 
} from '../shared/schema';

// Database connection for migrations
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mathviz';
const sql = postgres(connectionString);
const db = drizzle(sql);

export async function migrateDatabase() {
  try {
    console.log("🔄 Starting database schema migration...");
    
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS visualizations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        surface_type TEXT NOT NULL,
        parameters JSON NOT NULL,
        visual_mode TEXT NOT NULL DEFAULT 'surface',
        color_mode TEXT NOT NULL DEFAULT 'plasma',
        is_public BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        parameters JSON NOT NULL,
        shared_with JSON DEFAULT '[]',
        is_public BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        last_modified TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS parameter_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_id TEXT,
        parameters JSON NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        surface_type TEXT NOT NULL,
        triangle_count INTEGER,
        fps REAL,
        render_time REAL,
        memory_usage REAL,
        device_info JSON,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS community_creations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        author TEXT NOT NULL,
        parameters JSON NOT NULL,
        thumbnail TEXT,
        tags JSON DEFAULT '[]',
        likes INTEGER DEFAULT 0,
        downloads INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    console.log("✅ Database schema migration completed successfully!");
    
    // Verify tables exist
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
    
    console.log("📋 Tables created:", tableCheck.map(t => t.table_name));
    
    return {
      success: true,
      tablesCreated: tableCheck.map(t => t.table_name)
    };
    
  } catch (error) {
    console.error("❌ Database schema migration failed:", error);
    throw error;
  }
}

export async function verifySchema() {
  try {
    // Check if all required tables exist
    const requiredTables = [
      'users', 
      'visualizations', 
      'sessions', 
      'parameter_history', 
      'performance_metrics', 
      'community_creations'
    ];
    
    const existingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
    
    const tableNames = existingTables.map(t => t.table_name);
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log("⚠️ Missing tables:", missingTables);
      return { valid: false, missingTables };
    }
    
    console.log("✅ All required tables exist");
    return { valid: true, tables: tableNames };
    
  } catch (error) {
    console.error("❌ Schema verification failed:", error);
    return { valid: false, error: error.message };
  }
}
