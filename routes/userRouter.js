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

userRouter.get(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  getAllUsers,
);
userRouter.get("/show-me", showCurrentUser);
userRouter.patch("/update-user", updateUser);
userRouter.patch("/update-user-password", updateUserPassword);
//! /:id - should always be at the bottom
userRouter.get("/:id", authenticateUser, authorizePermissions, getSingleUser);

export default userRouter;
