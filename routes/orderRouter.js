// ============================================================================
// Order Routes
// Base Route: /api/v1/orders
// ============================================================================

import { Router } from "express";

import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} from "../controllers/orderController.js";

import authenticateUser from "../middleware/authentication.js";
import authorizePermissions from "../middleware/authorization.js";

const orderRouter = Router();

// All order routes require authentication
orderRouter.use(authenticateUser);

// ============================================================================
// Order Routes
// ============================================================================

// Get all orders (Admin only)
// Create new order
orderRouter
  .route("/")
  .get(authorizePermissions("admin"), getAllOrders)
  .post(createOrder);

// Get current user's orders
orderRouter.route("/my-orders").get(getCurrentUserOrders);

// Get single order
// Update order
orderRouter.route("/:id").get(getSingleOrder).patch(updateOrder);

export default orderRouter;
