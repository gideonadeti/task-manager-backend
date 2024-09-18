import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in environment variables");
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: 60,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: 120,
  });
}
