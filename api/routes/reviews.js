import express from "express";
import { createReview, addComment, getReviews } from "../controllers/review.js";
import { addReplyToComment } from "../controllers/review.js";  // Import the new controller function
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE REVIEW
router.post("/:hotelId", verifyUser, createReview);

// ADD COMMENT TO A REVIEW
router.post("/comment/:reviewId", verifyUser, addComment);

// GET REVIEWS FOR A HOTEL
router.get("/:hotelId", getReviews);

// Route for adding a reply to a comment
router.post("/reply/:reviewId/:commentId", verifyUser, addReplyToComment);


export default router;
