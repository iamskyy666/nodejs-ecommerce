// ============================================================================
// Product Controller
// Handles product management operations.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import crypto from "crypto";
import path from "path";

// ES Modules don't support __dirname directly.
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
async function createProduct(req, res) {
  // Associate the product with the authenticated admin.
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({
    created_product: product,
  });
}

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
async function getAllProducts(_, res) {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({
    msg: `✅ Fetched all ${products.length} product(s) successfully!`,
    all_products: products,
  });
}

// @desc    Get a single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
async function getSingleProduct(req, res) {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    throw new NotFoundError("🔴 Product not found!");
  }

  res.status(StatusCodes.OK).json({
    product,
  });
}

// @desc    Update a product
// @route   PATCH /api/v1/products/:id
// @access  Private/Admin
async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    throw new NotFoundError("🔴 Product not found!");
  }

  res.status(StatusCodes.OK).json({
    updated_product: product,
  });
}

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new NotFoundError("🔴 Product not found!");
  }

  await product.deleteOne();

  res.status(StatusCodes.OK).json({
    msg: "🟢 Product removed successfully!",
  });
}

// @desc    Upload a product image
// @route   POST /api/v1/products/upload-image
// @access  Private/Admin
async function uploadProductImage(req, res) {
  //!🔹 Check if an image was uploaded
  if (!req.files || !req.files.image) {
    throw new BadRequestError("🔴 No image uploaded!");
  }

  //!🔹 Grab the uploaded image
  const productImage = req.files.image;

  //!🔹 Ensure it's an image
  if (!productImage.mimetype.startsWith("image/")) {
    throw new BadRequestError("🔴 Please upload an image!");
  }

  //!🔹 Ensure it's <= 1 MB
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("🔴 Image size should not exceed 1 MB!");
  }

  //!🔹 Generate a unique filename
  const fileName = `${crypto.randomUUID()}-${productImage.name}`;

  //!🔹 Absolute path where the image will be saved
  const imagePath = path.join(__dirname, "../public/uploads", fileName);

  //!🔹 Move the image
  await productImage.mv(imagePath);

  //!🔹 Send response
  res.status(StatusCodes.OK).json({
    msg: "🟢 Image uploaded successfully!",
    image: `/uploads/${fileName}`,
  });
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};

//🧪 testing/reference - console.log(req.files); // raw image-file
//OUTPUT:
/*
[Object: null prototype] {
  image: {
    name: 'Batman-Logo-Wallpaper-HD-Free-download.jpg',
    data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 06 04 05 06 05 04 06 06 05 06 07 07 06 08 0a 10 0a 0a 09 09 0a 14 0e 0f 0c ... 49101 more bytes>,
    size: 49151,
    encoding: '7bit',
    tempFilePath: '',
    truncated: false,
    mimetype: 'image/jpeg',
    md5: '5f05f04ca2babf5d6f11446ede3edad3',
    mv: [Function: mv]
  }
}
*/
