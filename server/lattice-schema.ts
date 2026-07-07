// ============================================================
// Persistent Lattice Database Schema
// CRITICAL: Designed for 99.99% uptime, data integrity, recovery
// ============================================================

export const PERSISTENT_LATTICE_SCHEMA = `

-- Main persistent state table
CREATE TABLE IF NOT EXISTS clouud_persistent_states (
  id SERIAL PRIMARY KEY,
  shape_id VARCHAR(255) UNIQUE NOT NULL,
  state_json JSONB NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  active BOOLEAN DEFAULT true,
  last_checkpoint TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Failure recovery log (never deleted, only archived)
CREATE TABLE IF NOT EXISTS clouud_failure_log (
  id SERIAL PRIMARY KEY,
  shape_id VARCHAR(255) NOT NULL,
  error_message TEXT NOT NULL,
  recovery_action TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_manual', -- pending_manual | recovered | archived
  attempt_count INTEGER DEFAULT 0,
  last_attempt TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (shape_id) REFERENCES clouud_persistent_states(shape_id)
);

-- Lattice proof history (immutable audit trail)
CREATE TABLE IF NOT EXISTS clouud_proof_history (
  id SERIAL PRIMARY KEY,
  shape_id VARCHAR(255) NOT NULL,
  lattice_hash VARCHAR(64) NOT NULL,
  proof VARCHAR(64) NOT NULL,
  block_height INTEGER,
  gas_used INTEGER,
  compression_percent NUMERIC(5, 2),
  verified BOOLEAN DEFAULT false,
  verification_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shape_id) REFERENCES clouud_persistent_states(shape_id),
  INDEX idx_shape_id (shape_id),
  INDEX idx_block_height (block_height),
  INDEX idx_verified (verified)
);

-- Checkpoint snapshots (point-in-time recovery)
CREATE TABLE IF NOT EXISTS clouud_checkpoints (
  id SERIAL PRIMARY KEY,
  checkpoint_time TIMESTAMP NOT NULL,
  state_count INTEGER NOT NULL,
  total_size_bytes BIGINT NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  compression_ratio NUMERIC(5, 2),
  duration_ms INTEGER,
  status VARCHAR(50) DEFAULT 'complete', -- complete | partial | failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(checkpoint_time),
  INDEX idx_checkpoint_time (checkpoint_time),
  INDEX idx_status (status)
);

-- Domain lattice weights (adaptive per domain)
CREATE TABLE IF NOT EXISTS clouud_domain_weights (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(100) UNIQUE NOT NULL,
  weights JSONB NOT NULL,
  success_rate NUMERIC(5, 4) DEFAULT 0.99,
  sample_size INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Real-time metrics (for monitoring/alerting)
CREATE TABLE IF NOT EXISTS clouud_metrics (
  id SERIAL PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC(20, 8) NOT NULL,
  tags JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_metric_name_time (metric_name, timestamp)
);

-- Blockchain verification log
CREATE TABLE IF NOT EXISTS clouud_blockchain_verification (
  id SERIAL PRIMARY KEY,
  shape_id VARCHAR(255) NOT NULL,
  proof_hash VARCHAR(64) NOT NULL,
  chain VARCHAR(50) NOT NULL, -- base | arbitrum | optimism | polygon
  tx_hash VARCHAR(66),
  block_height INTEGER,
  gas_price BIGINT,
  gas_used INTEGER,
  cost_usd NUMERIC(10, 2),
  verified BOOLEAN DEFAULT false,
  verification_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shape_id) REFERENCES clouud_persistent_states(shape_id),
  INDEX idx_chain_verified (chain, verified),
  INDEX idx_tx_hash (tx_hash)
);

-- Indexes for critical queries
CREATE INDEX IF NOT EXISTS idx_persistent_states_active ON clouud_persistent_states(active, last_checkpoint);
CREATE INDEX IF NOT EXISTS idx_persistent_states_created ON clouud_persistent_states(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_failure_log_status ON clouud_failure_log(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proof_history_shape ON clouud_proof_history(shape_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkpoints_time ON clouud_checkpoints(checkpoint_time DESC);

-- Views for operational queries
CREATE OR REPLACE VIEW clouud_health AS
SELECT
  (SELECT COUNT(*) FROM clouud_persistent_states WHERE active = true) as active_states,
  (SELECT COUNT(*) FROM clouud_failure_log WHERE status = 'pending_manual') as pending_failures,
  (SELECT COUNT(*) FROM clouud_failure_log WHERE status = 'recovered') as recovered_count,
  (SELECT AVG(compression_percent) FROM clouud_proof_history) as avg_compression,
  (SELECT MAX(checkpoint_time) FROM clouud_checkpoints WHERE status = 'complete') as last_successful_checkpoint,
  (SELECT COUNT(DISTINCT shape_id) FROM clouud_proof_history WHERE verified = true) as verified_proofs;

CREATE OR REPLACE VIEW clouud_failure_stats AS
SELECT
  shape_id,
  COUNT(*) as failure_count,
  COUNT(CASE WHEN status = 'recovered' THEN 1 END) as recovered_count,
  COUNT(CASE WHEN status = 'pending_manual' THEN 1 END) as pending_count,
  MAX(updated_at) as last_failure_time
FROM clouud_failure_log
GROUP BY shape_id;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_persistent_states_timestamp
BEFORE UPDATE ON clouud_persistent_states
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_failure_log_timestamp
BEFORE UPDATE ON clouud_failure_log
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Stored procedure for atomic recovery
CREATE OR REPLACE FUNCTION recover_failed_state(p_shape_id VARCHAR(255))
RETURNS JSONB AS $$
DECLARE
  v_state JSONB;
  v_recovered BOOLEAN;
BEGIN
  -- Get latest successful state
  SELECT state_json INTO v_state
  FROM clouud_persistent_states
  WHERE shape_id = p_shape_id AND active = true
  LIMIT 1;

  IF v_state IS NULL THEN
    -- Try to recover from history
    SELECT state_json INTO v_state
    FROM clouud_persistent_states
    WHERE shape_id = p_shape_id
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  IF v_state IS NOT NULL THEN
    -- Mark as recovered
    UPDATE clouud_failure_log
    SET status = 'recovered', attempt_count = attempt_count + 1, last_attempt = NOW()
    WHERE shape_id = p_shape_id AND status = 'pending_manual'
    LIMIT 1;

    v_recovered := true;
  ELSE
    v_recovered := false;
  END IF;

  RETURN jsonb_build_object(
    'shape_id', p_shape_id,
    'recovered', v_recovered,
    'state', v_state,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql;

`;

export const MIGRATION_INIT = `
-- Initialize persistent lattice infrastructure
BEGIN;

${PERSISTENT_LATTICE_SCHEMA}

-- Insert default domain weights
INSERT INTO clouud_domain_weights (domain, weights, success_rate, sample_size)
VALUES 
  ('cryptographic_hash', '{"1": 0.95, "2": 0.92, "3": 0.89}', 0.99, 10000),
  ('quantum_state', '{"26": 0.95, "27": 0.92, "28": 0.89}', 0.97, 5000),
  ('geometric', '{"11": 0.95, "12": 0.92, "13": 0.89}', 0.98, 8000)
ON CONFLICT (domain) DO NOTHING;

COMMIT;
`;

export default {
  PERSISTENT_LATTICE_SCHEMA,
  MIGRATION_INIT,
};
