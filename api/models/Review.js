import mongoose from "mongoose";

// Define the Reply Schema for comments
const ReplySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Define the Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    replies: [ReplySchema],  // Adding the replies field
  },
  { timestamps: true }
);

// Define the Review Schema
const ReviewSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: [CommentSchema],  // Embedding CommentSchema here
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
