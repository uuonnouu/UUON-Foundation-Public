# API Reference — UUON Mathematical Operating System

**Base URL:** `https://distinguished-rebirth-production.up.railway.app`
**Version:** 1.0
**Standard:** Shape Token Standard v0.1
**Genesis Hash:** `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`

---

## Authentication

Two token types gate different endpoint tiers.

**PIEZ authentication** — for computation endpoints:
```
Authorization: PIEZ-Balance {yourWalletAddress}
```

**PSENT authentication** — for intelligence endpoints:
```
Authorization: PSENT-Balance {yourWalletAddress}
```

The API checks your wallet balance on Base mainnet in real time.
Minimum balance: 0.001 PIEZ or PSENT per call.

**Acquire tokens:**
- PIEZ: `0xfb9c83432331EAf6f4a9D9488828823587d6f3da` on Base
- PSENT: `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7` on Base

---

## Error Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 401 | No authorization header provided |
| 402 | Insufficient PIEZ or PSENT balance |
| 404 | Shape not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

**401 response example:**
```json
{
  "error": "PIEZ_AUTH_REQUIRED",
  "message": "Authorization: PIEZ-Balance {walletAddress}",
  "piez_contract": "0xfb9c83432331EAf6f4a9D9488828823587d6f3da",
  "standard": "shape-token-standard-v0.1"
}
```

**402 response example:**
```json
{
  "error": "INSUFFICIENT_PIEZ",
  "message": "Minimum 0.001 PIEZ required for tier 0",
  "required": "0.001",
  "held": "0.0",
  "piez_contract": "0xfb9c83432331EAf6f4a9D9488828823587d6f3da"
}
```

---

## Endpoints

### Public (No Token Required)

---

#### `GET /api/shapes`

Returns all 32 genesis shapes with basic metadata.

**Response:**
```json
[
  {
    "shapeId": "sha256_compression_function",
    "shapeName": "SHA-256 Bitwise Compression Function Spirals",
    "fibonacci_level": 1,
    "mathematical_family": "cryptographic_hash",
    "dmension_version": "2.0",
    "exportDate": "2026-06-10T19:26:01.954Z"
  }
]
```

---

#### `GET /api/shapes/{shapeId}`

Returns full public metadata for one shape.

**Parameters:**
| Name | Type | Description |
|---|---|---|
| shapeId | string | Shape identifier (e.g. `sha256_compression_function`) |

**Shape IDs — all 32:**
```
sha256_compression_function      keccak_sha3_sponge
aes_rijndael_cipher              elliptic_curve_cryptography
lattice_kyber_ntru               hash_avalanche_effect
blockchain_merkle_tree           black_scholes_surface
volatility_surface               monte_carlo_risk
crypto_price_fractal             attention_mechanism
neural_loss_landscape            gradient_descent_path
kolmogorov_complexity            qubit_bloch_sphere
qubit_state_vector               qubit_superposition_state
two_qubit_entangled_state        two_qubit_product_state
three_qubit_ghz_state            multi_qubit_tensor_product
three_qubit_code                 shor_nine_qubit
pauli_x_gate                     pauli_y_gate
pauli_z_gate                     hadamard_gate
phase_gate_s                     phase_gate_t
cnot_gate_surface                quantum_information_flow
```

**Response:**
```json
{
  "source": "Δmension Mathematical Universe",
  "shapeId": "sha256_compression_function",
  "shapeName": "SHA-256 Bitwise Compression Function Spirals",
  "exportDate": "2026-06-10T19:26:01.954Z",
  "parameters": {
    "a": 1, "b": 1, "c": 1, "d": 8, "e": 0.5, "f": 0.7,
    "uMin": 0, "uMax": 1, "vMin": 0, "vMax": 1,
    "uSegments": 128, "vSegments": 64
  },
  "dmension_version": "2.0",
  "security": {
    "cryptographicHash": "000000000000000000000000000000000000000000000000000000003637be0c",
    "author": "UUON Foundation Inc.",
    "license": "CC BY-NC 4.0"
  },
  "scene_bounds": {
    "aabb_min": [-1.2873, -0.9536, -0.3301],
    "aabb_max": [1.6045, 1.1862, 2.9659],
    "center": [0.1585, 0.1163, 1.3178],
    "scale": 3.2960
  }
}
```

---

#### `GET /api/genesis/verify`

Returns genesis hash verification status.

**Response:**
```json
{
  "genesis_hash": "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",
  "anchored_block": "47259953",
  "chain": "Base Mainnet",
  "contract": "0x29b056EF63867BECe07DA46c470aC168154EF275",
  "shape_count": 32,
  "verified": true
}
```

---

### PIEZ-Gated (Computation Layer)

All PIEZ endpoints return a **Shape Token Standard v0.1** compliant envelope.

---

#### `GET /api/shapes/{shapeId}/compute`

Returns formula data, NeRF configuration, and Shape Token Standard envelope.

**Authorization:** `PIEZ-Balance {walletAddress}`
**Cost:** 0.001 PIEZ (Tier 0 — basic)

