import { Router } from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/show-me", showCurrentUser);
userRouter.patch("/update-user", updateUser);
userRouter.patch("/update-user-password", updateUserPassword);
//! /:id - should always be at the bottom
userRouter.get("/:id", getSingleUser);

export default userRouter;
