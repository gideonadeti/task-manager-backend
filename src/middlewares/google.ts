import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { configurePassport } from "../utils/configure-passport";
configurePassport();

export default function google(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}
