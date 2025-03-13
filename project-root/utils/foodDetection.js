const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const sharp = require('sharp');
const fs = require('fs');

let model;

// Load the YOLO model (COCO-SSD in this case)
const loadModel = async () => {
    if (!model) {
        console.log("⏳ Loading YOLO model...");
        model = await cocoSsd.load();
        console.log("✅ YOLO model loaded!");
    }
};

// Detect food items from an image
const detectFoodFromImage = async (imagePath) => {
    try {
        await loadModel();

        // Read image
        const imageBuffer = fs.readFileSync(imagePath);
        const tensor = tf.node.decodeImage(imageBuffer);

        // Run object detection
        const predictions = await model.detect(tensor);
        console.log("🔍 Detected objects:", predictions);

        // Extract detected food items
        const foodItems = predictions
            .filter(item => item.class.includes("food")) // Filter only food-related objects
            .map(item => item.class);

        // Delete uploaded file after processing
        fs.unlinkSync(imagePath);

        return foodItems.length > 0 ? foodItems : ["Unknown food item"];
    } catch (error) {
        console.error("❌ YOLO Model Error:", error);
        return null;
    }
};

module.exports = { detectFoodFromImage };
