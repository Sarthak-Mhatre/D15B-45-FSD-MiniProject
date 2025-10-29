import dotenv from "dotenv";
// Make sure to load environment variables first!
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Make sure these are set in your .env file
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      // Build a user object with Google profile info
      const user = {
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      };
      return done(null, user);
    }
  )
);

// Serialize the whole user object for the session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user straight from session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
