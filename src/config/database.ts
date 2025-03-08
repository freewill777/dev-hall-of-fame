export const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'solana_token_creator',
  user: process.env.POSTGRES_USER || process.env.USER || 'krs',  // Use system username
  password: process.env.POSTGRES_PASSWORD || '',  // No password
  max: 30,
  idleTimeoutMillis: 30000
};