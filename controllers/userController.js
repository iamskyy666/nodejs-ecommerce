import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

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
  res.status(StatusCodes.OK).json({ current_user: req.user });
}

async function updateUser(req, res) {
  res.send("Update User");
}

async function updateUserPassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError(
      "🔴 Please provide both, the old and the new password!",
    );
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordValid = await user.comparePassword(oldPassword);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("🔴 Invalid Credentials.");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "🟢 Password updated successfully!" });
}

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
};
