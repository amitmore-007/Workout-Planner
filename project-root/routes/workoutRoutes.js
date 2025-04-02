const express = require("express");
const { getUserWorkouts } = require("../controllers/workoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/todays", protect, getUserWorkouts); // Protected route

module.exports = router;


// const express = require('express');
// const { getTodaysWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout,refreshSingleWorkout,refreshWorkoutSet } = require('../controllers/workoutController');
// const { protect} = require('../middlewares/authMiddleware');

// const router = express.Router();

// router.get('/todays', protect, getTodaysWorkouts);
//  // Get all workouts (with filters)
// router.get('/:id', getWorkoutById);
// router.get('/refresh', protect, refreshSingleWorkout);
//  // Get a single workout
//  router.get('/refresh-set', protect, refreshWorkoutSet);

// // Admin Routes
// router.post('/', protect, createWorkout); // Create a workout
// router.put('/:id', protect, updateWorkout); // Update a workout
// router.delete('/:id', protect, deleteWorkout); // Delete a workout

// module.exports = router;
