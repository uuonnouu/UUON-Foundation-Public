# Shape Token Standard — v0.1

**UUON Foundation Inc.**
Creator: Phillip Aguilar Ruiz III
Genesis Hash: `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`
Status: Draft — Reference Implementation Live
License: CC BY-NC 4.0

---

## What This Is

A Shape Token is not a file. It is not a visualization. It is a mathematical object
with a cryptographic identity, verifiable properties, and a machine-readable definition
of what it is, what transformations preserve it, and what operations it supports.

Every other token standard describes what a token *represents*.
The Shape Token Standard describes what a token *is* and provides cryptographic proof of it.

This distinction is the entire value proposition.

The integrity hash in every Shape Token response is anchored to the UUON genesis hash.
Any machine — an AI agent, a DeFi protocol, a ZK prover, an indexer — can verify
that a shape token is mathematically authentic without trusting the API that served it.
No existing token standard has cryptographic content verification built into the schema.

---

## Reference Implementation

The PIEZ API is the reference implementation of this standard.

Every response from a PIEZ-gated endpoint returns a Shape Token Standard compliant
envelope. The standard and the implementation ship simultaneously. They validate each other.

```
GET /api/shapes/{shapeId}/compute
Authorization: PIEZ-Balance {walletAddress}

Response: ShapeToken (see schema below)
```

---

## Schema — Required Fields

```json
{
  "shape_token_standard": "0.1",
  "shape_token_id": "string — unique identifier",
  "genesis_anchor": "string — UUON genesis hash this token derives from",
  "integrity_hash": "string — cryptographic hash of this token's content",

  "identity": {
    "shape_id": "string — canonical shape identifier",
    "shape_name": "string — human-readable name",
    "mathematical_family": "string — see Family Registry below",
    "fibonacci_level": "integer — which Fibonacci level this shape belongs to (1-6)",
    "dmension_version": "string — engine version that produced this token"
  },

  "representation": {
    "parameters": {
      "a": "number",
      "b": "number",
      "c": "number",
      "d": "number",
      "e": "number",
      "f": "number",
      "u_min": "number",
      "u_max": "number",
      "v_min": "number",
      "v_max": "number",
      "u_segments": "integer",
      "v_segments": "integer"
    },
    "nerf_config": {
      "encoding": "string — HashGrid | Spherical | etc",
      "n_levels": "integer",
      "base_resolution": "integer",
      "max_resolution": "integer",
      "per_level_scale": "number"
    },
    "scene_bounds": {
      "aabb_min": ["number", "number", "number"],
      "aabb_max": ["number", "number", "number"],
      "center": ["number", "number", "number"],
      "scale": "number"
    }
  },

  "topology": {
    "topological_class": "string — surface type",
    "orientable": "boolean",
    "boundary_conditions": "string — closed | open | periodic",
    "dimensionality": "integer — 2 | 3 | higher"
  },

  "invariants": {
    "mathematical_invariants": ["string — properties preserved under transformation"],
    "symmetry_group": "string — if applicable",
    "curvature_type": "string — positive | negative | zero | mixed"
  },

  "transformations": {
    "allowed": ["string — parameter_mutation | fusion | projection"],
    "prohibited": ["string — operations that break mathematical identity"],
    "fusion_compatible": ["string — shape IDs this token can be fused with"]
  },

  "energy": {
    "base_energy": "number — from token ledger",
    "energy_source": "string — mint | computation | fusion",
    "energy_hash": "string — hash of energy state",
    "cumulative_energy": "number"
  },

  "provenance": {
    "author": "string",
    "organization": "string",
    "export_timestamp": "string — ISO 8601",
    "license": "string — SPDX identifier",
    "copyright": "string",
    "on_chain_address": "string — ERC-20 contract address if minted"
  },

  "access": {
    "piez_required": "boolean — is PIEZ balance required",
    "psent_required": "boolean — is PSENT balance required",
    "tier": "integer — 0=basic 1=render 2=export 3=enterprise",
    "piez_cost_per_call": "number — in PIEZ tokens"
  }
}
```

---

