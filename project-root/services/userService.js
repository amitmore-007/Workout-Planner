const User = require("../models/userModel");

exports.getAllUsers = async () => {
  return await User.find();
};

exports.createUser = async (userData) => {
  return await User.create(userData);
};
