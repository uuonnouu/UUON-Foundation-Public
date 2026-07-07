
import { Router, Request, Response } from 'express';
import { hashingService } from './hashingService';
import { authenticateToken, AuthenticatedRequest } from './auth';
import { body, validationResult } from 'express-validator';

const router = Router();

// Create custom hash
router.post('/create',
  authenticateToken,
  body('data').isString().isLength({ min: 1, max: 10000 }),
  body('iterations').optional().isInt({ min: 1000, max: 100000 }),
  body('forSale').optional().isBoolean(),
  body('storeOriginal').optional().isBoolean(),
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { data, iterations, customSalt, forSale, storeOriginal } = req.body;
      const userId = req.user!.id;

      const result = await hashingService.createCustomHash(
        data,
        userId,
        customSalt,
        iterations,
        { forSale, storeOriginal }
      );

      res.json({
        success: true,
        hashId: result.hashId,
        hash: result.hash,
        computationTime: result.computationTime,
        energyCost: result.energyCost,
        estimatedValue: `$${(result.energyCost * 1000).toFixed(4)}`
      });
    } catch (error) {
      console.error('Hash creation error:', error);
      res.status(500).json({ error: 'Failed to create hash' });
    }
  }
);

// Verify hash
router.post('/verify',
  body('data').isString(),
  body('hashId').isUUID(),
  body('hash').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { data, hashId, hash } = req.body;
      const result = await hashingService.verifyHash(data, hashId, hash);
      
      res.json(result);
    } catch (error) {
      console.error('Hash verification error:', error);
      res.status(500).json({ error: 'Failed to verify hash' });
    }
  }
);

// Get user's hashes
router.get('/my-hashes', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const hashes = await hashingService.getUserHashProducts(userId);
    
    res.json(hashes);
  } catch (error) {
    console.error('Error fetching user hashes:', error);
    res.status(500).json({ error: 'Failed to fetch hashes' });
  }
});

// Get marketplace hashes
router.get('/marketplace', async (req: Request, res: Response) => {
  try {
    const hashes = await hashingService.getMarketplaceHashes();
    res.json(hashes);
  } catch (error) {
    console.error('Error fetching marketplace hashes:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace' });
  }
});

// Purchase hash
router.post('/purchase/:hashProductId',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const hashProductId = parseInt(req.params.hashProductId);
      const buyerId = req.user!.id;

      const result = await hashingService.purchaseHash(buyerId, hashProductId);
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Hash purchased successfully',
          transaction: result.transaction,
          hash: result.hash
        });
      } else {
        res.status(400).json({ error: 'Hash not available for purchase' });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      res.status(500).json({ error: 'Failed to purchase hash' });
    }
  }
);

// Get hash analytics
router.get('/analytics', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const analytics = await hashingService.getHashAnalytics(userId);
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Set hash for sale
router.put('/set-for-sale/:hashId',
  authenticateToken,
  body('price').isInt({ min: 1 }),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { hashId } = req.params;
      const { price } = req.body;
      const userId = req.user!.id;

      // Implementation for setting hash for sale
      res.json({ success: true, message: 'Hash listed for sale' });
    } catch (error) {
      console.error('Set for sale error:', error);
      res.status(500).json({ error: 'Failed to list hash for sale' });
    }
  }
);

export { router as hashingRoutes };
