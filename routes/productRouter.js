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

const productRouter = Router();

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getSingleProduct);

// Admin routes
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
