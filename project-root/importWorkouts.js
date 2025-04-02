const mongoose = require("mongoose");
const fs = require("fs");

// ✅ 1. Connect to MongoDB
const MONGO_URI = "mongodb+srv://amit-007:amit123@cluster0.jkm2v.mongodb.net/workoutDB?retryWrites=true&w=majority"; // Update with your DB name
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ 2. Define Workout Schema
const workoutSchema = new mongoose.Schema({
    goal: { type: String, required: true }, // Goal field renamed to "gaol"
    Exercise_Name: { type: String, required: true },
    Exercise_Category: { type: String },
    Primary_Muscles: { type: [String] },
    Secondary_Muscles: { type: [String] },
    Equipment: { type: String },
    Instructions: { type: [String] }
});

const Workout = mongoose.model("Workout", workoutSchema);

// ✅ 3. Read JSON File
fs.readFile("updated_workouts.json", "utf-8", async (err, data) => {
    if (err) {
        console.error("❌ Error reading file:", err);
        return;
    }

    try {
        const workouts = JSON.parse(data); // Parse JSON data
        console.log(`📂 Loaded ${workouts.length} workouts from file.`);

        let insertedCount = 0; // Track inserted documents

        // ✅ 4. Insert Data in Batches of 1000
        for (let i = 0; i < workouts.length; i += 1000) {
            const batch = workouts.slice(i, i + 1000); // Get batch of 1000
            await Workout.insertMany(batch);
            insertedCount += batch.length;
            console.log(`🚀 Inserted ${insertedCount} documents so far...`);
        }

        console.log(`✅ All ${insertedCount} documents inserted successfully!`);

        // ✅ 5. Close Connection
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error inserting data:", error);
        mongoose.connection.close();
    }
});
