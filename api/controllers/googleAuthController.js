import passport from "passport";

// Redirect the user to Google login page
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Handle the Google OAuth callback
export const googleAuthCallback = [
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile"); // Redirect to profile after successful login
  },
];
