// services/user.service.js
const User = require("../models/user.model.js");

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUserRole = async (userId, role) => {
  return await User.findByIdAndUpdate(userId, { role }, { new: true });
};

const getAllVendors = async () => {
  return await User.find({ role: "vendor" });
};

const getUserById = async (id) => {
  return await User.findById(id);
};

module.exports = { findUserByEmail, createUser, updateUserRole, getAllVendors, getUserById };
