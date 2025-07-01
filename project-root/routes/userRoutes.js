const express = require("express");
const { register, loginUser, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const User = require('../models/userModel');


const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

router.get('/me/plans', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('purchasedPlans.plan')
      .populate('viewedPlans');
    
    res.json({
      purchasedPlans: user.purchasedPlans,
      viewedPlans: user.viewedPlans
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/me/preferences', protect, async (req, res) => {
  try {
    const { goal, fitnessExperience, activityLevel } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { goal, fitnessExperience, activityLevel },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
