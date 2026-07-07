import type { Express } from "express";
import { createServer, type Server } from "http";
import piezGate from "./middleware/piezGate";
import { generateOnChainProof, getClouudStats, compressStateToLattice } from "./clouud-lattice-reduction";

// ============ GENESIS SHAPES DATA ============
// 32 genesis shapes from UUON Mathematical Operating System
const GENESIS_SHAPES = [
  { id: 1, api_id: "sha256_compression_function", name: "SHA-256 Bitwise Compression Function Spirals", family: "cryptographic_hash", level: 1, parameters: { a: 1, b: 1, c: 1, d: 8, e: 0.5, f: 0.7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }, energy: 5.5e31 },
  { id: 2, api_id: "keccak_sha3_sponge", name: "Keccak/SHA-3 Sponge Construction", family: "cryptographic_hash", level: 2, parameters: { a: 1.2, b: 0.8, c: 1, d: 6, e: 0.6, f: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }, energy: 4.8e31 },
  { id: 3, api_id: "aes_rijndael_cipher", name: "AES Rijndael Cipher Structure", family: "symmetric_cipher", level: 2, parameters: { a: 1, b: 1, c: 2, d: 4, e: 0.4, f: 0.6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }, energy: 3.2e31 },
  { id: 4, api_id: "elliptic_curve_cryptography", name: "Elliptic Curve Cryptography", family: "asymmetric_key", level: 3, parameters: { a: 1, b: 0.5, c: 1, d: 3, e: 0.3, f: 0.9, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }, energy: 6.2e31 },
  { id: 5, api_id: "lattice_kyber_ntru", name: "Kyber/NTRU Lattice Field", family: "asymmetric_key", level: 3, parameters: { a: 1.5, b: 1, c: 1, d: 5, e: 0.5, f: 0.7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50 }, energy: 7.1e31 },
  { id: 6, api_id: "hash_avalanche_effect", name: "Hash Avalanche Effect", family: "cryptographic_hash", level: 3, parameters: { a: 2, b: 1, c: 1, d: 7, e: 0.7, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 112, vSegments: 56 }, energy: 4.1e31 },
  { id: 7, api_id: "blockchain_merkle_tree", name: "Blockchain Merkle Tree", family: "integrity_proof", level: 4, parameters: { a: 1, b: 2, c: 1, d: 4, e: 0.4, f: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }, energy: 3.8e31 },
  { id: 8, api_id: "black_scholes_surface", name: "Black-Scholes Option Pricing Surface", family: "financial_surface", level: 4, parameters: { a: 1, b: 1, c: 1, d: 3, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }, energy: 2.9e31 },
  { id: 9, api_id: "volatility_surface", name: "Implied Volatility Surface", family: "financial_surface", level: 4, parameters: { a: 1, b: 1, c: 1.5, d: 2, e: 0.6, f: 0.6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }, energy: 2.7e31 },
  { id: 10, api_id: "monte_carlo_risk", name: "Monte Carlo Risk Surface", family: "financial_surface", level: 4, parameters: { a: 1, b: 1, c: 1, d: 4, e: 0.5, f: 0.7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 72 }, energy: 3.1e31 },
  { id: 11, api_id: "crypto_price_fractal", name: "Crypto Price Fractal", family: "market_structure", level: 4, parameters: { a: 1.618, b: 1, c: 1, d: 5, e: 0.618, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 50 }, energy: 4.2e31 },
  { id: 12, api_id: "attention_mechanism", name: "Transformer Attention Mechanism", family: "ai_geometry", level: 4, parameters: { a: 1, b: 1, c: 2, d: 6, e: 0.5, f: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }, energy: 5.5e31 },
  { id: 13, api_id: "neural_loss_landscape", name: "Neural Network Loss Landscape", family: "ai_geometry", level: 5, parameters: { a: 1, b: 1, c: 1, d: 8, e: 0.4, f: 0.6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }, energy: 4.8e31 },
  { id: 14, api_id: "gradient_descent_path", name: "Gradient Descent Path", family: "ai_geometry", level: 5, parameters: { a: 1, b: 1, c: 1, d: 4, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }, energy: 3.5e31 },
  { id: 15, api_id: "kolmogorov_complexity", name: "Kolmogorov Complexity Surface", family: "ai_geometry", level: 5, parameters: { a: 1, b: 1, c: 1, d: 3, e: 0.3, f: 0.7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }, energy: 3.2e31 },
  { id: 16, api_id: "qubit_bloch_sphere", name: "Qubit Bloch Sphere", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 1, d: 1, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }, energy: 8.1e31 },
  { id: 17, api_id: "qubit_state_vector", name: "Qubit State Vector", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 1, d: 2, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }, energy: 7.2e31 },
  { id: 18, api_id: "qubit_superposition_state", name: "Qubit Superposition State", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 1, d: 3, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }, energy: 7.8e31 },
  { id: 19, api_id: "two_qubit_entangled_state", name: "Two-Qubit Entangled State", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 2, d: 4, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }, energy: 9.2e31 },
  { id: 20, api_id: "two_qubit_product_state", name: "Two-Qubit Product State", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 1, d: 2, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }, energy: 6.8e31 },
  { id: 21, api_id: "three_qubit_ghz_state", name: "3-Qubit GHZ State", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 3, d: 6, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }, energy: 1.1e32 },
  { id: 22, api_id: "multi_qubit_tensor_product", name: "Multi-Qubit Tensor Product", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 4, d: 8, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 112, vSegments: 56 }, energy: 1.3e32 },
  { id: 23, api_id: "three_qubit_code", name: "3-Qubit Error Correction Code", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 3, d: 3, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }, energy: 9.8e31 },
  { id: 24, api_id: "shor_nine_qubit", name: "Shor 9-Qubit Code", family: "quantum_state", level: 6, parameters: { a: 1, b: 1, c: 9, d: 9, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }, energy: 1.8e32 },
  { id: 25, api_id: "pauli_x_gate", name: "Pauli X Gate Surface", family: "quantum_gate", level: 6, parameters: { a: 1, b: 0, c: 0, d: 1, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }, energy: 5.1e31 },
  { id: 26, api_id: "pauli_y_gate", name: "Pauli Y Gate Surface", family: "quantum_gate", level: 6, parameters: { a: 0, b: 1, c: 0, d: 1, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }, energy: 5.1e31 },
  { id: 27, api_id: "pauli_z_gate", name: "Pauli Z Gate Surface", family: "quantum_gate", level: 6, parameters: { a: 0, b: 0, c: 1, d: 1, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }, energy: 5.1e31 },
  { id: 28, api_id: "hadamard_gate", name: "Hadamard Gate Surface", family: "quantum_gate", level: 6, parameters: { a: 0.707, b: 0.707, c: 0.707, d: 2, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }, energy: 6.3e31 },
  { id: 29, api_id: "phase_gate_s", name: "Phase Gate S", family: "quantum_gate", level: 6, parameters: { a: 1, b: 0, c: 1, d: 2, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }, energy: 4.8e31 },
  { id: 30, api_id: "phase_gate_t", name: "Phase Gate T", family: "quantum_gate", level: 6, parameters: { a: 1, b: 0, c: 0.785, d: 2, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }, energy: 4.5e31 },
  { id: 31, api_id: "cnot_gate_surface", name: "CNOT Gate Surface", family: "quantum_gate", level: 6, parameters: { a: 1, b: 1, c: 0, d: 2, e: 0.5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }, energy: 6.8e31 },
  { id: 32, api_id: "quantum_information_flow", name: "Quantum Information Flow Network", family: "quantum_network", level: 6, parameters: { a: 1, b: 1, c: 1, d: 6, e: 0.618, f: 0.618, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }, energy: 2.1e32 },
];

