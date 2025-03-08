// src/config/app.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  scheduler: {
    tokenFetchCron: process.env.TOKEN_FETCH_CRON,
    poolFetchCron: process.env.POOL_FETCH_CRON,
    rankingUpdateCron: process.env.RANKING_UPDATE_CRON
  }
};
