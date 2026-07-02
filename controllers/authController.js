import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { attachCookiesToResp, createJWT } from "../utils/jwt.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  // first registered-user user must be an admin
  const isFirstAccount = (await User.countDocuments({})) === 0; // no users yet
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });

  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResp({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ registered_user: tokenUser, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
};

const logout = async (req, res) => {
  res.send("Logout User!");
};

export { register, login, logout };
