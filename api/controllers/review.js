import Review from "../models/Review.js";
import cloudinary from "../utils/cloudinaryConfig.js";  // Cloudinary config
import { createError } from "../utils/error.js";

// Create a review (with image/video upload)
export const createReview = async (req, res, next) => {
  try {
    const uploadedFile = req.file;  // File uploaded using multer

    let mediaUrl = '';
    if (uploadedFile) {
      const cloudinaryResult = await cloudinary.v2.uploader.upload(uploadedFile.path, {
        resource_type: "auto",  // Detect media type (image/video)
      });
      mediaUrl = cloudinaryResult.secure_url;  // Store Cloudinary URL
    }

    const newReview = new Review({
      hotelId: req.params.hotelId,
      userId: req.body.userId,
      reviewText: req.body.reviewText,
      rating: req.body.rating,
      media: mediaUrl,  // Store media URL
    });

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

// Add a reply to a comment
export const addReplyToComment = async (req, res, next) => {
  try {
    const { reviewId, commentId } = req.params;
    const { userId, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return next(createError(404, "Review not found"));

    const commentToUpdate = review.comments.id(commentId);
    if (!commentToUpdate) return next(createError(404, "Comment not found"));

    const newReply = {
      userId: userId,
      comment: comment,
    };

    commentToUpdate.replies.push(newReply);
    await review.save();

    res.status(200).json({ message: "Reply added successfully", comment: commentToUpdate });
  } catch (err) {
    next(err);
  }
};

// Get reviews for a hotel
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId })
      .populate("userId", "username")
      .populate("comments.userId", "username")
      .exec();

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};
