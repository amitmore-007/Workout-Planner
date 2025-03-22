const User = require("../models/userModel");
const { generateToken, hashPassword, comparePassword } = require("../utils/auth");
const asyncHandler = require("express-async-handler");


const register = asyncHandler(async (req, res) => {
  const { name, email, password, weight, height, goal, activityLevel, dietPreference, fitnessExperience } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
      res.status(400);
      throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
      name,
      email,
      password: hashedPassword,  // ✅ Store hashed password
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
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log("Login attempt:", email, password);  // Debugging

//         const user = await User.findOne({ email });
//         if (!user) {
//             console.log("User not found");  // Debugging
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const isMatch = await comparePassword(password, user.password);
//         console.log("Password match:", isMatch);  // Debugging

//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             token: generateToken(user._id),
//         });
//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ Include all user data in response
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            weight: user.weight,
            height: user.height,
            goal: user.goal,
            activityLevel: user.activityLevel,
            dietPreference: user.dietPreference,
            fitnessExperience: user.fitnessExperience,
            token: generateToken(user._id),  // ✅ Ensure token is included
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc Get user profile
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (user) {
//       res.json({
//           _id: user.id,
//           name: user.name,
//           email: user.email,
//           weight: user.weight,
//           height: user.height,
//           goal: user.goal,
//           activityLevel: user.activityLevel,
//           dietPreference: user.dietPreference,
//           fitnessExperience: user.fitnessExperience,
//       });
//   } else {
//       res.status(404);
//       throw new Error("User not found");
//   }
// });

const getUserProfile = asyncHandler(async (req, res) => {
    console.log("User from Token:", req.user); // Debugging Line
  
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    console.log("Fetched User Data:", user); // Debugging Line
  
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
  });
  


module.exports = { register, loginUser, getUserProfile };