## Schema — Optional Fields (Extended Representations)

These fields are returned when the caller holds sufficient PIEZ balance for the tier.

```json
{
  "extended": {
    "formula": {
      "positional_encoding": "object — full encoding formula",
      "volume_rendering": "object — rendering integral specification",
      "hash_grid_encoding": "object — spatial hash specification",
      "camera_projection": "object — camera model"
    },
    "camera_transforms": {
      "model": "string — PINHOLE | FISHEYE",
      "focal_length_x": "number",
      "focal_length_y": "number",
      "frame_count": "integer",
      "frames": ["object — 4x4 transform matrices"]
    },
    "tensor_representation": {
      "embedding_dim": "integer",
      "latent_vector": "string — base64 encoded",
      "compression_ratio": "number"
    }
  }
}
```

---

## Mathematical Family Registry

Every Shape Token belongs to exactly one mathematical family.
Families define what operations and invariants apply.

| Family | Shapes | Invariants |
|---|---|---|
| `cryptographic_hash` | SHA-256, Keccak, Avalanche | diffusion, avalanche threshold |
| `symmetric_cipher` | AES Rijndael | substitution, permutation structure |
| `asymmetric_key` | ECC, Kyber/NTRU | curve group law, lattice error bounds |
| `integrity_proof` | Merkle Tree | path completeness, root binding |
| `financial_surface` | Black-Scholes, Volatility, Monte Carlo | pricing bounds, no-arbitrage |
| `market_structure` | Crypto Price Fractal | self-similarity, Hurst exponent |
| `ai_geometry` | Attention, Loss Landscape, Gradient, Kolmogorov | convergence bounds, description length |
| `quantum_state` | Bloch Sphere, State Vector, Superposition, Entangled, GHZ, Tensor, QEC, Shor | normalization, unitarity |
| `quantum_gate` | Pauli X/Y/Z, Hadamard, Phase S/T, CNOT | unitarity, hermiticity |
| `quantum_network` | Quantum Information Flow | channel capacity, decoherence bounds |
| `policy_propagation` | Policy Impact (#33) | phi-decay, fibonacci level activation |

---

## Verification Rules

A Shape Token response is valid if and only if:

1. `integrity_hash` is deterministically reproducible from the token content
2. `genesis_anchor` matches the UUON genesis hash:
   `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`
3. `fibonacci_level` is an integer between 1 and 6 (dimensional limit)
4. `energy.energy_hash` matches the record in the UUON token ledger
5. All `representation.parameters` are within the bounds defined for the mathematical family

Any system — AI agent, indexer, ZK prover — can verify rules 1-2 without
calling any external service. The hash is the proof.

---

## Transformation Rules

### Allowed Transformations

**Parameter mutation** — changing parameter values within the mathematical family's bounds
produces a new Shape Token with a new ID but the same family classification.

**Fusion** — combining two Shape Tokens via `shapeFusionEngine` produces a composite
Shape Token. Fusion is only allowed between tokens listed in `transformations.fusion_compatible`.
The composite inherits invariants that both parents share.

**Projection** — reducing dimensionality (e.g. 3D surface → 2D cross-section) preserves
the mathematical identity but changes the `topology.dimensionality` field.

### Prohibited Transformations

Operations that are prohibited:
- Changing the `mathematical_family` classification without engine recomputation
- Modifying `genesis_anchor` or `integrity_hash` post-generation
- Fusing tokens from incompatible families (defined per family in the registry)

---

## Versioning

The Shape Token Standard uses semantic versioning.

`v0.1` — minimum viable specification. Required fields only.
`v0.2` — extended fields, tensor representations, ZK constraint integration.
`v1.0` — stable. Requires three external integrations before promotion.

The current version (`0.1`) is intentionally minimal. The Contrarian is right —
standards written before adoption solve the wrong problems. This version solves
one problem: any machine can receive a shape token response and know what it is.

---

## Hashing Method

The integrity hash is computed as:

```
integrity_hash = SHA-256(
  genesis_anchor +
  shape_id +
  JSON.stringify(parameters, sorted_keys) +
  energy_hash +
  export_timestamp
)
```

This is deterministic, reproducible, and verifiable offline.
The genesis anchor threads the UUON Foundation's root hash through every shape token
ever produced, creating a cryptographic provenance chain.

---

## Licensing and Provenance Model

Shape Tokens carry their license in the `provenance.license` field.

Genesis shapes (levels 1-6): `CC BY-NC 4.0`
Composite/fused shapes: inherit the most restrictive license of their parents
Custom shapes (API-generated): license specified at generation time

The `provenance.on_chain_address` field links the token to its ERC-20 record
on Base mainnet when applicable, enabling on-chain ownership verification.

---

## Example — SHA-256 Shape Token Response

```json
{
  "shape_token_standard": "0.1",
  "shape_token_id": "ST-SHA256-L1-001",
  "genesis_anchor": "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",
  "integrity_hash": "000000000000000000000000000000000000000000000000000000003637be0c",

  "identity": {
    "shape_id": "sha256_compression_function",
    "shape_name": "SHA-256 Bitwise Compression Function Spirals",
    "mathematical_family": "cryptographic_hash",
    "fibonacci_level": 1,
    "dmension_version": "2.0"
  },

  "representation": {
    "parameters": {
      "a": 1, "b": 1, "c": 1, "d": 8, "e": 0.5, "f": 0.7,
      "u_min": 0, "u_max": 1, "v_min": 0, "v_max": 1,
      "u_segments": 128, "v_segments": 64
    },
    "nerf_config": {
      "encoding": "HashGrid",
      "n_levels": 16,
      "base_resolution": 16,
      "max_resolution": 2048,
      "per_level_scale": 1.3819128799677762
    },
    "scene_bounds": {
      "aabb_min": [-1.2873, -0.9536, -0.3301],
      "aabb_max": [1.6045, 1.1862, 2.9659],
      "center": [0.1585, 0.1163, 1.3178],
      "scale": 3.2960
    }
  },

  "topology": {
    "topological_class": "compression_surface",
    "orientable": true,
    "boundary_conditions": "periodic",
    "dimensionality": 3
  },

  "invariants": {
    "mathematical_invariants": ["diffusion_constant", "avalanche_threshold", "bit_independence"],
    "symmetry_group": "none",
    "curvature_type": "mixed"
  },

  "transformations": {
    "allowed": ["parameter_mutation", "fusion", "projection"],
    "prohibited": ["family_reclassification"],
    "fusion_compatible": ["keccak_sha3_sponge", "hash_avalanche_effect", "blockchain_merkle_tree"]
  },

  "energy": {
    "base_energy": 5.5e+31,
    "energy_source": "mint",
    "energy_hash": "0af3280e573ed0b47360851669b83f815422e2970b1e680202ede9a08271bf5a",
    "cumulative_energy": 5.5e+31
  },

  "provenance": {
    "author": "Phillip Aguilar Ruiz III",
    "organization": "UUON Foundation Inc.",
    "export_timestamp": "2026-06-10T19:26:01.954Z",
    "license": "CC BY-NC 4.0",
    "copyright": "© 2024 UUON Foundation Inc. All Rights Reserved.",
    "on_chain_address": "0x29b056EF63867BECe07DA46c470aC168154EF275"
  },

  "access": {
    "piez_required": true,
    "psent_required": false,
    "tier": 0,
    "piez_cost_per_call": 0.001
  }
}
```

---

## What Is Not In This Version

The following are deliberately excluded from v0.1:

- ZK constraint system integration (v0.2)
- Tensor/embedding vector output (v0.2)
- Multi-shape batch responses (v0.2)
- Governance voting schema (v1.0)
- Cross-chain bridge schema (v1.0)

The Contrarian is right about premature formalization. This version solves
exactly one problem and no others: any machine can receive a Shape Token
and know what it is, verify it is authentic, and understand what it can do.

---

*UUON Foundation Inc. — Shape Token Standard v0.1 — June 2026*
*Creator: Phillip Aguilar Ruiz III*
*Genesis Hash: cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04*
