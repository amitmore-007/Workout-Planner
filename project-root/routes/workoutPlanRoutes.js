const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require("../middlewares/authMiddleware");
const User = require('../models/userModel');
const WorkoutPlan = require('../models/WorkoutPlan');

// Get all workout plans (with personalization if user is logged in)
router.get('/', optionalProtect, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find();
    
    if (req.user) {
      // Track that user viewed the plans page
      await User.findByIdAndUpdate(req.user.id, { 
        $set: { lastViewedPlans: Date.now() } 
      });
      
      // Return personalized plans first
      const personalized = await matchPlansToUser(plans, req.user);
      return res.json({ 
        plans, 
        personalizedPlans: personalized 
      });
    }
    
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific workout plan
router.get('/:id', optionalProtect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    if (req.user) {
      // Track that user viewed this plan
      await User.findByIdAndUpdate(req.user.id, { 
        $addToSet: { viewedPlans: plan._id } 
      });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase a workout plan
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    const user = await User.findById(req.user.id);
    
    // Check if already purchased
    if (user.purchasedPlans.some(p => p.equals(plan._id))) {
      return res.status(400).json({ message: 'Plan already purchased' });
    }
    
    // In a real app, you would process payment here
    
    // Add plan to user's purchased plans
    user.purchasedPlans.push({
      plan: plan._id,
      purchasedAt: Date.now(),
      progress: 0
    });
    
    await user.save();
    
    res.json({ 
      message: 'Plan purchased successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to match plans to user
async function matchPlansToUser(plans, user) {
  return plans.filter(plan => {
    // Match goal
    const goalMatch = user.goal 
      ? plan.goal.toLowerCase().includes(user.goal.toLowerCase())
      : true;
    
    // Match fitness level
    const levelMatch = user.fitnessExperience
      ? plan.difficulty.toLowerCase() === user.fitnessExperience.toLowerCase()
      : true;
    
    return goalMatch && levelMatch;
  }).map(plan => ({
    ...plan.toObject(),
    matchScore: calculateMatchScore(plan, user)
  })).sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(plan, user) {
  let score = 0;
  
  // Goal match
  if (user.goal && plan.goal.toLowerCase() === user.goal.toLowerCase()) score += 40;
  else if (user.goal && plan.goal.toLowerCase().includes(user.goal.toLowerCase())) score += 30;
  
  // Level match
  if (user.fitnessExperience && plan.difficulty.toLowerCase() === user.fitnessExperience.toLowerCase()) score += 30;
  
  return score;
}

module.exports = router;