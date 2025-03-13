const asyncHandler = require("express-async-handler");
const Workout = require("../models/workoutModel");

// @desc Get all workouts
// @route GET /api/workouts
const getAllWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find();
        console.log("🔹 All workouts fetched:", workouts);

        res.status(200).json(workouts);
    } catch (error) {
        console.error("❌ Error fetching workouts:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc Get workouts based on user goal
// @route GET /api/workouts/my-goal
const getWorkoutsByGoal = asyncHandler(async (req, res) => {
    const { goal } = req.user; // Get user's goal from authentication
    const workouts = await Workout.find({ goal });
    
    if (!workouts.length) {
        return res.status(404).json({ message: "No workouts found for your goal" });
    }

    res.json(workouts);
});

// @desc Create a new workout (Admin only)
const createWorkout = async (req, res) => {
    try {
        console.log("🔹 Request received:", req.body);

        const { title, exercises, difficulty, goal } = req.body; // Fix: "name" → "title"

        if (!title || !exercises || !difficulty || !goal) {
            console.log("❌ Missing fields in request");
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        // Ensure each exercise includes a rest field
        for (const exercise of exercises) {
            if (!exercise.rest) {
                return res.status(400).json({ message: "Each exercise must include a rest time." });
            }
        }

        const newWorkout = new Workout({
            title, // Fix: Use "title"
            exercises,
            difficulty,
            goal
        });

        const savedWorkout = await newWorkout.save();
        console.log("✅ Workout created successfully:", savedWorkout);

        res.status(201).json(savedWorkout);
    } catch (error) {
        console.error("❌ Error creating workout:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// @desc Delete a workout (Admin only)
// @route DELETE /api/workouts/:id
const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
    }

    await workout.deleteOne();
    res.json({ message: "Workout deleted successfully" });
});



module.exports = { getAllWorkouts, getWorkoutsByGoal, createWorkout, deleteWorkout };
