const axios = require("axios");
require("dotenv").config();

const NUTRITIONIX_API_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients";
const API_KEY = process.env.NUTRITIONIX_API_KEY;
const APP_ID = process.env.NUTRITIONIX_APP_ID;

// Function to analyze food items
const getNutritionInfo = async (foodText) => {
    try {
        const response = await axios.post(NUTRITIONIX_API_URL, {
            query: foodText
        }, {
            headers: {
                "x-app-id": APP_ID,
                "x-app-key": API_KEY,
                "Content-Type": "application/json"
            }
        });

        return response.data.foods;
    } catch (error) {
        console.error("❌ Error fetching nutrition data:", error.response?.data || error.message);
        throw new Error("Failed to fetch nutrition information");
    }
};

module.exports = { getNutritionInfo };
