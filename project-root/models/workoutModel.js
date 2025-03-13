const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        rest: { type: String, required: true },
      },
    ],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    goal: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Endurance"],
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin creating the workout
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;
