import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Credit packages (hardcoded)
app.get("/api/credits/packages", (req, res) => {
  res.json({
    packages: {
      starter: {
        name: "Starter Pack",
        credits: 1000,
        piez_cost: 10,
        monthly_refund_percent: 50,
        tier: "pro",
        features: ["1M API calls/month", "10GB bandwidth", "Shape queries"]
      },
      pro: {
        name: "Pro Pack",
        credits: 10000,
        piez_cost: 75,
        monthly_refund_percent: 25,
        tier: "pro",
        features: ["10M API calls/month", "100GB bandwidth", "Unlimited queries"]
      },
      enterprise: {
        name: "Enterprise Pack",
        credits: 100000,
        piez_cost: 500,
        monthly_refund_percent: 10,
        tier: "enterprise",
        features: ["100M API calls/month", "1TB bandwidth", "White-label"]
      }
    }
  });
});

// Start server
const PORT = parseInt(process.env.PORT || "5001");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
