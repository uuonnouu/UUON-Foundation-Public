
import { Router, Request, Response } from 'express';
import { hashingService } from './hashingService';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { storage } from './storage';

const router = Router();

// Company registration for API access
router.post('/register',
  body('companyName').isString().isLength({ min: 1, max: 200 }),
  body('email').isEmail(),
  body('website').optional().isURL(),
  body('description').optional().isString().isLength({ max: 1000 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { companyName, email, website, description } = req.body;
      
      // Generate API key for company
      const apiKey = `dmn_${crypto.randomBytes(32).toString('hex')}`;
      const apiSecret = crypto.randomBytes(64).toString('hex');
      
      // Store company info (you'll need to add this table to storage)
      const company = {
        name: companyName,
        email,
        website,
        description,
        apiKey,
        apiSecret: crypto.createHash('sha256').update(apiSecret).digest('hex'),
        isActive: true,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        companyId: apiKey,
        apiKey,
        apiSecret, // Only returned once
        message: 'Company registered successfully. Store your API credentials securely.',
        endpoints: {
          createHash: '/api/company/hash/create',
          verifyHash: '/api/company/hash/verify',
          bulkHash: '/api/company/hash/bulk',
          analytics: '/api/company/analytics'
        }
      });
    } catch (error) {
      console.error('Company registration error:', error);
      res.status(500).json({ error: 'Failed to register company' });
    }
  }
);

// Middleware to authenticate company API requests
const authenticateCompany = async (req: Request, res: Response, next: any) => {
  const apiKey = req.headers['x-api-key'] as string;
  const signature = req.headers['x-api-signature'] as string;
  
  if (!apiKey || !signature) {
    return res.status(401).json({ error: 'Missing API credentials' });
  }

  // Verify API key and signature (implement proper verification)
  req.company = { apiKey }; // Add company info to request
  next();
};

// Company hash creation endpoint
router.post('/hash/create',
  authenticateCompany,
  body('data').isString().isLength({ min: 1, max: 50000 }),
  body('iterations').optional().isInt({ min: 1000, max: 100000 }),
  body('metadata').optional().isObject(),
  async (req: Request, res: Response) => {
    try {
      const { data, iterations = 10000, metadata } = req.body;
      
      // Create hash with company metadata
      const result = await hashingService.createCustomHash(
        data,
        0, // Company user ID (you might want a separate company user system)
        undefined,
        iterations,
        { 
          ...metadata, 
          companyApi: true,
          apiKey: req.company.apiKey,
          forSale: false 
        }
      );

      res.json({
        success: true,
        hashId: result.hashId,
        hash: result.hash,
        computationTime: result.computationTime,
        energyCost: result.energyCost,
        costUSD: (result.energyCost * 0.001).toFixed(6), // Pricing model
        metadata: {
          algorithm: 'SHA-256',
          iterations,
          securityLevel: 'Enterprise'
        }
      });
    } catch (error) {
      console.error('Company hash creation error:', error);
      res.status(500).json({ error: 'Failed to create hash' });
    }
  }
);

// Bulk hash creation for companies
router.post('/hash/bulk',
  authenticateCompany,
  body('dataArray').isArray().isLength({ min: 1, max: 1000 }),
  body('iterations').optional().isInt({ min: 1000, max: 100000 }),
  async (req: Request, res: Response) => {
    try {
      const { dataArray, iterations = 10000 } = req.body;
      const results = [];
      
      for (const data of dataArray) {
        const result = await hashingService.createCustomHash(
          data,
          0,
          undefined,
          iterations,
          { 
            companyApi: true,
            apiKey: req.company.apiKey,
            forSale: false,
            bulkOperation: true
          }
        );
        results.push({
          originalData: data,
          hashId: result.hashId,
          hash: result.hash,
          computationTime: result.computationTime,
          energyCost: result.energyCost
        });
      }

      const totalEnergyCost = results.reduce((sum, r) => sum + r.energyCost, 0);
      
      res.json({
        success: true,
        totalHashes: results.length,
        results,
        totalEnergyCost,
        totalCostUSD: (totalEnergyCost * 0.001).toFixed(6),
        averageComputationTime: results.reduce((sum, r) => sum + r.computationTime, 0) / results.length
      });
    } catch (error) {
      console.error('Bulk hash creation error:', error);
      res.status(500).json({ error: 'Failed to create bulk hashes' });
    }
  }
);

// Company hash verification
router.post('/hash/verify',
  authenticateCompany,
  body('data').isString(),
  body('hashId').isUUID(),
  body('expectedHash').isString(),
  async (req: Request, res: Response) => {
    try {
      const { data, hashId, expectedHash } = req.body;
      const result = await hashingService.verifyHash(data, hashId, expectedHash);
      
      res.json({
        success: true,
        valid: result.valid,
        hashId,
        verificationTime: Date.now(),
        metadata: result.metadata
      });
    } catch (error) {
      console.error('Company hash verification error:', error);
      res.status(500).json({ error: 'Failed to verify hash' });
    }
  }
);

// Company analytics endpoint
router.get('/analytics',
  authenticateCompany,
  async (req: Request, res: Response) => {
    try {
      // Get company-specific analytics
      res.json({
        success: true,
        apiKey: req.company.apiKey,
        analytics: {
          totalHashes: 0, // Implement company-specific counting
          totalEnergyCost: 0,
          averageComputationTime: 0,
          lastUsed: new Date().toISOString(),
          securityLevel: 'Enterprise'
        }
      });
    } catch (error) {
      console.error('Company analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
);

export { router as companyRoutes };
