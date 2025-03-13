const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getAllWorkouts, getWorkoutsByGoal, createWorkout, deleteWorkout } = require("../controllers/workoutController");

const router = express.Router();

router.get("/", getAllWorkouts); // Get all workouts (Public)
router.get("/my-goal", protect, getWorkoutsByGoal); // Get workouts based on user goal (Protected)
router.post("/create", protect, createWorkout); // Create a new workout (Protected)
router.delete("/:id", protect, deleteWorkout); // Delete a workout (Protected)

module.exports = router;
