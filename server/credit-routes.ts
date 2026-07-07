// ============================================================
// Credit System API Routes - Monetization Layer
// ============================================================

import type { Express, Request, Response } from "express";
import CreditSystemManager, { CREDIT_PACKAGES, CREDIT_COSTS } from "./credit-system";

export function registerCreditRoutes(
  app: Express,
  creditManager: CreditSystemManager
) {
  /**
   * PUBLIC: View available packages
   */
  app.get("/api/credits/packages", (req: Request, res: Response) => {
    res.json({
      packages: CREDIT_PACKAGES,
      costs: CREDIT_COSTS,
      description: "Buy credits with PIEZ tokens to unlock API features",
    });
  });

  /**
   * AUTH: Get user's credit balance
   */
  app.get("/api/credits/balance", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Missing x-user-id header" });

    const account = await creditManager.getAccount(userId);
    res.json({
      userId,
      balance: account?.creditsBalance || 0,
      tier: account?.tier || "free",
      lastRefill: account?.lastRefill,
    });
  });

  /**
   * AUTH: Initialize credit account (first-time signup)
   */
  app.post("/api/credits/init", async (req: Request, res: Response) => {
    const { userId, walletAddress } = req.body;
    if (!userId || !walletAddress) {
      return res.status(400).json({ error: "Missing userId or walletAddress" });
    }

    const account = await creditManager.createCreditAccount(userId, walletAddress);
    res.json({
      status: "account_created",
      creditsBalance: account.creditsBalance,
      message: "Welcome! You received 100 free credits.",
    });
  });

  /**
   * AUTH: Buy credits (user sends PIEZ, receives credits)
   */
  app.post("/api/credits/buy", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    const { packageName, txHash, chain } = req.body;

    if (!userId || !packageName || !txHash || !chain) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pkg = CREDIT_PACKAGES[packageName];
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    try {
      const transaction = await creditManager.buyCredits(
        userId,
        packageName,
        txHash,
        chain
      );

      res.json({
        status: "purchase_confirmed",
        transaction,
        creditsReceived: pkg.credits,
        message: `You purchased ${packageName} and received ${pkg.credits} credits!`,
      });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Consume credits for an operation
   */
  app.post("/api/credits/consume", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    const { costType, quantity = 1 } = req.body;

    if (!userId || !costType) {
      return res.status(400).json({ error: "Missing userId or costType" });
    }

    try {
      const result = await creditManager.consumeCredits(
        userId,
        costType as any,
        quantity
      );

      if (!result.success) {
        return res.status(402).json({
          error: "insufficient_credits",
          creditsRequired: CREDIT_COSTS[costType as keyof typeof CREDIT_COSTS] * quantity,
          creditsAvailable: result.creditsRemaining,
        });
      }

      res.json({
        status: "credits_consumed",
        creditsUsed: CREDIT_COSTS[costType as keyof typeof CREDIT_COSTS] * quantity,
        creditsRemaining: result.creditsRemaining,
      });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Reset API rate limit (costs credits)
   */
  app.post("/api/credits/reset-limit", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Missing x-user-id header" });
    }

    try {
      await creditManager.resetApiLimit(userId);
      res.json({
        status: "limit_reset",
        message: "Your API rate limit has been reset!",
        cost: CREDIT_COSTS.api_rate_limit_reset,
      });
    } catch (error) {
      res.status(402).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Transfer credits to another user
   */
  app.post("/api/credits/transfer", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    const { toUserId, credits } = req.body;

    if (!userId || !toUserId || !credits) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await creditManager.transferCredits(userId, toUserId, credits);
      res.json({
        status: "transfer_complete",
        creditsTransferred: credits,
        recipient: toUserId,
      });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Refund unused credits (monthly)
   */
  app.post("/api/credits/refund-unused", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Missing x-user-id header" });
    }

    try {
      const piez_refunded = await creditManager.refundUnusedCredits(userId);
      res.json({
        status: "refund_processed",
        piez_refunded,
        message: "Unused credits refunded to your wallet!",
      });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Link account across platforms
   */
  app.post("/api/credits/link-account", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    const { linkedUserId, platform } = req.body;

    if (!userId || !linkedUserId || !platform) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await creditManager.linkAccount(userId, linkedUserId, platform);
      res.json({
        status: "account_linked",
        platform,
        linkedUserId,
      });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Create shared credit pool (team/friends)
   */
  app.post("/api/credits/create-pool", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    const { poolName, poolCredits } = req.body;

    if (!userId || !poolName || !poolCredits) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const poolId = await creditManager.createCreditPool(
        userId,
        poolName,
        poolCredits
      );

      res.json({
        status: "pool_created",
        poolId,
        poolName,
        poolCredits,
        message: "Share this pool ID with your team!",
      });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * AUTH: Get usage statistics
   */
  app.get("/api/credits/usage-stats", async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Missing x-user-id header" });
    }

    // This would query credit_usage table for detailed stats
    res.json({
      userId,
      message: "Usage stats endpoint - query database for historical data",
      availableMetrics: [
        "total_credits_purchased",
        "total_credits_used",
        "average_daily_usage",
        "cost_by_operation_type",
      ],
    });
  });
}

export default registerCreditRoutes;
