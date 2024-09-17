import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

import { checkEmailExistence, createUser, createRefreshToken } from "../db";
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

      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

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
