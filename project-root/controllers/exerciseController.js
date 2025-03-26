require("dotenv").config();
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const workoutSchedule = require("../config/workoutSchedule");

const EXERCISE_API_URL = "https://exercisedb.p.rapidapi.com/exercises/bodyPart";
const EXERCISE_API_KEY = process.env.RAPIDAPI_KEY; // Load from .env

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Your API Key

const workoutGoals = {
    "weight gain": ["chest", "back", "upper legs", "shoulders", "upper arms"], 
    "weight loss": ["cardio", "waist", "upper legs"], // ✅ Added "upper legs"
    "maintenance": ["chest", "back", "upper legs"]
};



const exerciseCache = {}; // ✅ Cache to store previous requests

// 📌 Function to fetch exercises with retry mechanism
const fetchExercisesWithRetry = async (bodyPart, retries = 3, delay = 3000) => {
    try {
        const response = await axios.get(`${EXERCISE_API_URL}/${bodyPart}`, {
            headers: {
                "X-RapidAPI-Key": EXERCISE_API_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
            }
        });
        return response.data.slice(0, 5); // ✅ Return only the first 5 exercises
    } catch (error) {
        if (error.response?.status === 429 && retries > 0) {
            console.warn(`⏳ Too many requests for ${bodyPart}. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchExercisesWithRetry(bodyPart, retries - 1, delay * 2); // Exponential backoff
        }
        console.error(`❌ Failed to fetch exercises for ${bodyPart}:`, error.message);
        return []; // Return empty array if error persists
    }
};

// 📌 Function to get exercises with caching
const getExercisesCached = async (bodyPart) => {
    if (exerciseCache[bodyPart]) {
        console.log(`✅ Using cached data for ${bodyPart}`);
        return exerciseCache[bodyPart];
    }

    const exercises = await fetchExercisesWithRetry(bodyPart);
    exerciseCache[bodyPart] = exercises; // Store in cache
    return exercises;
};

  
const getWorkoutPlan = asyncHandler(async (req, res) => {
    const { goal } = req.user;
    if (!goal) return res.status(400).json({ message: "User goal is missing" });

    const today = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
    if (today === "Sunday") return res.json({ message: "Today is a rest day! Take some time to recover." });

    const todayBodyParts = workoutSchedule[today];
    if (!todayBodyParts) return res.status(404).json({ message: "No workouts scheduled for today." });

    try {
        let workoutPlan = await Promise.all(
            todayBodyParts.map(async (bodyPart) => {
                const exercises = await getExercisesCached(bodyPart);
                return { bodyPart, exercises };
            })
        );

        res.json({ today, workoutPlan });
    } catch (error) {
        console.error("❌ Error fetching workout data:", error.message);
        res.status(500).json({ message: "Failed to fetch workouts" });
    }
});


module.exports = { getWorkoutPlan };
