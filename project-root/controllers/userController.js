const User = require("../models/userModel");
const { generateToken, hashPassword, comparePassword } = require("../utils/auth");
const asyncHandler = require("express-async-handler");

// @desc Register a new user
// @route POST /api/users/register
// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password, weight, height, goal } = req.body;

//         if (!name || !email || !password || !goal) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await hashPassword(password);
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             weight,
//             height,
//             goal,
//         });

//         res.status(201).json({
//             _id: newUser._id,
//             name: newUser.name,
//             email: newUser.email,
//             token: generateToken(newUser._id),
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

const register = asyncHandler(async (req, res) => {
  const { name, email, password, weight, height, goal, activityLevel, dietPreference, fitnessExperience } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
      res.status(400);
      throw new Error("User already exists");
  }

  const user = await User.create({
      name,
      email,
      password,
      weight,
      height,
      goal,
      activityLevel,
      dietPreference,
      fitnessExperience
  });

  if (user) {
      res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          weight: user.weight,
          height: user.height,
          goal: user.goal,
          activityLevel: user.activityLevel,
          dietPreference: user.dietPreference,
          fitnessExperience: user.fitnessExperience,
          token: generateToken(user._id),
      });
  } else {
      res.status(400);
      throw new Error("Invalid user data");
  }
});


// @desc Login user
// @route POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
      res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          weight: user.weight,
          height: user.height,
          goal: user.goal,
          activityLevel: user.activityLevel,
          dietPreference: user.dietPreference,
          fitnessExperience: user.fitnessExperience,
      });
  } else {
      res.status(404);
      throw new Error("User not found");
  }
});


module.exports = { register, loginUser, getUserProfile };