**Response (Shape Token Standard envelope):**
```json
{
  "shape_token_standard": "0.1",
  "shape_token_id": "ST-SHA256-COMPRESSION-FUNCTION-L1-001",
  "genesis_anchor": "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",
  "integrity_hash": "000000000000000000000000000000000000000000000000000000003637be0c",

  "identity": {
    "shape_id": "sha256_compression_function",
    "shape_name": "SHA-256 Bitwise Compression Function Spirals",
    "mathematical_family": "cryptographic_hash",
    "fibonacci_level": 1,
    "dmension_version": "2.0"
  },

  "access": {
    "piez_required": true,
    "tier": 0,
    "piez_cost_per_call": 0.001,
    "accessed_by": "0xYOUR_WALLET",
    "accessed_at": "2026-06-15T12:00:00.000Z"
  },

  "data": {
    "formulas": { ... },
    "instant_ngp_config": { ... },
    "camera_transforms": { ... }
  }
}
```

---

#### `GET /api/shapes/{shapeId}/export`

Returns full NeRF training dataset including camera transform matrices.

**Authorization:** `PIEZ-Balance {walletAddress}`
**Cost:** 0.002618 PIEZ (Tier 2 — export)

**Response:** Shape Token Standard envelope with full `camera_transforms` array (100 matrices per shape).

---

### PSENT-Gated (Intelligence Layer)

---

#### `GET /api/shapes/{shapeId}/signal`

Returns mathematical intelligence signal derived from the shape.
Specific output depends on the shape's mathematical family.

**Authorization:** `PSENT-Balance {walletAddress}`
**Cost:** 0.001 PSENT (Tier 0)

**Signal types by mathematical family:**

| Family | Signal Output |
|---|---|
| `financial_surface` | Risk geometry, volatility bounds, no-arbitrage conditions |
| `market_structure` | Fractal dimension, Hurst exponent, regime classification |
| `cryptographic_hash` | Diffusion metrics, avalanche coefficient, collision resistance score |
| `quantum_state` | Entanglement measure, decoherence estimate, fidelity bound |
| `quantum_gate` | Unitarity verification, gate fidelity, error rate estimate |
| `ai_geometry` | Convergence prediction, loss landscape curvature, gradient norm |
| `policy_propagation` | Phi-decay propagation model, Fibonacci level activation signal |

**Response example (Black-Scholes surface):**
```json
{
  "shape_token_standard": "0.1",
  "shape_token_id": "ST-BLACK-SCHOLES-SURFACE-L4-001",
  "genesis_anchor": "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",

  "signal": {
    "family": "financial_surface",
    "risk_geometry": {
      "surface_curvature": "convex",
      "volatility_regime": "normal",
      "no_arbitrage_satisfied": true
    },
    "anomaly_score": 0.03,
    "confidence": 0.97
  }
}
```

---

## Pricing Tiers

All prices follow the phi-ratio (φ = 1.618...) progression.

| Tier | PIEZ/call | PSENT/call | Access |
|---|---|---|---|
| 0 — Basic | 0.001 | 0.001 | Metadata, basic formula, signal |
| 1 — Render | 0.001618 | 0.001618 | Full parametric render |
| 2 — Export | 0.002618 | 0.002618 | NeRF training data, camera matrices |
| 3 — Enterprise | 0.004236 | 0.004236 | Batch processing, priority |

---

## Rate Limits

| Limit | Value |
|---|---|
| Per wallet per block (~2 sec) | 10,000 PIEZ max |
| Per wallet total holding | 152,000 PIEZ (2% of public supply) |
| Requests per minute (public endpoints) | 60 |

---

## Code Examples

**JavaScript:**
```javascript
const response = await fetch(
  'https://distinguished-rebirth-production.up.railway.app/api/shapes/sha256_compression_function/compute',
  {
    headers: {
      'Authorization': 'PIEZ-Balance 0xYOUR_WALLET_ADDRESS'
    }
  }
);
const shapeToken = await response.json();
console.log(shapeToken.integrity_hash); // verify authenticity
console.log(shapeToken.data.formulas);  // formula data
```

**Python:**
```python
import requests

response = requests.get(
    'https://distinguished-rebirth-production.up.railway.app/api/shapes/sha256_compression_function/compute',
    headers={'Authorization': 'PIEZ-Balance 0xYOUR_WALLET_ADDRESS'}
)
shape_token = response.json()
print(shape_token['integrity_hash'])  # verify authenticity
print(shape_token['identity'])        # shape classification
```

**curl:**
```bash
curl https://distinguished-rebirth-production.up.railway.app/api/shapes/sha256_compression_function/compute \
  -H "Authorization: PIEZ-Balance 0xYOUR_WALLET_ADDRESS"
```

---

## Verifying Authenticity Offline

Every response includes `genesis_anchor` and `integrity_hash`.
You can verify a shape is authentic without calling the API again:

```python
import hashlib, json

def verify_shape_token(token):
    genesis = token['genesis_anchor']
    shape_id = token['identity']['shape_id']
    params = token['data'].get('parameters', {})
    energy_hash = token['energy']['energy_hash'] or ''
    timestamp = token['provenance']['export_timestamp']

    content = ':'.join([
        genesis,
        shape_id,
        json.dumps(params, sort_keys=True),
        energy_hash,
        timestamp
    ])

    computed = hashlib.sha256(content.encode()).hexdigest()
    claimed  = token['integrity_hash']
    return computed == claimed
```

---

*UUON Foundation Inc. — API Reference v1.0 — June 2026*
*Creator: Phillip Aguilar Ruiz III*
