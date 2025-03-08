// src/services/scheduler/updateScheduler.ts
import { CronJob } from 'cron';
import { logger } from '../../utils/logger';
import { config } from '../../config/app';
import { fetchRecentTokens } from './jobs/fetchTokens';
import { fetchLiquidityPools } from './jobs/fetchLiquidityPools';
import { updateRankings } from './jobs/updateRankings';

/**
 * Initialize all scheduled jobs
 */
export function initScheduler(): void {
  // Schedule job to fetch recent tokens every 10 minutes
  const tokenFetchJob = new CronJob(
    config.scheduler.tokenFetchCron || '*/10 * * * *',
    async () => {
      try {
        logger.info('Starting scheduled token fetch job');
        await fetchRecentTokens();
        logger.info('Completed scheduled token fetch job');
      } catch (error) {
        logger.error('Error in scheduled token fetch job', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    },
    null,
    true,
    'UTC'
  );
  
  // Schedule job to fetch liquidity pools every 30 minutes
  const poolFetchJob = new CronJob(
    config.scheduler.poolFetchCron || '*/30 * * * *',
    async () => {
      try {
        logger.info('Starting scheduled liquidity pool fetch job');
        await fetchLiquidityPools();
        logger.info('Completed scheduled liquidity pool fetch job');
      } catch (error) {
        logger.error('Error in scheduled liquidity pool fetch job', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    },
    null,
    true,
    'UTC'
  );
  
  // Schedule job to update rankings every hour
  const rankingUpdateJob = new CronJob(
    config.scheduler.rankingUpdateCron || '0 * * * *',
    async () => {
      try {
        logger.info('Starting scheduled ranking update job');
        await updateRankings();
        logger.info('Completed scheduled ranking update job');
      } catch (error) {
        logger.error('Error in scheduled ranking update job', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    },
    null,
    true,
    'UTC'
  );
  
  // Start all jobs
  tokenFetchJob.start();
  poolFetchJob.start();
  rankingUpdateJob.start();
  
  logger.info('Scheduler initialized with all jobs');
}
