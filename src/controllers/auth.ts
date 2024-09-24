import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import {
  checkEmailExistence,
  createUser,
  createRefreshToken,
  readRefreshToken,
  readUserByEmail,
} from "../db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generate-tokens";

export const handleSignUpPost = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .escape(),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    .withMessage("Enter a valid email")
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, ...otherValues } = req.body;

    try {
      const emailExists = await checkEmailExistence(email);

      if (emailExists) {
        return res.status(400).json({
          errors: [{ message: "Email is already used" }],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = { ...otherValues, email, password: hashedPassword };
      const newUser = (await createUser(userData)) as User;

      const accessToken = generateAccessToken(newUser.id);
      const refreshToken = generateRefreshToken(newUser.id);

      await createRefreshToken(refreshToken, newUser.id);

      res.status(201).json({
        message: "Sign up was successful. Signing you in...",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        errors: [
          {
            message:
              "An error occurred during sign up. Please try again later.",
          },
        ],
      });
    }
  },
];

export async function handleRefreshTokenPost(req: Request, res: Response) {
  const { refreshToken } = req.body;

  try {
    const storedRefreshToken = await readRefreshToken(refreshToken);

    if (!storedRefreshToken) {
      return res.sendStatus(403);
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET environment variable is missing");
    }

    jwt.verify(
      storedRefreshToken.token,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || !decoded) {
          return res.sendStatus(403);
        }

        const userId = (decoded as jwt.JwtPayload).id as string;

        const accessToken = generateAccessToken(userId);

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error("Error handling refresh token post:", error);

    res.sendStatus(500);
  }
}

export const handleSignInPost = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    .withMessage("Enter a valid email")
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body as { email: string; password: string };

    try {
      const user = await readUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          errors: [{ message: "Incorrect email or password" }],
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          errors: [
            {
              message: "Incorrect username or password",
            },
          ],
        });
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      await createRefreshToken(refreshToken, user.id);

      res.json({
        message: "Signing you in...",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        errors: [
          {
            message:
              "An error occurred during sign in. Please try again later.",
          },
        ],
      });
    }
  },
];
