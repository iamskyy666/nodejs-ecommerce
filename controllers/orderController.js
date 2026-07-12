// ============================================================================
// Order Controller
// Handles order management operations.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import Order from "../models/order.model.js";
import checkPermissions from "../utils/checkPermissions.js";

// fake STRIPE implementation
async function fakeStripeAPI({ amount, currency }) {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
}

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
async function getAllOrders(req, res) {
  const orders = await Order.find({});
  res
    .status(StatusCodes.OK)
    .json({ msg: `Fetched All ${orders.length} order(s) ✅`, orders });
}

// @desc    Get current user's orders
// @route   GET /api/v1/orders/showAllMyOrders
// @access  Private
async function getCurrentUserOrders(req, res) {
  const orders = await Order.find({ user: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ "my-orders": orders, count: orders.length });
}

// @desc    Get a single order
// @route   GET /api/v1/orders/:id
// @access  Private
async function getSingleOrder(req, res) {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json(order);
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

  res.status(StatusCodes.CREATED).json({
    message: "✅ Order placed successfully!",
    order,
    clientSecret: order.clientSecret,
  });
}

// @desc    Update an order
// @route   PATCH /api/v1/orders/:id
// @access  Private
async function updateOrder(req, res) {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }

  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();
  res.status(StatusCodes.OK).json({ msg: "Order updated ✅", order });
}

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
