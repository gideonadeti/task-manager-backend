import dotenv from "dotenv";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";

import { readUserById } from "../db";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET environment variable is missing");
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

export function configurePassport() {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await readUserById(jwtPayload.id);

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        console.error("Error during JWT authentication:", error);

        return done(error, false);
      }
    })
  );
}
