import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport"; // Import Passport
import session from "express-session"; // Import session for handling sessions
import "./middleware/passport.js"; // Import your passport config for Google & GitHub
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import reviewRoutes from "./routes/reviews.js";
import bookingRoutes from "./routes/bookings.js";
import reportRoutes from "./routes/reports.js";
import authRoutes from "./routes/auth.js";
import cloudinary from 'cloudinary';

const app = express();
dotenv.config();

// CORS configuration to allow frontend communication
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from your frontend (Vite dev server)
  methods: "GET, POST, PUT, DELETE",
  credentials: true, // If you are using cookies
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session configuration for storing session cookies
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Route to serve the login link for Google
app.get("/", (req, res) => {
  res.send(`
    <a href='/api/auth/google'>Login with Google</a><br>
    <a href='/api/auth/github'>Login with GitHub</a><br><br>
  `); 
});


// Google OAuth route
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect to the profile page after successful login
    res.redirect("/profile");
  }
);

// GitHub OAuth2 route
app.get('/api/auth/github', passport.authenticate('github', {
  scope: ['user:email']
}));

// GitHub OAuth2 callback route
app.get('/api/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');  // Redirect to profile after successful GitHub login
  }
);

// Profile route to display the authenticated user's profile
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");  // Redirect to home if the user is not authenticated
  }
  res.send(`Welcome ${req.user.displayName}`);  // Display the user's display name
});

// Logout route to clear the session
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");  // Redirect to home after logout
  });
});

// Routes for other features (Users, Hotels, Rooms, etc.)
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reports", reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});



// Configure Cloudinary with your cloud name, API key, and secret
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


// Start the server
app.listen(8800, () => {
  connect();
  console.log("Server is running on http://localhost:8800");
});
