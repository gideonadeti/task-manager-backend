import dotenv from "dotenv";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { VerifyCallback } from "passport-google-oauth20";

import { readUserById, readUserByGoogleId, createUserFromGoogle } from "../db";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
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

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const existingUser = await readUserByGoogleId(profile.id);

          if (existingUser) {
            return done(null, existingUser);
          }

          const googleId = profile.id;
          const firstName = profile.name?.givenName || "First Name";
          const lastName = profile.name?.familyName || "Last Name";
          const emails = profile.emails;

          if (!emails || emails.length === 0) {
            return done(new Error("No emails found in Google profile"), false);
          }

          const email = emails[0].value;

          const newUser = await createUserFromGoogle(
            googleId,
            firstName,
            lastName,
            email
          );

          return done(null, newUser);
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return done(error, false);
        }
      }
    )
  );
}
