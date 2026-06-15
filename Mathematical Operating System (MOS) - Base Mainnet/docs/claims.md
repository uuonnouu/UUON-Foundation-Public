# Claims — What Is Live vs Research-Grade

**UUON Foundation Inc. — June 2026**

This document separates what exists and works today from what is planned
or in research. Honest disclosure of maturity levels is a design principle,
not a weakness.

---

## Live Today — Verifiable Now

These claims can be independently verified by anyone with internet access.

| Claim | Verification |
|---|---|
| 3 ERC-20 tokens deployed on Base mainnet | basescan.org — search contract addresses |
| 2,154 NFTs minted on Base mainnet | basescan.org — ERC-1155 contract |
| 4,000,000+ shape tokens in production database | API: `/api/shapes` returns live data |
| 32 genesis shapes published with full NeRF datasets | This repository — `shapes/` directory |
| API serving shape data on Railway | `distinguished-rebirth-production.up.railway.app/api/shapes` |
| Genesis hash anchored to Base block 47259953 | basescan.org — block explorer |
| Shape Token Standard v0.1 published | `SHAPE_TOKEN_STANDARD.md` in this repo |

---

## Building Now — Ships This Phase

These are in active development. Not live yet but not theoretical.

| Item | Status | Description |
|---|---|---|
| PIEZ token-gated API | Building | Balance check middleware, shipping this week |
| PSENT token-gated API | Building | Intelligence signal endpoints, follows PIEZ |
| UUONLevelRegistry contract | Ready to deploy | Governs 6-level Fibonacci structure |
| PIEZDistributor contract | Ready to deploy | Public supply distribution with 2% wallet cap |
| Shape Token Standard responses | Building | Every API response returns standard envelope |

---

## Research-Grade — Real but Not Production

These are mathematically sound and implemented in the Dmension engine,
but not yet hardened for production use at scale. They require validation
before commercial deployment.

| Item | Maturity | Notes |
|---|---|---|
| Geometric Proof of Work (gPoW) | Formal spec complete | Needs economic attack modeling, difficulty testing |
| ZK constraint system integration | Research | Shapes define geometric constraints that feed ZK provers — not yet implemented |
| zkML model verification | Research | Geometric behavior manifolds for ML verification — proof of concept stage |
| Shape-based anomaly detection | Research | Topological anomaly detection — needs benchmark against standard statistical methods |
| Tensor/embedding representation | Research | HashGrid as compression layer — architecture defined, not benchmarked |

**What "research-grade" means here:**
The mathematical foundation is correct. The Dmension engine produces the objects.
The application of those objects to specific problems (ZK proofs, anomaly detection)
requires additional engineering and validation work before we claim production readiness.

---

## Phase 2 — Q4 2026

Not started. Dependent on Phase 1.5 being fully operational.

| Item | Dependency |
|---|---|
| Cosmos SDK appchain | 5 validators recruited, gPoW implemented |
| gPoW consensus | Formal spec exists, implementation not started |
| BTC/ETH/Hyperledger bridges | Appchain must be live first |
| CRYSTALS-Dilithium signatures | Phase 3, not Phase 2 |

---

## Phase 3 — 2027

Long-term targets. Do not treat these as near-term commitments.

| Item | Notes |
|---|---|
| Native quantum-resistant chain | Requires full Phase 2 first |
| Theory of Everything shapes | Calabi-Yau, E8, Loop QG, Penrose, Riemann zeta |
| CEX/DEX listings | Requires legal structure + working product |
| Professional security audit | $20-50K budget, required before Phase 3 |

---

## What We Don't Claim

To be explicit about what this project is not:

- We do not claim UUON shapes automatically generate ZK proofs. The shapes define geometric constraints that *can feed* ZK provers with additional engineering work.
- We do not claim gPoW is economically secure. The concept is novel and requires attack modeling and economic validation before production deployment.
- We do not claim quantum verification is live. The quantum shapes are educational models and simulation frameworks. Commercial quantum verification requires additional research.
- We do not claim any token has monetary value. The tokens represent utility access to a mathematical system. Market price, if any, is determined by the market.

---

*UUON Foundation Inc. — June 2026*
*Creator: Phillip Aguilar Ruiz III*
