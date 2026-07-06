// ============================================================================
// Review Controller
// Handles review management operations.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
async function createReview(req, res) {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findById(productId);

  // Check for non-existent product.
  if (!isValidProduct) {
    throw new NotFoundError(`🔴 No product with ID: ${productId}`);
  }

  // Check is for already submitted review for the product.
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new BadRequestError(`🔴 Already submitted review for this product!`);
  }

  // Finally, submit review
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ created_review: review });
}

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
async function getAllReviews(req, res) {
  res.send("getAllReviews()");
}

// @desc    Get a single review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
async function getSingleReview(req, res) {
  res.send("getSingleReview()");
}

// @desc    Update a review
// @route   PATCH /api/v1/reviews/:id
// @access  Private
async function updateReview(req, res) {
  res.send("updateReview()");
}

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
async function deleteReview(req, res) {
  res.send("deleteReview()");
}

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