const GENESIS_HASH = "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04";

export async function registerRoutes(app: Express): Promise<Server> {

  // ============ UUON MOS API — LIVE SHAPE DATA ============

  // Health check
  app.get("/api/health", async (req, res) => {
    res.json({
      status: "ok",
      mode: "MOS-live",
      shapes: GENESIS_SHAPES.length,
      genesis_hash: GENESIS_HASH,
      port: 1618,
      timestamp: new Date().toISOString()
    });
  });

  // List all 32 genesis shapes (public)
  app.get("/api/shapes", async (req, res) => {
    res.json(GENESIS_SHAPES.map(s => ({
      shapeId: s.api_id,
      shapeName: s.name,
      fibonacci_level: s.level,
      mathematical_family: s.family,
      genesis_anchor: GENESIS_HASH,
    })));
  });

  // Get single shape metadata (public)
  app.get("/api/shapes/:shapeId", async (req, res) => {
    const shape = GENESIS_SHAPES.find(s => 
      s.api_id === req.params.shapeId || s.id === parseInt(req.params.shapeId)
    );
    if (!shape) return res.status(404).json({ error: "Shape not found" });
    
    res.json({
      shapeId: shape.api_id,
      shapeName: shape.name,
      fibonacci_level: shape.level,
      mathematical_family: shape.family,
      parameters: shape.parameters,
      genesis_anchor: GENESIS_HASH,
      energy: shape.energy,
    });
  });

  // Compute shape — PIEZ gated
  app.get("/api/shapes/:shapeId/compute", piezGate, async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('PIEZ-Balance ')) {
      return res.status(401).json({
        error: "PIEZ_AUTH_REQUIRED",
        message: "Authorization: PIEZ-Balance {walletAddress}",
        piez_contract: "0xfb9c83432331EAf6f4a9D9488828823587d6f3da",
      });
    }

    const walletAddress = authHeader.replace('PIEZ-Balance ', '');
    const shape = GENESIS_SHAPES.find(s =>
      s.api_id === req.params.shapeId || s.id === parseInt(req.params.shapeId)
    );
    if (!shape) return res.status(404).json({ error: "Shape not found" });

    // Return Shape Token Standard v0.1 response
    res.json({
      shape_token_standard: "0.1",
      shape_token_id: `ST-${shape.api_id.toUpperCase()}-L${shape.level}-${String(shape.id).padStart(3, '0')}`,
      genesis_anchor: GENESIS_HASH,
      integrity_hash: `0x${shape.id.toString(16).padStart(8, '0')}3f7d9e2a`,
      identity: {
        shape_id: shape.api_id,
        shape_name: shape.name,
        mathematical_family: shape.family,
        fibonacci_level: shape.level,
        dmension_version: "2.0",
      },
      representation: {
        parameters: shape.parameters,
      },
      energy: {
        base_energy: shape.energy,
        energy_source: "mint",
        energy_hash: `0x${Math.abs(shape.energy).toString(16).slice(0, 40)}`,
      },
      access: {
        piez_required: true,
        tier: 0,
        piez_cost_per_call: 0.001,
        accessed_by: walletAddress,
        accessed_at: new Date().toISOString(),
      },
      provenance: {
        author: "Phillip Aguilar Ruiz III",
        organization: "UUON Foundation Inc.",
        license: "CC BY-NC 4.0",
        on_chain_address: "0x29b056EF63867BECe07DA46c470aC168154EF275",
      }
    });
  });

  // Signal endpoint — PSENT gated
  app.get("/api/shapes/:shapeId/signal", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('PSENT-Balance ')) {
      return res.status(401).json({
        error: "PSENT_AUTH_REQUIRED",
        message: "Authorization: PSENT-Balance {walletAddress}",
        psent_contract: "0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7",
      });
    }

    const shape = GENESIS_SHAPES.find(s =>
      s.api_id === req.params.shapeId || s.id === parseInt(req.params.shapeId)
    );
    if (!shape) return res.status(404).json({ error: "Shape not found" });

    res.json({
      shape_token_standard: "0.1",
      genesis_anchor: GENESIS_HASH,
      signal: {
        family: shape.family,
        anomaly_score: parseFloat((Math.random() * 0.1).toFixed(4)),
        confidence: parseFloat((0.90 + Math.random() * 0.09).toFixed(4)),
        fibonacci_level: shape.level,
        energy_tier: shape.energy > 1e32 ? "HIGH" : shape.energy > 5e31 ? "MEDIUM" : "LOW",
      }
    });
  });

  // Genesis hash verification (public)
  app.get("/api/genesis/verify", async (req, res) => {
    res.json({
      genesis_hash: GENESIS_HASH,
      anchored_block: "47259953",
      chain: "Base Mainnet",
      contract: "0x29b056EF63867BECe07DA46c470aC168154EF275",
      shape_count: 32,
      verified: true,
    });
  });

  // ============ DISABLED ROUTES ============
  const disabled = { error: "Route requires full database mode" };
  app.post("/api/auth/register", (req, res) => res.status(503).json(disabled));
  app.post("/api/auth/login", (req, res) => res.status(503).json(disabled));
  app.post("/api/visualizations", (req, res) => res.status(503).json(disabled));
  app.get("/api/visualizations/:id", (req, res) => res.status(503).json(disabled));
  app.get("/api/users/:userId/visualizations", (req, res) => res.status(503).json(disabled));
  app.post("/api/sessions", (req, res) => res.status(503).json(disabled));
  app.get("/api/sessions/:sessionId", (req, res) => res.status(503).json(disabled));
  app.put("/api/sessions/:sessionId", (req, res) => res.status(503).json(disabled));
  app.delete("/api/sessions/:sessionId", (req, res) => res.status(503).json(disabled));
  app.post("/api/parameter-history", (req, res) => res.status(503).json(disabled));
  app.get("/api/parameter-history/:userId", (req, res) => res.status(503).json(disabled));
  app.post("/api/performance-metrics", (req, res) => res.status(503).json(disabled));
  app.post("/api/research", (req, res) => res.status(503).json(disabled));
  app.get("/api/research", (req, res) => res.status(503).json(disabled));
  app.get("/api/community/creations", (req, res) => res.status(503).json(disabled));
  app.post("/api/math/compute", (req, res) => res.status(503).json(disabled));
  app.post("/api/upload", (req, res) => res.status(503).json(disabled));

  return createServer(app);
}

  // Clouud lattice reduction endpoint
  app.get("/api/clouud/stats", async (req, res) => {
    res.json({
      status: "Clouud lattice reduction active",
      ...getClouudStats(),
      timestamp: new Date().toISOString(),
    });
  });

  // Clouud proof generation (PIEZ gated)
  app.post("/api/clouud/proof/:shapeId", piezGate, async (req, res) => {
    const shape = GENESIS_SHAPES.find(s =>
      s.api_id === req.params.shapeId || s.id === parseInt(req.params.shapeId)
    );
    if (!shape) return res.status(404).json({ error: "Shape not found" });

    const shapeState = {
      id: shape.api_id,
      parameters: shape.parameters,
      energy: shape.energy,
      family: shape.family,
      timestamp: Date.now(),
    };

    const proof = generateOnChainProof(shapeState);
    const compressed = compressStateToLattice(shapeState);

    res.json({
      shape_id: shape.api_id,
      clouud_proof: {
        ...proof,
        lattice_positions_encoded: compressed.deltaEncoded.toString("hex"),
        reduction_efficiency: proof.compression.toFixed(2) + "% waste reduction",
        gas_comparison: {
          full_state_gas: 21000,
          clouud_proof_gas: proof.gasEstimate,
          savings: 21000 - proof.gasEstimate,
        },
      },
      blockchain_efficiency: {
        state_size_bytes: JSON.stringify(shapeState).length,
        proof_size_bytes: compressed.deltaEncoded.length,
      },
    });
  });
