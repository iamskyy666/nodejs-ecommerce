import User from "../models/user.model.js";

const register = async (req, res) => {
  res.send("Register User!");
};

const login = async (req, res) => {
  res.send("Login User!");
};

const logout = async (req, res) => {
  res.send("Logout User!");
};

export { register, login, logout };
