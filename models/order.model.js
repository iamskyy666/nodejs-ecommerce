// ============================================================================
// Order Model
// Defines customer orders placed in the e-commerce application.
// ============================================================================

import mongoose from "mongoose";

const SingleOrderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "🔴 Please provide product name!"],
    },

    image: {
      type: String,
      required: [true, "🔴 Please provide product image!"],
    },

    price: {
      type: Number,
      required: [true, "🔴 Please provide product price!"],
      min: [0, "Price cannot be negative."],
    },

    amount: {
      type: Number,
      required: [true, "🔴 Please provide product quantity!"],
      min: [1, "Quantity must be at least 1."],
    },

    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "🔴 Please provide tax amount!"],
      min: 0,
    },

    shippingFee: {
      type: Number,
      required: [true, "🔴 Please provide shipping fee!"],
      min: 0,
    },

    subtotal: {
      type: Number,
      required: [true, "🔴 Please provide subtotal!"],
      min: 0,
    },

    total: {
      type: Number,
      required: [true, "🔴 Please provide total amount!"],
      min: 0,
    },

    orderItems: {
      type: [SingleOrderItemSchema],
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: "🔴 Order must contain at least one item!",
      },
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "delivered", "cancelled"],
      default: "pending",
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientSecret: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
