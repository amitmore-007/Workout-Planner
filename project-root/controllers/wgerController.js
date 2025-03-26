require("dotenv").config();
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const WGER_API_URL = "https://wger.de/api/v2";
const WGER_API_KEY = process.env.WGER_API_KEY;

// @desc Get pre-built workout plans
// @route GET /api/wger/workout-plans
const getWorkoutPlans = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(`${WGER_API_URL}/workout`, {
            headers: {
                Authorization: `Token ${WGER_API_KEY}`
            }
        });

        res.status(200).json(response.data.results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Wger workout plans", error: error.message });
    }
});

// @desc Get exercises based on user goal
// @route GET /api/wger/exercises
const getExercisesByGoal = asyncHandler(async (req, res) => {
    const { goal } = req.user;

    const goalToMuscleGroup = {
        "weight loss": [10, 8], // Abs, Cardio
        "weight gain": [4, 6, 7], // Chest, Back, Legs
        "maintenance": [1, 2, 4] // Arms, Shoulders, Chest
    };

    if (!goalToMuscleGroup[goal]) {
        return res.status(400).json({ message: "Invalid goal" });
    }

    try {
        const response = await axios.get(`${WGER_API_URL}/exercise/?muscles=${goalToMuscleGroup[goal].join(",")}`, {
            headers: { Authorization: `Token ${WGER_API_KEY}` }
        });

        res.status(200).json(response.data.results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exercises", error: error.message });
    }
});

module.exports = { getWorkoutPlans, getExercisesByGoal };
