require("dotenv").config();
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const EXERCISE_API_URL = "https://exercisedb.p.rapidapi.com/exercises/bodyPart";
const EXERCISE_API_KEY = process.env.RAPIDAPI_KEY; // Load from .env

// Workout goals mapped to correct body parts
const workoutGoals = {
    "weight gain": ["chest", "back", "upper legs", "shoulders", "upper arms"], // Muscle Gain
    "weight loss": ["cardio", "waist"], // Fat Loss
    "maintenance": ["chest", "back", "upper legs"] // Strength Training
};

// @desc Get workouts from API based on user goal
// @route GET /api/exercises/workout-plan
const getWorkoutPlan = asyncHandler(async (req, res) => {
    const { goal } = req.user;

    if (!workoutGoals[goal]) {
        return res.status(400).json({ message: "Invalid goal selected" });
    }

    try {
        let workoutPlan = await Promise.all(
            workoutGoals[goal].map(async (bodyPart) => {
                try {
                    const response = await axios.get(`${EXERCISE_API_URL}/${bodyPart}`, {
                        headers: {
                            "X-RapidAPI-Key": EXERCISE_API_KEY,
                            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
                        }
                    });

                    return {
                        bodyPart,
                        exercises: response.data.slice(0, 5).map(ex => ({
                            name: ex.name,
                            equipment: ex.equipment,
                            gifUrl: ex.gifUrl
                        }))
                    };
                } catch (apiError) {
                    console.error(`Failed to fetch exercises for ${bodyPart}:`, apiError.message);
                    return { bodyPart, exercises: [] }; // Prevents breaking if one body part fails
                }
            })
        );

        res.json({ workoutPlan });
    } catch (error) {
        res.status(500).json({ message: "Error fetching workout data", error: error.message });
    }
});

// @desc Get exercises by body part
// @route GET /api/exercises/:bodyPart
const getWorkoutByBodyPart = asyncHandler(async (req, res) => {
    try {
        const { bodyPart } = req.params;

        const response = await axios.get(`${EXERCISE_API_URL}/${bodyPart}`, {
            headers: {
                "X-RapidAPI-Key": EXERCISE_API_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workouts", error: error.message });
    }
});

module.exports = { getWorkoutPlan, getWorkoutByBodyPart };
