// routes/workoutPlans.js
const express = require("express");

const WorkoutPlan = require("../models/WorkoutPlan");
const upload = require("../middlewares/multer"); // if using multer for image

const createWorkoutPlan =  async (req, res) => {
  try {
    const {
      creatorId,
      creatorName,
      goal,
      planName,
      description,
      difficulty,
      totalDuration,
      tags,
      videoPreview,
    } = req.body;

    const newPlan = new WorkoutPlan({
      creatorId,
      creatorName,
      goal,
      planName,
      description,
      difficulty,
      totalDuration,
      tags: tags ? tags.split(",") : [],
      image: req.file ? req.file.path : "",
      videoPreview,
    });

    await newPlan.save();
    res.status(200).json(newPlan);
  } catch (err) {
    console.error("Error creating plan:", err);
    res.status(500).json({ error: "Failed to create plan" });
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




module.exports = {
  createWorkoutPlan,
  addExercisesToDay,
  editExerciseInDay,
  deleteExerciseFromDay,
};
