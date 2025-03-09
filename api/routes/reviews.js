import express from "express";
import { createReview, addComment, addReplyToComment, getReviews } from "../controllers/review.js";
import upload from "../utils/upload.js";  // Multer upload

const router = express.Router();

// Create review (with image/video upload)
router.post("/:hotelId",  upload.single("media"), createReview);

// Add comment to a review
router.post("/comment/:reviewId",  addComment);

// Get reviews for a hotel
router.get("/:hotelId", getReviews);

// Add a reply to a comment
router.post("/reply/:reviewId/:commentId",  upload.single("media"), addReplyToComment);

export default router;

