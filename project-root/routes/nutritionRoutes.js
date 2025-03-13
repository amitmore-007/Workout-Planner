const express = require("express");
const { analyzeFood, upload, analyzeFoodImage } = require("../controllers/nutritionController");

const router = express.Router();

// Route for analyzing food
router.post("/", analyzeFood);
router.post('/image', upload.single('image'), analyzeFoodImage);

module.exports = router;
