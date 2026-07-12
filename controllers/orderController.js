// ============================================================================
// Order Controller
// Handles order management operations.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import Order from "../models/order.model.js";

// fake STRIPE implementation
async function fakeStripeAPI({ amount, currency }) {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
}

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
async function getAllOrders(req, res) {
  res.status(StatusCodes.OK).send("getAllOrders");
}

// @desc    Get current user's orders
// @route   GET /api/v1/orders/showAllMyOrders
// @access  Private
async function getCurrentUserOrders(req, res) {
  res.status(StatusCodes.OK).send("getCurrentUserOrders");
}

// @desc    Get a single order
// @route   GET /api/v1/orders/:id
// @access  Private
async function getSingleOrder(req, res) {
  res.status(StatusCodes.OK).send("getSingleOrder");
}

// @desc    Create a new order
// @route   POST /api/v1/orders
// @access  Private
async function createOrder(req, res) {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("🔴 No cart-items provided!");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("🔴 Please provide both tax and shipping-fee!");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new BadRequestError(`🔴 No product with id: ${item.product}!`);
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    // add item to order
    orderItems = [...orderItems, singleOrderItem];

    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;

  // get client secret - fake stripe implementation
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  // finally, create the order
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({
      message: "✅ Order placed successfully!",
      order,
      clientSecret: order.clientSecret,
    });
}

// @desc    Update an order
// @route   PATCH /api/v1/orders/:id
// @access  Private
async function updateOrder(req, res) {
  res.status(StatusCodes.OK).send("updateOrder");
}

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
