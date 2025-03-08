// Types for the Solana Token Creator Hall of Fame

// Represents a token creator
interface TokenCreator {
  id: string;              // Unique identifier
  address: string;         // Solana wallet address
  firstSeen: Date;         // First token creation timestamp
  lastSeen: Date;          // Most recent token creation timestamp
  totalTokensCreated: number;  // Total number of tokens created
  totalLiquidityUSD: number;   // Sum of all liquidity pools in USD
  rank: number;            // Current rank in the hall of fame
  previousRank?: number;   // Previous rank for tracking movement
  tokens: Token[];         // Tokens created by this creator
}

// Represents a token
interface Token {
  id: string;              // Unique identifier
  mint: string;            // Token mint address
  creatorAddress: string;  // Creator's wallet address
  name: string;            // Token name
  symbol: string;          // Token symbol
  createdAt: Date;         // Creation timestamp
  totalSupply: number;     // Total supply
  decimals: number;        // Decimals
  liquidityPools: LiquidityPool[];  // Associated liquidity pools
  totalLiquidityUSD: number;        // Sum of all liquidity in USD
}

// Represents a liquidity pool
interface LiquidityPool {
  id: string;              // Unique identifier
  address: string;         // Pool address
  tokenA: string;          // First token in the pool (mint address)
  tokenB: string;          // Second token in the pool (mint address)
  ammType: string;         // AMM type (Raydium, Orca, etc.)
  liquidityUSD: number;    // Total liquidity in USD
  volume24h: number;       // 24-hour volume
  updatedAt: Date;         // Last update timestamp
}

// Historical data point for tracking changes over time
interface HistoricalDataPoint {
  timestamp: Date;         // Timestamp of the snapshot
  creatorAddress: string;  // Creator's wallet address
  rank: number;            // Rank at that time
  totalLiquidityUSD: number;  // Total liquidity at that time
}

// Filter options for API queries
interface FilterOptions {
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  minLiquidityUSD?: number;
  maxRank?: number;        // Limit to top N creators
  ammType?: string[];      // Filter by specific AMMs
  sortBy?: 'liquidityUSD' | 'tokenCount' | 'age';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// API response for token creators list
interface TokenCreatorListResponse {
  creators: TokenCreator[];
  totalCount: number;
  page: number;
  pageSize: number;
  filters: FilterOptions;
  lastUpdated: Date;
}
