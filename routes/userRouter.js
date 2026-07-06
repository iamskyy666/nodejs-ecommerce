import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import authenticateUser from "../middleware/authentication.js";
import authorizePermissions from "../middleware/authorization.js";

const userRouter = Router();

// ============================================================================
// User Routes
// Base Route: /api/v1/users
// ============================================================================

// Admin Routes
// ------------------------------------------------------------------

authRouter.get(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  getAllUsers,
);

// User Routes
// ------------------------------------------------------------------

userRouter.get("/show-me", authenticateUser, showCurrentUser);

userRouter.patch("/update-user", authenticateUser, updateUser);

userRouter.patch("/update-user-password", authenticateUser, updateUserPassword);

// Keep dynamic routes at the bottom.
userRouter.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  getSingleUser,
);

export default userRouter;
