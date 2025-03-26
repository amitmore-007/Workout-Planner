require("dotenv").config();
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const SPOONACULAR_API_URL = "https://api.spoonacular.com/mealplanner/generate";
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 🎥 **Additional Video Search Strategy**
const searchVideoFallbacks = async (mealTitle) => {
  const platforms = [
    { 
      name: 'YouTube', 
      searchUrl: YOUTUBE_API_URL,
      searchParams: {
        key: YOUTUBE_API_KEY,
        q: `${mealTitle} recipe tutorial`,
        part: "snippet",
        type: "video",
        maxResults: 1
      },
      extractVideoId: (data) => data.items[0]?.id.videoId
    },
    // You can add more platforms here in the future
  ];

  for (let platform of platforms) {
    try {
      const response = await axios.get(platform.searchUrl, { params: platform.searchParams });
      const videoId = platform.extractVideoId(response.data);
      
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    } catch (error) {
      console.error(`No video found on ${platform.name} for ${mealTitle}`);
    }
  }
  return null;
};

// 🍽️ **Define Calorie Split for Different Goals**
const calorieIntake = {
  "weight loss": 1800,
  "weight gain": 3000,
  "maintenance": 2200,
};

// 📌 **How Many Calories Each Meal Gets?**
const mealSplits = {
  breakfast: 0.25, // 25% of daily calories
  lunch: 0.30, // 30% of daily calories
  dinner: 0.25, // 25% of daily calories
  snack: 0.10, // 10% of daily calories
  postWorkout: 0.10, // 10% of daily calories
};

// 🎯 **Get Diet Plan Based on User Goal**
const getDietPlan = asyncHandler(async (req, res) => {
  const { goal } = req.user;
  if (!goal) return res.status(400).json({ message: "User goal is missing" });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const totalCalories = calorieIntake[goal] || 2200; // Default to maintenance

  try {
    // ✅ **Fetch Breakfast, Lunch, and Dinner**
    const response = await axios.get(SPOONACULAR_API_URL, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        timeFrame: "day",
        targetCalories: totalCalories * 0.8, // 80% of daily calories
      },
    });

    let meals = response.data.meals || [];

    // ✅ **Fetch Snacks & Post-Workout Meal Separately**
    const extraMeals = await Promise.all(
      ["snack", "postWorkout"].map(async (mealType) => {
        const mealResponse = await axios.get(SPOONACULAR_API_URL, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            timeFrame: "day",
            targetCalories: totalCalories * mealSplits[mealType], // 10% calories each
          },
        });

        return mealResponse.data.meals.length > 0
          ? { ...mealResponse.data.meals[0], mealType }
          : null;
      })
    );

    // **Merge Extra Meals (Remove Null Values)**
    meals = [...meals, ...extraMeals.filter(Boolean)];

    // ✅ **Fetch YouTube Videos for Each Meal with Fallback**
    meals = await Promise.all(
      meals.map(async (meal) => {
        try {
          // First, try the default YouTube search
          const ytResponse = await axios.get(YOUTUBE_API_URL, {
            params: {
              key: YOUTUBE_API_KEY,
              q: `${meal.title} recipe tutorial`,
              part: "snippet",
              type: "video",
              maxResults: 1,
            },
          });

          const defaultVideoId = ytResponse.data.items[0]?.id.videoId;
          
          // If no video found, use the fallback search strategy
          const videoUrl = defaultVideoId 
            ? `https://www.youtube.com/watch?v=${defaultVideoId}`
            : await searchVideoFallbacks(meal.title);

          return { 
            ...meal, 
            videoUrl: videoUrl 
          };
        } catch (error) {
          console.error(`⚠️ No YouTube video for ${meal.title}`);
          
          // Use fallback video search if primary search fails
          const fallbackVideoUrl = await searchVideoFallbacks(meal.title);
          
          return { 
            ...meal, 
            videoUrl: fallbackVideoUrl 
          };
        }
      })
    );

    res.status(200).json({ today, meals });
  } catch (error) {
    console.error("❌ Error fetching diet plan:", error);
    res.status(500).json({ message: "Failed to fetch diet plan", error: error.message });
  }
});

module.exports = { getDietPlan };