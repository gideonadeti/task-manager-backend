import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { configurePassport } from "../utils/configure-passport";

configurePassport();

export default function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect: "http://localhost:5173/auth/sign-in",
    },
    (error: any, user: User) => {
      if (error) {
        console.error("Google authentication error:", error);
        return res.redirect("http://localhost:5173/auth/sign-in");
      }

      if (!user) {
        console.error("No user found");
        return res.redirect("http://localhost:5173/auth/sign-in");
      }

      req.user = user;
      next();
    }
  )(req, res, next);
}
