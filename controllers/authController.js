// ============================================================================
// Auth Controller
// Handles user registration, authentication and logout.
// ============================================================================

import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { attachCookiesToResp } from "../utils/jwt.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import createTokenUser from "../utils/createTokenUser.js";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // First registered account becomes the administrator.
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // Create user in the database.
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create the JWT payload.
  const tokenUser = createTokenUser(user);

  // Generate JWT & attach it as an HTTP-only cookie.
  const token = attachCookiesToResp({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
    token,
  });
};

// @desc    Authenticate user & login
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body.
  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password.");
  }

  // Find user by email.
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  // Compare supplied password with the stored hashed password.
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  // Create the JWT payload.
  const tokenUser = createTokenUser(user);

  // Generate JWT & attach it as an HTTP-only cookie.
  const token = attachCookiesToResp({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token,
  });
};

// @desc    Logout current user
// @route   GET /api/v1/auth/logout
// @access  Public
const logout = async (req, res) => {
  // Overwrite the authentication cookie and expire it immediately.
  res.cookie("token", "logout", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    msg: "User logged out! 🟢",
  });
};

export { register, login, logout };
