import User from "../models/user.model.js";

// All PRIVATE routes

async function getAllUsers(req, res) {
  res.send("Get All Users");
}

async function getSingleUser(req, res) {
  res.send("Get Single User");
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
