import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model.js";

async function createProduct(req, res) {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ created_product: product });
}

async function getAllProducts(req, res) {
  res.send("getAllProducts");
}

async function getSingleProduct(req, res) {
  res.send("getSingleProduct");
}

async function updateProduct(req, res) {
  res.send("updateProduct");
}

async function deleteProduct(req, res) {
  res.send("deleteProduct");
}

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
