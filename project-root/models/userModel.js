const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    goal: {
      type: String,
      enum: ["weight loss", "weight gain", "maintenance"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "lightly active", "moderately active", "very active"],
      required: true,
    },
    dietPreference: {
      type: String,
      enum: ["veg", "non-veg", "vegan", "keto"],
      required: true,
    },
    fitnessExperience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
