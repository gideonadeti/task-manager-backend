import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in environment variables");
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function generateAccessToken(user: User) {
  return jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

export function generateRefreshToken(user: User) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "14d",
  });
}
