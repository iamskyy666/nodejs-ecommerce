// ============================================================================
// Review Controller
// Handles review management operations.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import checkPermissions from "../utils/checkPermissions.js";

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
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  res.status(StatusCodes.OK).json({
    msg: `Fetched all ${reviews.length} review(s)`,
    reviews,
  });
}

// @desc    Get a single review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
async function getSingleReview(req, res) {
  const review = await Review.findById(req.params.id)
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  if (!review) {
    throw new NotFoundError(`🔴 Review Not Found!`);
  }
  res.status(StatusCodes.OK).json({ fetched_review: review });
}

// @desc    Update a review
// @route   PATCH /api/v1/reviews/:id
// @access  Private
async function updateReview(req, res) {
  const { rating, title, comment } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new NotFoundError(`🔴 Review Not Found!`);
  }

  // check permissions
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "🟢 Review updated successfully!", updated_review: review });
}

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
async function deleteReview(req, res) {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new NotFoundError(`🔴 Review Not Found!`);
  }

  // check permissions
  checkPermissions(req.user, review.user);

  // await review.remove() // Old approach
  await review.deleteOne(); // Modern approach

  res
    .status(StatusCodes.OK)
    .json({ msg: "🟢 Review deleted successfully!", deleted_review: review });
}

// @desc    Get products with only 1 review
// @route   GET /api/products/:id/reviews
// @access  Public
async function getSingleProductReviews(req, res) {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new NotFoundError(`🔴 No product found with ID: ${productId}`);
  }

  const reviews = await Review.find({
    product: productId,
  }).populate({
    path: "user",
    select: "name",
  });

  res.status(StatusCodes.OK).json({
    count: reviews.length,
    reviews,
  });
}

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
