// ============================================================================
// Product Model
// Defines products available in the e-commerce catalog.
// ============================================================================

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "🔴 Please provide product name!"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters."],
    },

    price: {
      type: Number,
      required: [true, "🔴 Please provide product price!"],
      min: [0, "Price cannot be negative."],
      default: 0,
    },

    description: {
      type: String,
      required: [true, "🔴 Please provide product description!"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters."],
    },

    image: {
      type: String,
      required: [true, "🔴 Please provide product image!"],
      default: "/uploads/example.jpeg",
    },

    category: {
      type: String,
      required: [true, "🔴 Please provide product category!"],
      enum: {
        values: [
          "office",
          "kitchen",
          "bedroom",
          "living room",
          "gaming",
          "outdoor",
          "electronics",
        ],
        message: "{VALUE} is not a supported category.",
      },
      lowercase: true,
      trim: true,
    },

    company: {
      type: String,
      required: [true, "🔴 Please provide company name!"],
      enum: {
        values: ["ikea", "liddy", "marcos", "apple", "samsung", "sony"],
        message: "{VALUE} is not a supported company.",
      },
      lowercase: true,
      trim: true,
    },

    colors: {
      type: [String],
      required: true,
      default: ["#222"],
      //   validate: {
      //     validator(value) {
      //       return value.length > 0;
      //     },
      //     message: "Please provide at least one color.",
      //   },
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      required: [true, "🔴 Please provide inventory count!"],
      min: [0, "Inventory cannot be negative."],
      default: 10,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId, // foreign-key
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: { rating: 5 }, //! Optional.
});

// Make sure the deleting a product deletes all related reviews too.
ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({
      product: this._id,
    });
  },
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
