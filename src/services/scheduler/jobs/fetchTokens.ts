import { solanaRPCService } from '../../dataFetching/solanaRPC';
import { creatorProcessor } from '../../dataProcessing/creatorProcessor';
import { logger } from '../../../utils/logger';

export async function fetchRecentTokens(): Promise<void> {
  try {
    const tokens = await solanaRPCService.getRecentTokenCreations();
    await creatorProcessor.processNewTokens(tokens);
    logger.info('Completed fetching recent tokens', { count: tokens.length });
  } catch (error) {
    logger.error('Error fetching recent tokens', { error });
    throw error;
  }
} 