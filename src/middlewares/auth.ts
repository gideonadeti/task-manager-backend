import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { TokenExpiredError } from "jsonwebtoken";

import { configurePassport } from "../utils/configure-passport";

configurePassport();

export default function auth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "jwt",
    { session: false },
    (error: any, user: User, info: any) => {
      if (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
          errors: [{ message: "Internal server error" }],
        });
      }

      if (!user) {
        if (info instanceof TokenExpiredError) {
          return res
            .status(401)
            .json({ errors: [{ message: "Token has expired" }] });
        }

        return res.status(401).json({ errors: [{ message: "Unauthorized" }] });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
}
