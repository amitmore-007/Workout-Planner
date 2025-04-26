// models/WorkoutPlan.js
const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
  creatorName: String,
  goal: String,
  planName: String,
  description: String,
  difficulty: String,
  totalDuration: String,
  tags: [String],
  image: String,
  videoPreview: String,
  weeklyPlan: {
    monday: { type: Array, default: [] },
    tuesday: { type: Array, default: [] },
    wednesday: { type: Array, default: [] },
    thursday: { type: Array, default: [] },
    friday: { type: Array, default: [] },
    saturday: { type: Array, default: [] },
    sunday: { type: Array, default: [] },
  },
  likes: { type: Number, default: 0 },
  ratings: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      stars: Number,
    },
  ],
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
