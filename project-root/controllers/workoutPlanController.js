// routes/workoutPlans.js
const express = require("express");
const WorkoutPlan = require("../models/WorkoutPlan");
const User = require("../models/userModel");
const upload = require("../middlewares/multer");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const fs = require('fs').promises;

// @desc    Create workout plan
// @route   POST /api/workoutPlans
// @access  Creator
const createWorkoutPlan = async (req, res) => {
  try {
    const {
      goal,
      planName,
      description,
      difficulty,
      totalDuration,
      tags,
      videoPreview,
      planType,
      price,
      features
    } = req.body;

    let imageUrl = '';
    let imagePublicId = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file, 'workout-plans');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
        
        // Delete the temporary file
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const newPlan = new WorkoutPlan({
      creatorId: req.user.id,
      creatorName: req.user.name,
      goal,
      planName,
      description,
      difficulty,
      totalDuration,
      tags: tags ? tags.split(",") : [],
      image: imageUrl,
      imagePublicId: imagePublicId,
      videoPreview,
      planType: planType || 'regular',
      price: planType === 'premium' ? price : 0,
      features: features ? features.split(',') : [],
      isPublished: false
    });

    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    console.error("Error creating plan:", err);
    res.status(500).json({ error: "Failed to create plan" });
  }
};

// @desc    Get creator's workout plans
// @route   GET /api/workoutPlans/creator
// @access  Creator
const getCreatorWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ creatorId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (err) {
    console.error("Error fetching creator workout plans:", err);
    res.status(500).json({ error: "Failed to fetch workout plans" });
  }
};

// @desc    Get single workout plan for creator
// @route   GET /api/workoutPlans/creator/:id
// @access  Creator
const getCreatorWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      creatorId: req.user.id
    });
    
    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }
    
    res.status(200).json(plan);
  } catch (err) {
    console.error("Error fetching workout plan:", err);
    res.status(500).json({ error: "Failed to fetch workout plan" });
  }
};

// @desc    Add exercise(s) to a specific day in a workout plan
// @route   PUT /api/workoutPlans/:planId/day/:dayName
// @access  Creator
const addExercisesToDay = async (req, res) => {
  const { planId, dayName } = req.params;
  const { exercises } = req.body;

  if (!["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(dayName.toLowerCase())) {
    return res.status(400).json({ error: "Invalid day name" });
  }

  try {
    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    plan.weeklyPlan[dayName.toLowerCase()] = exercises;
    plan.updatedAt = new Date();
    await plan.save();

    res.status(200).json({ message: `Exercises added to ${dayName}`, plan });
  } catch (err) {
    console.error("Error updating workout plan day:", err);
    res.status(500).json({ error: "Failed to add exercises to day" });
  }
};


// @desc    Edit a specific exercise in a day's plan
// @route   PUT /api/workoutPlans/:planId/day/:dayName/:exerciseIndex
const editExerciseInDay = async (req, res) => {
  const { planId, dayName, exerciseIndex } = req.params;
  const updatedExercise = req.body;

  try {
    const plan = await WorkoutPlan.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const day = plan.weeklyPlan[dayName.toLowerCase()];
    if (!day || !day[exerciseIndex]) return res.status(404).json({ error: "Exercise not found in given day" });

    plan.weeklyPlan[dayName.toLowerCase()][exerciseIndex] = updatedExercise;
    plan.updatedAt = new Date();
    await plan.save();

    res.status(200).json({ message: "Exercise updated", plan });
  } catch (err) {
    console.error("Error editing exercise:", err);
    res.status(500).json({ error: "Failed to edit exercise" });
  }
};


// @desc    Delete an exercise from a day's plan
// @route   DELETE /api/workoutPlans/:planId/day/:dayName/:exerciseIndex
const deleteExerciseFromDay = async (req, res) => {
  const { planId, dayName, exerciseIndex } = req.params;

  try {
    const plan = await WorkoutPlan.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const day = plan.weeklyPlan[dayName.toLowerCase()];
    if (!day || !day[exerciseIndex]) return res.status(404).json({ error: "Exercise not found" });

    plan.weeklyPlan[dayName.toLowerCase()].splice(exerciseIndex, 1);
    plan.updatedAt = new Date();
    await plan.save();

    res.status(200).json({ message: "Exercise deleted", plan });
  } catch (err) {
    console.error("Error deleting exercise:", err);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
};



const getWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ creatorId: req.user.id });
    res.status(200).json(plans);
  } catch (err) {
    console.error("Error fetching workout plans:", err);
    res.status(500).json({ error: "Failed to fetch workout plans" });
  }
};

// @desc    Update workout plan
// @route   PUT /api/workoutPlans/:id
// @access  Creator
const updateWorkoutPlan = async (req, res) => {
  try {
    const { 
      goal, 
      planName, 
      description, 
      difficulty, 
      totalDuration, 
      tags, 
      videoPreview,
      planType,
      price,
      features
    } = req.body;

    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      creatorId: req.user.id
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    const updateData = {
      goal,
      planName,
      description,
      difficulty,
      totalDuration,
      tags: tags ? tags.split(",") : [],
      videoPreview,
      planType: planType || 'regular',
      price: planType === 'premium' ? price : 0,
      features: features ? features.split(',') : [],
      updatedAt: new Date()
    };

    // Handle new image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (plan.imagePublicId) {
          await deleteFromCloudinary(plan.imagePublicId);
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file, 'workout-plans');
        updateData.image = uploadResult.secure_url;
        updateData.imagePublicId = uploadResult.public_id;
        
        // Delete the temporary file
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedPlan);
  } catch (err) {
    console.error("Error updating workout plan:", err);
    res.status(500).json({ error: "Failed to update workout plan" });
  }
};

