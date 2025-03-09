import express from "express";
import { googleAuth, googleAuthCallback } from "../controllers/googleAuthController.js";

const router = express.Router();

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
