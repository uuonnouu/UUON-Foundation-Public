
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

interface SecurityRequest extends Request {
  securityMetrics?: {
    requestId: string;
    timestamp: number;
    risk: number;
  };
}

// Mathematical computation integrity checker
export const validateMathOperations = (req: SecurityRequest, res: Response, next: NextFunction) => {
  if (req.body && req.body.parameters) {
    const params = req.body.parameters;
    
    // Check for parameter injection attacks
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string' && 
          (value.includes('eval') || value.includes('Function') || value.includes('setTimeout'))) {
        return res.status(400).json({ error: 'Invalid parameter format' });
      }
      
      // Validate mathematical bounds
      if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
        return res.status(400).json({ error: 'Invalid mathematical value' });
      }
    }
  }
  next();
};

// Advanced request fingerprinting
export const fingerprintRequest = (req: SecurityRequest, res: Response, next: NextFunction) => {
  const fingerprint = crypto.createHash('sha256')
    .update(req.headers['user-agent'] || '')
    .update(req.headers['accept-language'] || '')
    .update(req.ip || '')
    .digest('hex');
  
  req.securityMetrics = {
    requestId: crypto.randomUUID(),
    timestamp: Date.now(),
    risk: calculateRiskScore(req)
  };
  
  res.setHeader('X-Request-ID', req.securityMetrics.requestId);
  next();
};

// Risk scoring algorithm
function calculateRiskScore(req: Request): number {
  let risk = 0;
  
  // Check for automation indicators
  const userAgent = req.headers['user-agent'] || '';
  if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.length < 10) {
    risk += 30;
  }
  
  // Check for rapid requests
  if (!req.headers['referer']) risk += 20;
  if (!req.headers['accept-language']) risk += 15;
  
  // Check request size
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 1000000) risk += 25; // 1MB
  
  return Math.min(risk, 100);
}

// WebGL computation protection
export const protectWebGLOperations = (req: SecurityRequest, res: Response, next: NextFunction) => {
  if (req.body && req.body.surfaceType) {
    const computationComplexity = estimateComplexity(req.body);
    
    if (computationComplexity > 10000) {
      return res.status(429).json({ 
        error: 'Computation too complex',
        maxComplexity: 10000,
        requested: computationComplexity
      });
    }
  }
  next();
};

function estimateComplexity(params: any): number {
  const segments = (params.uSegments || 50) * (params.vSegments || 50);
  const parameterCount = Object.keys(params.parameters || {}).length;
  return segments * parameterCount;
}

// Anti-reverse engineering protection
export const obfuscateResponse = (req: SecurityRequest, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    if (process.env.NODE_ENV === 'production' && data) {
      // Add decoy fields to mathematical responses
      if (data.vertices || data.triangles) {
        data._checksum = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
        data._timestamp = Date.now();
        data._nonce = crypto.randomBytes(8).toString('hex');
      }
    }
    return originalJson.call(this, data);
  };
  
  next();
};

// Memory protection for intensive calculations
export const memoryGuard = (req: SecurityRequest, res: Response, next: NextFunction) => {
  const memUsage = process.memoryUsage();
  const maxHeapSize = 512 * 1024 * 1024; // 512MB limit
  
  if (memUsage.heapUsed > maxHeapSize) {
    return res.status(503).json({ 
      error: 'Server overloaded',
      retry: 'Try again in 30 seconds'
    });
  }
  
  next();
};
