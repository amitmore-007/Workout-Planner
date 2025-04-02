const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb+srv://amit-007:amit123@cluster0.jkm2v.mongodb.net/workoutDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Workout = mongoose.model("Workout", new mongoose.Schema({}, { strict: false })); // Flexible schema

const cleanAndRemoveDuplicates = async () => {
  try {
    console.log("Checking for duplicate workouts and fixing data format...");

    // Find duplicates based on Exercise_Name (case-insensitive)
    const duplicates = await Workout.aggregate([
      {
        $group: {
          _id: { $toLower: "$Exercise_Name" },
          count: { $sum: 1 },
          ids: { $push: "$_id" }, // Store all duplicate IDs
        },
      },
      {
        $match: { count: { $gt: 1 } }, // Only where duplicates exist
      },
    ]);

    let totalDeleted = 0;

    for (let doc of duplicates) {
      const idsToDelete = doc.ids.slice(1); // Keep one, delete others
      await Workout.deleteMany({ _id: { $in: idsToDelete } });
      totalDeleted += idsToDelete.length;
    }

    console.log(`Deleted ${totalDeleted} duplicate workouts!`);

    // Fix data formatting
    const workouts = await Workout.find();

    for (let workout of workouts) {
      let updateData = {};

      if (typeof workout.Primary_Muscles === "string") {
        updateData.Primary_Muscles = JSON.parse(workout.Primary_Muscles.replace(/'/g, '"'));
      }

      if (typeof workout.Secondary_Muscles === "string") {
        updateData.Secondary_Muscles = JSON.parse(workout.Secondary_Muscles.replace(/'/g, '"'));
      }

      if (typeof workout.Instructions === "string") {
        updateData.Instructions = JSON.parse(workout.Instructions.replace(/'/g, '"'));
      }

      if (Object.keys(updateData).length > 0) {
        await Workout.updateOne({ _id: workout._id }, { $set: updateData });
      }
    }

    console.log("Data formatting fixed successfully!");
  } catch (error) {
    console.error("Error processing workouts:", error);
  } finally {
    mongoose.connection.close();
  }
};

cleanAndRemoveDuplicates();
