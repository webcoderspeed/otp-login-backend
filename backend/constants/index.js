import dotenv from 'dotenv';

dotenv.config()

export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
export const PORT = process.env.PORT;
export const MAX_WRONG_ATTEMPTS = 5;
export const BLOCK_DURATION = 60 * 60 * 1000;