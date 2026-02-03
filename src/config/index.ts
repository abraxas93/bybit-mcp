import { config } from 'dotenv';

config();

export const NODE_ENV = process.env.NODE_ENV || 'dev';

// server
export const SERVER_PORT = process.env.SERVER_PORT || '3000';
export const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';

// Bybit API
export const BYBIT_API_KEY = process.env.BYBIT_API_KEY;
export const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET;
export const BYBIT_TESTNET = process.env.BYBIT_TESTNET === 'true';
export const BYBIT_DEMO_TRADING = process.env.BYBIT_DEMO_TRADING === 'true';
