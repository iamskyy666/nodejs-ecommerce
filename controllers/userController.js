import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import NotFoundError from "../errors/not-found.js";

// All PRIVATE routes

async function getAllUsers(req, res) {
  console.log(req.user); // { name: 'skyy', userId: '6a4667deef85a1867053a02e', role: 'admin' }
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
  // Just get the user from the token
  // No need to query the DB
  res.status(StatusCodes.OK).json({current_user:req.user})
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
