import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { attachCookiesToResp } from "../utils/jwt.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // First registered user becomes admin
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const tokenUser = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };

  const token = attachCookiesToResp({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  // compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("🔴 Invalid credentials.");
  }

  const tokenUser = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };

  const token = attachCookiesToResp({
    res,
    user: tokenUser,
  });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token,
  });
};

const logout = async (req, res) => {
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
