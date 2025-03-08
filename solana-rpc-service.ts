// src/services/dataFetching/solanaRPC.ts
import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { logger } from '../../utils/logger';
import { config } from '../../config/solana';

class SolanaRPCService {
  private connection: Connection;
  
  constructor() {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
  }
  
  /**
   * Get token accounts created by a specific wallet
   */
  async getTokensCreatedByWallet(walletAddress: string): Promise<any[]> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const tokenAccounts = await this.connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165, // Size of token account
            },
            {
              memcmp: {
                offset: 32, // Offset of the mint address
                bytes: publicKey.toBase58(),
              },
            },
          ],
        }
      );
      
      return tokenAccounts.map(account => {
        const parsedAccountData = account.account.data as ParsedAccountData;
        return {
          pubkey: account.pubkey,
          account: parsedAccountData
        };
      });
    } catch (error) {
      logger.error('Error fetching tokens created by wallet', { 
        walletAddress, 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Get recent token creation events
   */
  async getRecentTokenCreations(limit: number = 100): Promise<any[]> {
    try {
      // This is simplified - in practice you might need to filter
      // from recent signatures and transactions
      const signatures = await this.connection.getSignaturesForAddress(
        TOKEN_PROGRAM_ID,
        { limit }
      );
      
      const transactions = await Promise.all(
        signatures.map(async sig => {
          return this.connection.getParsedTransaction(sig.signature);
        })
      );
      
      // Filter for token creation transactions
      // This is a simplified example - real implementation would need more parsing
      return transactions.filter(tx => 
        tx?.meta?.logMessages?.some(log => 
          log.includes('Initialize mint') || log.includes('Token creation')
        )
      );
    } catch (error) {
      logger.error('Error fetching recent token creations', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Get liquidity pool data for a specific token
   */
  async getLiquidityPoolsForToken(tokenMint: string): Promise<any[]> {
    try {
      // This is a placeholder - in practice, you would query from known DEXes
      // like Raydium, Orca, etc., which requires specific program knowledge
      
      // Simplified example - in reality much more complex
      const publicKey = new PublicKey(tokenMint);
      const accounts = await this.connection.getParsedProgramAccounts(
        new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'), // Serum DEX program ID
        {
          filters: [
            {
              memcmp: {
                offset: 5, // Example offset - this varies by program
                bytes: publicKey.toBase58(),
              },
            },
          ],
        }
      );
      
      // Process accounts to extract liquidity pools
      // Would require specific knowledge of each DEX program's data structure
      return accounts.map(account => ({
        pubkey: account.pubkey.toBase58(),
        data: account.account.data
      }));
    } catch (error) {
      logger.error('Error fetching liquidity pools for token', { 
        tokenMint, 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

export const solanaRPCService = new SolanaRPCService();
