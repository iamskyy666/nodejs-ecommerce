/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Returns a list of all available products.
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 */

import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadProductImage,
} from "../controllers/productController.js";
import authenticateUser from "../middleware/authentication.js";
import authorizePermissions from "../middleware/authorization.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";

const productRouter = Router();

// ============================================================================
// Product Routes
// Base Route: /api/v1/products
// ============================================================================

// Public Routes
// ------------------------------------------------------------------

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getSingleProduct);

productRouter.get("/:id/reviews", getSingleProductReviews); //! from reviewController()

// Admin Routes
// ------------------------------------------------------------------

productRouter.post(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  createProduct,
);

productRouter.post(
  "/upload-image",
  authenticateUser,
  authorizePermissions("admin"),
  uploadProductImage,
);

productRouter.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateProduct,
);

productRouter.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  deleteProduct,
);

export default productRouter;
