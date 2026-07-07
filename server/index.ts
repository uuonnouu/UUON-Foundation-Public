import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import crypto from "crypto";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Database initialization enabled
import { initializeDatabase } from "./initializeDatabase";

const app = express();

// Trust proxy for Replit environment
app.set('trust proxy', true);

// Generate security nonce for each request
app.use((req: any, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Minimal security headers for development
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false,
  hsts: false // Disable HSTS for development
}));

// Security headers - Allow framing for Replit preview
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
  next();
});

// Disable rate limiting for development
if (process.env.NODE_ENV === 'production') {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { error: "API rate limit exceeded" },
    standardHeaders: false,
    legacyHeaders: false
  });
  app.use('/api/', apiLimiter);
}

// Simple request logging for development
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// CORS configuration with strict origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins in development, specific origins in production
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [process.env.ALLOWED_ORIGIN, process.env.REPLIT_DEV_DOMAIN].filter(Boolean)
      : true; // Allow all origins in development

    if (process.env.NODE_ENV !== 'production' || !origin || (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
}));

// Enhanced JSON parsing with validation
app.use(express.json({ 
  limit: '5mb', // Reduced from 10mb
  verify: (req: any, res, buf) => {
    try {
      const raw = buf.toString();
      // Check for potential JSON attacks
      if (raw.includes('__proto__') || raw.includes('constructor') || raw.includes('prototype')) {
        throw new Error('Malicious payload detected');
      }
      req.rawBody = raw;
    } catch (err) {
      throw new Error('Invalid JSON payload');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: false, 
  limit: '2mb',
  parameterLimit: 100 // Limit URL parameters
}));

import { 
  validateMathOperations, 
  fingerprintRequest, 
  protectWebGLOperations, 
  obfuscateResponse, 
  memoryGuard 
} from './security';

// Apply advanced security middleware
app.use(fingerprintRequest);
app.use(memoryGuard);
app.use('/api/math', validateMathOperations);
app.use('/api/compute', protectWebGLOperations);
app.use(obfuscateResponse);

// Enhanced request logging with security metrics
app.use((req: any, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const riskScore = req.securityMetrics?.risk || 0;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} ${duration}ms`;

      if (riskScore > 50) {
        logLine += ` [HIGH-RISK:${riskScore}]`;
      }

      if (req.securityMetrics?.requestId) {
        logLine += ` ID:${req.securityMetrics.requestId.slice(0, 8)}`;
      }

      if (capturedJsonResponse && !path.includes('/secure/')) {
        const responseStr = JSON.stringify(capturedJsonResponse);
        if (responseStr.length > 100) {
          logLine += ` :: ${responseStr.slice(0, 97)}...`;
        } else {
          logLine += ` :: ${responseStr}`;
        }
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Initialize database on startup
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("⚠️ Database initialization error (continuing in memory mode):", error.message);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // UUON MOS — port 1618 (golden ratio φ = 1.618)
  // Aligns with the Fibonacci structure of the Mathematical Operating System
  const port = parseInt(process.env.PORT || '1618');
  server.listen({
    port,
    host: "0.0.0.0",
  }, async () => {
    console.log(`serving on port ${port}`);
    
    // Database initialization disabled per user request
    console.log("📊 Database: Disabled - Running in memory-only mode");
  });
})();