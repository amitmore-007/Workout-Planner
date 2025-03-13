const asyncHandler = require("express-async-handler");
const { getNutritionInfo } = require("../utils/nutrition");

const axios = require('axios');
const multer = require('multer');

// @desc Get nutrition info of a food item
// @route POST /api/nutrition
const analyzeFood = asyncHandler(async (req, res) => {
    const { foodText } = req.body;

    if (!foodText) {
        return res.status(400).json({ message: "Please provide a food item" });
    }

    const nutritionData = await getNutritionInfo(foodText);
    res.status(200).json(nutritionData);
});

const upload = multer({ dest: 'uploads/' });

// Nutritionix API Credentials
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

// Function to get nutrition data
const getNutritionDetails = async (foodItem) => {
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query: foodItem },
      {
        headers: {
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Nutritionix API Error:', error);
    return null;
  }
};

// Controller to handle food image recognition and nutrition data
const analyzeFoodImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const detectedFood = await detectFoodFromImage(req.file.path);
    if (!detectedFood) {
      return res.status(404).json({ error: 'No food detected in the image' });
    }
    console.log("🖼️ Uploaded Image Path:", req.file.path);


    const nutritionData = await getNutritionDetails(detectedFood);
    if (!nutritionData) {
      return res.status(500).json({ error: 'Failed to fetch nutrition data' });
    }

    res.json({ food: detectedFood, nutrition: nutritionData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { analyzeFood,  upload, analyzeFoodImage };
