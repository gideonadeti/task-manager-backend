import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
}
