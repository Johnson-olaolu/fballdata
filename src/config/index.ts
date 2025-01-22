import { config } from "dotenv";

config();

export const {
  PORT,
  NODE_ENV,
  BASE_URL,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_DIALECT,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;
