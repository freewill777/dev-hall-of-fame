// src/config/solana.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  rpcEndpoint: process.env.SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
  commitment: process.env.SOLANA_COMMITMENT || 'confirmed'
};
