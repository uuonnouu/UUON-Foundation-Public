
import { Router, Request, Response } from 'express';

const router = Router();

// Public service directory - no auth required
router.get('/catalog', async (req: Request, res: Response) => {
  res.json({
    service: "Δmension SHA-256 Hash Marketplace",
    tagline: "Enterprise-grade cryptographic hashing with energy tracking and monetization",
    offerings: {
      individual: {
        title: "Individual Hash Creation",
        description: "Create custom SHA-256 hashes with energy tracking and marketplace selling",
        features: [
          "Custom salt and iteration control",
          "Energy cost calculation",
          "Hash marketplace for selling",
          "Verification services",
          "Performance analytics"
        ],
        pricing: "Pay per hash based on computational energy used",
        endpoint: "/api/hashing/create"
      },
      enterprise: {
        title: "Enterprise API Access",
        description: "Bulk hash creation and verification for companies",
        features: [
          "Bulk hash processing (up to 1000 hashes)",
          "Enterprise-grade security",
          "Custom iterations (1K-100K)",
          "API key authentication",
          "Dedicated support",
          "SLA guarantees"
        ],
        pricing: "Contact for enterprise pricing",
        endpoint: "/api/company/register"
      },
      marketplace: {
        title: "Hash Marketplace",
        description: "Buy and sell unique cryptographic hashes",
        features: [
          "Browse available hashes",
          "Purchase verification",
          "Energy cost transparency",
          "Complexity scoring",
          "Transaction history"
        ],
        endpoint: "/api/hashing/marketplace"
      }
    },
    integration: {
      gettingStarted: {
        step1: "Register for API access at /api/company/register",
        step2: "Receive API key and secret",
        step3: "Use endpoints with X-API-Key header",
        step4: "Start creating and verifying hashes"
      },
      sampleCode: {
        curl: `curl -X POST https://your-domain.replit.app/api/company/hash/create \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"data": "your-data-to-hash", "iterations": 15000}'`,
        javascript: `const response = await fetch('/api/company/hash/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    data: 'your-data-to-hash',
    iterations: 15000
  })
});`
      }
    },
    useCases: [
      "Document integrity verification",
      "Password hashing for applications",
      "Blockchain and cryptocurrency applications",
      "Digital signatures and certificates",
      "Data deduplication",
      "Forensic evidence tracking"
    ],
    contact: {
      technical: "Connect via the platform for technical integration support",
      business: "Enterprise partnerships and custom solutions available",
      support: "24/7 API support for enterprise customers"
    },
    metrics: {
      totalHashesCreated: "Growing daily",
      averageComputationTime: "Sub-second for standard iterations",
      energyEfficiency: "Optimized for minimal computational cost",
      uptimeGuarantee: "99.9% SLA for enterprise customers"
    }
  });
});

// Company showcase endpoint
router.get('/showcase', async (req: Request, res: Response) => {
  res.json({
    title: "Why Choose Δmension Hashing?",
    advantages: {
      transparency: {
        title: "Energy Cost Transparency",
        description: "See exactly how much computational energy each hash costs",
        benefit: "Fair pricing based on actual resource usage"
      },
      security: {
        title: "Enhanced SHA-256",
        description: "PBKDF2 with custom salts and configurable iterations",
        benefit: "Enterprise-grade security with customizable strength"
      },
      monetization: {
        title: "Hash Marketplace",
        description: "Turn your computational work into tradeable assets",
        benefit: "Recover costs and profit from unique hash creations"
      },
      performance: {
        title: "Optimized Processing",
        description: "High-performance hash generation with real-time metrics",
        benefit: "Fast, reliable service with detailed analytics"
      }
    },
    competitiveAdvantages: [
      "Only platform offering hash energy cost tracking",
      "Marketplace for hash trading and monetization",
      "Mathematical precision with 23-parameter controls",
      "3D visualization of cryptographic concepts",
      "Enterprise API with bulk processing capabilities"
    ],
    testimonials: [
      {
        company: "Early Adopter",
        quote: "The energy tracking feature helps us optimize our hashing costs",
        use_case: "Document verification system"
      }
    ]
  });
});

export { router as serviceDirectory };
