const Creator = require("../models/creatorModel");
const { generateToken, hashPassword, comparePassword } = require("../utils/auth");
const asyncHandler = require("express-async-handler");

// @desc    Register Creator
// @route   POST /api/creator/register
const registerCreator = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Creator.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Creator already exists");
  }

  const hashedPassword = await hashPassword(password);
  const newCreator = new Creator({ name, email, password: hashedPassword });

  await newCreator.save();

  res.status(201).json({ msg: "Creator registered successfully" });
});

// @desc    Login Creator
// @route   POST /api/creator/login
const loginCreator = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const creator = await Creator.findOne({ email });
  if (!creator) {
    res.status(400);
    throw new Error("Creator not found");
  }

  const isMatch = await comparePassword(password, creator.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: creator._id, role: "creator" });

  res.json({
    token,
    creator: {
      id: creator._id,
      name: creator.name,
      email: creator.email,
    },
  });
});

module.exports = {
  registerCreator,
  loginCreator,
};
