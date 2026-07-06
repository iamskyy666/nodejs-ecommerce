// ============================================================================
// Review Model
// Defines user reviews and ratings associated with products.
// ============================================================================

import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "🔴 Please provide a rating!"],
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating cannot exceed 5."],
    },

    title: {
      type: String,
      required: [true, "🔴 Please provide a review title!"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters."],
    },

    comment: {
      type: String,
      required: [true, "🔴 Please provide a review comment!"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters."],
    },

    // User who wrote the review
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product being reviewed
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//💡 User can leave only 1 review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
