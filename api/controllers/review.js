import Review from "../models/Review.js";
import { createError } from "../utils/error.js";

// Add a review to a hotel
export const createReview = async (req, res, next) => {
  const newReview = new Review({
    hotelId: req.params.hotelId,
    userId: req.body.userId,
    reviewText: req.body.reviewText,
    rating: req.body.rating,
  });

  try {
    const savedReview = await newReview.save();
    res.status(200).json(savedReview);
  } catch (err) {
    next(err);
  }
};

// Add a comment to a review
export const addComment = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return next(createError(404, "Review not found"));

    const newComment = {
      userId: req.body.userId,
      comment: req.body.comment,
    };

    review.comments.push(newComment);
    await review.save();

    res.status(200).json("Comment added successfully");
  } catch (err) {
    next(err);
  }
};

// Get reviews for a hotel with comments
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId })
      .populate("userId", "username") // Populate the user data
      .populate("comments.userId", "username") // Populate user data for comments
      .exec();

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

// Add a reply to a comment
export const addReplyToComment = async (req, res, next) => {
  try {
    const { reviewId, commentId } = req.params;  // Extract reviewId and commentId from params
    const { userId, comment } = req.body;  // Extract userId and reply comment from request body

    // Find the review by reviewId
    const review = await Review.findById(reviewId);
    if (!review) return next(createError(404, "Review not found"));

    // Find the comment by commentId within the review
    const commentToUpdate = review.comments.id(commentId);
    if (!commentToUpdate) return next(createError(404, "Comment not found"));

    // Check if the comment already has 2 replies
    if (commentToUpdate.replies.length >= 2) {
      return next(createError(400, "A comment can have a maximum of 2 replies"));
    }

    // Add the reply to the comment
    const newReply = {
      userId: userId,
      comment: comment,
    };

    // Push the new reply to the comment's replies array
    commentToUpdate.replies.push(newReply);

    // Save the review with the new reply
    await review.save();

    res.status(200).json({ message: "Reply added successfully", comment: commentToUpdate });
  } catch (err) {
    next(err);
  }
};
