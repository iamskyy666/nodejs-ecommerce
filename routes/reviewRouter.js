import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from "../controllers/reviewController.js";
import authenticateUser from "../middleware/authentication.js";

const reviewRouter = Router();

// ============================================================================
// Review Routes
// Base Route: /api/v1/reviews
// ============================================================================

// Public Routes
// ------------------------------------------------------------------
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:id", getSingleReview);

// Authenticated Routes
// ------------------------------------------------------------------
reviewRouter.post("/", authenticateUser, createReview);
reviewRouter.patch("/:id", authenticateUser, updateReview);
reviewRouter.delete("/:id", authenticateUser, deleteReview);

export default reviewRouter;
