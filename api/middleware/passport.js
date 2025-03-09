import passport from 'passport';

// Google Strategy
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import GitHubOAuth2 from 'passport-github2'; // Import the whole package as a default import
const GitHubStrategy = GitHubOAuth2.Strategy;  // Access the Strategy from the imported object

import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Log environment variables to ensure they are loaded
//console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
//console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
//console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID);
//console.log('GitHub Client Secret:', process.env.GITHUB_CLIENT_SECRET);



// Use Google Strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID from Google Developer Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Your Google Client Secret from Google Developer Console
      callbackURL: "http://localhost:8800/api/auth/google/callback",  // Your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // You can modify this to save the user profile in a database if needed
      return done(null, profile);  // Pass the user profile to the session
    }
  )
);

// Serialize user into session (store user profile in the session)
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from session (retrieve user profile from session)
passport.deserializeUser((user, done) => done(null, user));




// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8800/api/auth/github/callback", // Your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("GitHub Profile:", profile);
      // You can save the user to the database here
      return done(null, profile);
    }
  )
);


// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,  // Your GitHub Client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET,  // Your GitHub Client Secret
      callbackURL: "http://localhost:8800/api/auth/github/callback",  // Set this in GitHub OAuth application
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);  // Store GitHub profile in session
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from session
passport.deserializeUser((user, done) => done(null, user));

export default passport;
