import dotenv from 'dotenv';
dotenv.config();

const _environment = {
  PORT : process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JUDGE0_API_URL:process.env.JUDGE0_API_URL
}

export const myEnvironment = Object.freeze(_environment);