import { solanaRPCService } from '../../dataFetching/solanaRPC';
import { creatorProcessor } from '../../dataProcessing/creatorProcessor';
import { logger } from '../../../utils/logger';

export async function fetchLiquidityPools(): Promise<void> {
  try {
    // Get all tokens and fetch their liquidity pools
    const tokens = await solanaRPCService.getRecentTokenCreations();
    const pools = await Promise.all(
      tokens.map(token => solanaRPCService.getLiquidityPoolsForToken(token.mint))
    );
    const flatPools = pools.flat();
    
    await creatorProcessor.processLiquidityPools(flatPools);
    logger.info('Completed fetching liquidity pools', { count: flatPools.length });
  } catch (error) {
    logger.error('Error fetching liquidity pools', { error });
    throw error;
  }
} 