// @desc    Delete workout plan
// @route   DELETE /api/workoutPlans/:id
// @access  Creator
const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      creatorId: req.user.id
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    // Delete image from Cloudinary if exists
    if (plan.imagePublicId) {
      try {
        await deleteFromCloudinary(plan.imagePublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await WorkoutPlan.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: "Workout plan deleted successfully",
      deletedPlan: plan.planName
    });
  } catch (err) {
    console.error("Error deleting workout plan:", err);
    res.status(500).json({ error: "Failed to delete workout plan" });
  }
};

// @desc    Publish/Unpublish workout plan
// @route   PUT /api/workoutPlans/:id/publish
// @access  Creator
const togglePublishWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      creatorId: req.user.id
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    plan.isPublished = !plan.isPublished;
    plan.updatedAt = new Date();
    await plan.save();

    res.status(200).json({ 
      message: `Workout plan ${plan.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: plan.isPublished
    });
  } catch (err) {
    console.error("Error toggling publish status:", err);
    res.status(500).json({ error: "Failed to toggle publish status" });
  }
};

// @desc    Get all published workout plans for users
// @route   GET /api/workoutPlans/public
// @access  Public/User
const getPublishedWorkoutPlans = async (req, res) => {
  try {
    const { goal, difficulty, planType, search } = req.query;
    
    let query = { isPublished: true };
    
    if (goal) query.goal = goal;
    if (difficulty) query.difficulty = difficulty;
    if (planType) query.planType = planType;
    if (search) {
      query.$or = [
        { planName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const plans = await WorkoutPlan.find(query)
      .sort({ avgRating: -1, totalPurchases: -1 });

    // If user is logged in, track viewed plans
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { lastViewedWorkoutPlans: Date.now() }
      });
    }

    res.status(200).json(plans);
  } catch (err) {
    console.error("Error fetching published workout plans:", err);
    res.status(500).json({ error: "Failed to fetch workout plans" });
  }
};

// @desc    Get single published workout plan
// @route   GET /api/workoutPlans/public/:id
// @access  Public/User
const getPublishedWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      isPublished: true
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    // If user is logged in, track that they viewed this plan
    if (req.user) {
      try {
        await User.findByIdAndUpdate(req.user.id, {
          $addToSet: { viewedWorkoutPlans: plan._id }
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }

    // Return limited data for premium plans if not purchased
    let responseData = { ...plan.toObject() };
    
    if (plan.planType === 'premium') {
      if (req.user) {
        try {
          const user = await User.findById(req.user.id);
          const hasPurchased = user.purchasedWorkoutPlans?.some(p => p.planId.equals(plan._id));
          
          if (!hasPurchased) {
            // Remove premium content for non-purchasers
            if (responseData.weeklyPlan) {
              Object.keys(responseData.weeklyPlan).forEach(day => {
                if (responseData.weeklyPlan[day].length > 1) {
                  responseData.weeklyPlan[day] = [responseData.weeklyPlan[day][0] + " (Premium content locked)"];
                }
              });
            }
          }
        } catch (error) {
          console.error('Error checking user purchase:', error);
        }
      } else {
        // Remove premium content for non-logged users
        if (responseData.weeklyPlan) {
          Object.keys(responseData.weeklyPlan).forEach(day => {
            responseData.weeklyPlan[day] = ["Premium content - Login required"];
          });
        }
      }
    }

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching workout plan:", err);
    res.status(500).json({ error: "Failed to fetch workout plan" });
  }
};

// @desc    Purchase workout plan
// @route   POST /api/workoutPlans/:id/purchase
// @access  User
const purchaseWorkoutPlan = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Please log in to purchase this workout plan" });
    }

    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      isPublished: true
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (plan.planType === 'regular') {
      return res.status(400).json({ error: "Regular plans are free to access" });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if already purchased
    const alreadyPurchased = user.purchasedWorkoutPlans?.some(p => p.planId.equals(plan._id));
    if (alreadyPurchased) {
      return res.status(400).json({ error: "Workout plan already purchased" });
    }

    // Add plan to user's purchased plans
    if (!user.purchasedWorkoutPlans) {
      user.purchasedWorkoutPlans = [];
    }
    
    user.purchasedWorkoutPlans.push({
      planId: plan._id,
      purchasedAt: Date.now(),
      progress: 0,
      currentWeek: 1
    });

    await user.save();

    // Update plan's total purchases
    plan.totalPurchases = (plan.totalPurchases || 0) + 1;
    await plan.save();

    res.status(200).json({
      message: "Workout plan purchased successfully",
      plan: {
        _id: plan._id,
        planName: plan.planName,
        price: plan.price
      }
    });
  } catch (err) {
    console.error("Error purchasing workout plan:", err);
    res.status(500).json({ error: "Failed to purchase workout plan" });
  }
};

module.exports = {
  createWorkoutPlan,
  addExercisesToDay,
  editExerciseInDay,
  deleteExerciseFromDay,
  getCreatorWorkoutPlans,
  getCreatorWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  togglePublishWorkoutPlan,
  getPublishedWorkoutPlans,
  getPublishedWorkoutPlanById,
  purchaseWorkoutPlan
};
