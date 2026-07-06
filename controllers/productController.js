import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model.js";
import NotFoundError from "../errors/not-found.js";

async function createProduct(req, res) {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ created_product: product });
}

async function getAllProducts(_, res) {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({
    msg: `✅ Fetched All ${products.length} Products Successfully!`,
    all_products: products,
  });
}

async function getSingleProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError("🔴 Product not found!");
  }
  res.status(StatusCodes.OK).json({
    product,
  });
}

async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!product) {
    throw new NotFoundError("🔴 Product not found!");
  }
  res.status(StatusCodes.OK).json({
    updated_product: product,
  });
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new NotFoundError("🔴 Product not found!");
  }

  res.status(StatusCodes.OK).json({
    msg: "🟢 Product removed successfully!",
  });
}

// later
async function uploadProductImage(req, res) {
  res.send("uploadProductImage");
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
