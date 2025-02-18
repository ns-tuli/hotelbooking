import express from "express";
import { bookRoom } from "../controllers/booking.js";
import { verifyUser } from "../utils/verifyToken.js"; // Optional, verify user authentication

const router = express.Router();

// Route to book a room
router.post("/", verifyUser, bookRoom);

export default router;
