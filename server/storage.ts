import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { 
  users, 
  visualizations, 
  parameterHistory, 
  performanceMetrics, 
  scientific4DResearch,
  type InsertUser, 
  type User,
  type Visualization,
  type ParameterHistory,
  type PerformanceMetrics,
  type Scientific4DResearch,
  type InsertScientific4DResearch
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

// PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL || '';
const sql = DATABASE_URL ? neon(DATABASE_URL) : neon('postgresql://localhost/dummy');
const db = drizzle(sql);

// Export the database connection for use in other modules
export { db };

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mathematical visualizations
  saveVisualization(visualization: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Visualization>;
  getVisualization(id: number): Promise<Visualization | undefined>;
  getUserVisualizations(userId: number): Promise<Visualization[]>;
  getPublicVisualizations(): Promise<Visualization[]>;
  updateVisualization(id: number, updates: Partial<Visualization>): Promise<Visualization | undefined>;
  deleteVisualization(id: number): Promise<boolean>;
  
  // Collaborative sessions
  saveSession(session: Omit<Session, 'id' | 'createdAt' | 'lastModified'>): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  getUserSessions(userId: number): Promise<Session[]>;
  updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined>;
  
  // Parameter history (undo/redo)
  saveParameterHistory(history: Omit<ParameterHistory, 'id' | 'timestamp'>): Promise<ParameterHistory>;
  getParameterHistory(userId: number, sessionId?: string): Promise<ParameterHistory[]>;
  
  // Performance metrics
  savePerformanceMetrics(metrics: Omit<PerformanceMetrics, 'id' | 'timestamp'>): Promise<PerformanceMetrics>;
  getPerformanceMetrics(userId: number): Promise<PerformanceMetrics[]>;
  
  // Community creations
  // Removed community creation methods - feature not in use
  
  // Scientific 4D Research
  saveScientific4DResearch(research: Omit<Scientific4DResearch, 'id' | 'createdAt' | 'lastModified' | 'lastValidated'>): Promise<Scientific4DResearch>;
  getScientific4DResearch(id: number): Promise<Scientific4DResearch | undefined>;
  getUserScientific4DResearch(userId: number): Promise<Scientific4DResearch[]>;
  getPublicScientific4DResearch(): Promise<Scientific4DResearch[]>;
  getScientific4DResearchByType(researchType: string): Promise<Scientific4DResearch[]>;
  updateScientific4DResearch(id: number, updates: Partial<Scientific4DResearch>): Promise<Scientific4DResearch | undefined>;
  deleteScientific4DResearch(id: number): Promise<boolean>;
  validateScientific4DResearch(id: number, validationResults: any): Promise<Scientific4DResearch | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Mathematical visualizations
  async saveVisualization(visualization: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Visualization> {
    const result = await db.insert(visualizations).values(visualization).returning();
    return result[0];
  }

  async getVisualization(id: number): Promise<Visualization | undefined> {
    const result = await db.select().from(visualizations).where(eq(visualizations.id, id));
    return result[0];
  }

  async getUserVisualizations(userId: number): Promise<Visualization[]> {
    return await db.select().from(visualizations).where(eq(visualizations.userId, userId)).orderBy(desc(visualizations.createdAt));
  }

  async getPublicVisualizations(): Promise<Visualization[]> {
    return await db.select().from(visualizations).where(eq(visualizations.isPublic, true)).orderBy(desc(visualizations.viewCount));
  }

  async updateVisualization(id: number, updates: Partial<Visualization>): Promise<Visualization | undefined> {
    const result = await db.update(visualizations).set({ ...updates, updatedAt: new Date() }).where(eq(visualizations.id, id)).returning();
    return result[0];
  }

  async deleteVisualization(id: number): Promise<boolean> {
    const result = await db.delete(visualizations).where(eq(visualizations.id, id));
    return result.rowCount > 0;
  }

  // Collaborative sessions
  async saveSession(session: Omit<Session, 'id' | 'createdAt' | 'lastModified'>): Promise<Session> {
    const result = await db.insert(sessions).values(session).returning();
    return result[0];
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const result = await db.select().from(sessions).where(eq(sessions.sessionId, sessionId));
    return result[0];
  }

  async getUserSessions(userId: number): Promise<Session[]> {
    return await db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.lastModified));
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined> {
    const result = await db.update(sessions).set({ ...updates, lastModified: new Date() }).where(eq(sessions.sessionId, sessionId)).returning();
    return result[0];
  }

  // Parameter history
  async saveParameterHistory(history: Omit<ParameterHistory, 'id' | 'timestamp'>): Promise<ParameterHistory> {
    const result = await db.insert(parameterHistory).values(history).returning();
    return result[0];
  }

  async getParameterHistory(userId: number, sessionId?: string): Promise<ParameterHistory[]> {
    if (sessionId) {
      return await db.select().from(parameterHistory)
        .where(and(eq(parameterHistory.userId, userId), eq(parameterHistory.sessionId, sessionId)))
        .orderBy(desc(parameterHistory.timestamp));
    } else {
      return await db.select().from(parameterHistory)
        .where(eq(parameterHistory.userId, userId))
        .orderBy(desc(parameterHistory.timestamp));
    }
  }

  // Performance metrics
  async savePerformanceMetrics(metrics: Omit<PerformanceMetrics, 'id' | 'timestamp'>): Promise<PerformanceMetrics> {
    const result = await db.insert(performanceMetrics).values(metrics).returning();
    return result[0];
  }

  async getPerformanceMetrics(userId: number): Promise<PerformanceMetrics[]> {
    return await db.select().from(performanceMetrics).where(eq(performanceMetrics.userId, userId)).orderBy(desc(performanceMetrics.timestamp));
  }

  // Removed community creation methods - feature not in use

  

  // Scientific 4D Research methods
  async saveScientific4DResearch(research: Omit<Scientific4DResearch, 'id' | 'createdAt' | 'lastModified' | 'lastValidated'>): Promise<Scientific4DResearch> {
    const result = await db.insert(scientific4DResearch).values(research).returning();
    return result[0];
  }

  async getScientific4DResearch(id: number): Promise<Scientific4DResearch | undefined> {
    const result = await db.select().from(scientific4DResearch).where(eq(scientific4DResearch.id, id));
    return result[0];
  }

  async getUserScientific4DResearch(userId: number): Promise<Scientific4DResearch[]> {
    return await db.select().from(scientific4DResearch)
      .where(eq(scientific4DResearch.userId, userId))
      .orderBy(desc(scientific4DResearch.lastModified));
  }

  async getPublicScientific4DResearch(): Promise<Scientific4DResearch[]> {
    return await db.select().from(scientific4DResearch)
      .where(eq(scientific4DResearch.isPublicResearch, true))
      .orderBy(desc(scientific4DResearch.confidenceScore));
  }

  async getScientific4DResearchByType(researchType: string): Promise<Scientific4DResearch[]> {
    return await db.select().from(scientific4DResearch)
      .where(eq(scientific4DResearch.researchType, researchType))
      .orderBy(desc(scientific4DResearch.confidenceScore));
  }

  async updateScientific4DResearch(id: number, updates: Partial<Scientific4DResearch>): Promise<Scientific4DResearch | undefined> {
    const result = await db.update(scientific4DResearch)
      .set({ ...updates, lastModified: new Date() })
      .where(eq(scientific4DResearch.id, id))
      .returning();
    return result[0];
  }

  async deleteScientific4DResearch(id: number): Promise<boolean> {
    const result = await db.delete(scientific4DResearch).where(eq(scientific4DResearch.id, id)).returning();
    return result.length > 0;
  }

  async validateScientific4DResearch(id: number, validationResults: any): Promise<Scientific4DResearch | undefined> {
    const result = await db.update(scientific4DResearch)
      .set({ 
        verificationResults: validationResults,
        lastValidated: new Date()
      })
      .where(eq(scientific4DResearch.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
