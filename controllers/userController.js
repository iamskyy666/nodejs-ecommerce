// ============================================================================
// User Controller
// Handles user management operations.
// All routes in this controller are private.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import createTokenUser from "../utils/createTokenUser.js";
import { attachCookiesToResp } from "../utils/jwt.js";
import checkPermissions from "../utils/checkPermissions.js";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
async function getAllUsers(req, res) {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({
    msg: "🟢 Fetched all users successfully!",
    allUsers: users,
  });
}

// @desc    Get a single user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
async function getSingleUser(req, res) {
  const userId = req.params.id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundError("🔴 User not found!");
  }

  // Ensure the authenticated user has permission to access this resource.
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({
    user,
  });
}

// @desc    Show currently authenticated user
// @route   GET /api/v1/users/show-me
// @access  Private
async function showCurrentUser(req, res) {
  // User information is already attached to req.user by the authentication middleware.
  res.status(StatusCodes.OK).json({
    current_user: req.user,
  });
}

// @desc    Update current user's profile
// @route   PATCH /api/v1/users/update-user
// @access  Private
async function updateUser(req, res) {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("🔴 Please provide all values!");
  }

  // Find the currently authenticated user.
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new NotFoundError("🔴 User not found!");
  }

  // Update user information.
  user.email = email;
  user.name = name;

  await user.save();

  // Generate a new JWT payload and refresh the authentication cookie.
  const tokenUser = createTokenUser(user);
  attachCookiesToResp({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.OK).json({
    updated_user: tokenUser,
  });
}

// @desc    Update current user's password
// @route   PATCH /api/v1/users/update-user-password
// @access  Private
async function updateUserPassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError(
      "🔴 Please provide both the old and new password!",
    );
  }

  // Find the authenticated user.
  const user = await User.findById(req.user.userId);

  // Verify the old password.
  const isPasswordValid = await user.comparePassword(oldPassword);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  // Update the password.
  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "🟢 Password updated successfully!",
  });
}

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
