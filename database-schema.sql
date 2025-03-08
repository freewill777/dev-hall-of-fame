-- Token Creators table
CREATE TABLE token_creators (
  id SERIAL PRIMARY KEY,
  address VARCHAR(44) UNIQUE NOT NULL,
  first_seen TIMESTAMP NOT NULL,
  last_seen TIMESTAMP NOT NULL,
  total_tokens_created INTEGER NOT NULL DEFAULT 0,
  total_liquidity_usd NUMERIC(24, 6) NOT NULL DEFAULT 0,
  current_rank INTEGER,
  previous_rank INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tokens table
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  mint VARCHAR(44) UNIQUE NOT NULL,
  creator_address VARCHAR(44) NOT NULL REFERENCES token_creators(address),
  name VARCHAR(255),
  symbol VARCHAR(32),
  created_at TIMESTAMP NOT NULL,
  total_supply NUMERIC(36, 0),
  decimals INTEGER NOT NULL,
  total_liquidity_usd NUMERIC(24, 6) NOT NULL DEFAULT 0,
  created_at_app TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Liquidity Pools table
CREATE TABLE liquidity_pools (
  id SERIAL PRIMARY KEY,
  address VARCHAR(44) UNIQUE NOT NULL,
  token_a VARCHAR(44) NOT NULL,
  token_b VARCHAR(44) NOT NULL,
  amm_type VARCHAR(32) NOT NULL,
  liquidity_usd NUMERIC(24, 6) NOT NULL DEFAULT 0,
  volume_24h NUMERIC(24, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Token to Liquidity Pool mapping (many-to-many)
CREATE TABLE token_liquidity_pools (
  id SERIAL PRIMARY KEY,
  token_mint VARCHAR(44) NOT NULL REFERENCES tokens(mint),
  pool_address VARCHAR(44) NOT NULL REFERENCES liquidity_pools(address),
  UNIQUE(token_mint, pool_address)
);

-- Historical data for tracking changes over time
CREATE TABLE historical_data (
  id SERIAL PRIMARY KEY,
  creator_address VARCHAR(44) NOT NULL REFERENCES token_creators(address),
  rank INTEGER NOT NULL,
  total_liquidity_usd NUMERIC(24, 6) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_token_creator_address ON tokens(creator_address);
CREATE INDEX idx_token_liquidity_pools_token ON token_liquidity_pools(token_mint);
CREATE INDEX idx_token_liquidity_pools_pool ON token_liquidity_pools(pool_address);
CREATE INDEX idx_historical_data_creator ON historical_data(creator_address);
CREATE INDEX idx_historical_data_timestamp ON historical_data(timestamp);
