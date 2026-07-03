import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import NotFoundError from "../errors/not-found.js";

// All PRIVATE routes

async function getAllUsers(_, res) {
  const users = await User.find({ role: "user" }).select("-password");
  res
    .status(StatusCodes.OK)
    .json({ msg: "🟢 Fetched all users with user-roles!", allUsers: users });
}

async function getSingleUser(req, res) {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundError("🔴 User not found!"); // custom-error
  }
  res.status(StatusCodes.OK).json({ user: user });
}

async function showCurrentUser(req, res) {
  res.send("Show Current User");
}

async function updateUser(req, res) {
  res.send("Update User");
}

async function updateUserPassword(req, res) {
  res.send("Update User Password");
}

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
};
