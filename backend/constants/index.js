import dotenv from 'dotenv';

dotenv.config();

export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;
export const PORT = process.env.PORT;
export const MAX_WRONG_ATTEMPTS = 5;
export const BLOCK_DURATION = 60 * 60 * 1000;
export const NODEMAILER_EMAIL_HOST = process.env.NODEMAILER_EMAIL_HOST;
export const NODEMAILER_EMAIL_PORT = process.env.NODEMAILER_EMAIL_PORT;
export const NODEMAILER_EMAIL_USER = process.env.NODEMAILER_EMAIL_USER;
export const NODEMAILER_EMAIL_PASS = process.env.NODEMAILER_EMAIL_PASS;

