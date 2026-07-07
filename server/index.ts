import express from "express";
import cors from "cors";
import { CREDIT_PACKAGES, CREDIT_COSTS } from "./credit-system";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Credit system endpoints
app.get("/api/credits/packages", (req, res) => {
  res.json({
    packages: CREDIT_PACKAGES,
    costs: CREDIT_COSTS,
    description: "Buy credits with PIEZ tokens to unlock API features"
  });
});

app.get("/api/credits/balance", (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(401).json({ error: "Missing x-user-id header" });
  }
  
  res.json({
    userId,
    balance: 100, // Demo: free tier gets 100 credits
    tier: "free",
    message: "Use /api/credits/buy to purchase credits"
  });
});

app.post("/api/credits/buy", (req, res) => {
  const { packageName, txHash, chain } = req.body;
  const userId = req.headers["x-user-id"] as string;
  
  if (!userId || !packageName || !txHash || !chain) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const pkg = CREDIT_PACKAGES[packageName as keyof typeof CREDIT_PACKAGES];
  if (!pkg) {
    return res.status(404).json({ error: "Package not found" });
  }
  
  res.json({
    status: "success",
    transaction: {
      transactionId: `txn_${Date.now()}`,
      amount: pkg.credits,
      piez_paid: pkg.piez_cost,
      txHash,
      chain,
      timestamp: Date.now(),
      status: "confirmed"
    },
    message: `Successfully purchased ${packageName} package with ${pkg.credits} credits`
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
const PORT = parseInt(process.env.PORT || "5001");
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ UUON Credit System running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/credits/packages`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
