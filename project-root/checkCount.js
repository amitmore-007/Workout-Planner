const fs = require("fs");

const countWorkouts = () => {
  try {
    const data = fs.readFileSync("workout_fixed.json", "utf-8");
    const workouts = JSON.parse(data);
    console.log(`📊 Total workouts in JSON file: ${workouts.length}`);
  } catch (error) {
    console.error("❌ Error reading JSON file:", error.message);
  }
};

countWorkouts();
