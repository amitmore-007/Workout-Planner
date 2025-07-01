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
      enum: ["weight loss", "weight gain", "balanced"],
      required: true,
    },
   activityLevel: {
  type: String,
  enum: ["sedentary", "lightly active", "moderately active", "very active"],
  required: true,
  lowercase: true, // This automatically converts input to lowercase
},

dietPreference: {
  type: String,
  enum: ["veg", "non-veg", "vegan", "keto"],
  required: true,
  lowercase: true,
},

fitnessExperience: {
  type: String,
  enum: ["beginner", "intermediate", "advanced"],
  required: true,
  lowercase: true,
},
purchasedPlans: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WorkoutPlan',
    purchasedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],
  purchasedDietPlans: [{ 
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan' },
    purchasedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    currentWeek: { type: Number, default: 1 }
  }],
  viewedPlans: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WorkoutPlan',
    viewedAt: { type: Date, default: Date.now }
  }],
  viewedDietPlans: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DietPlan',
    viewedAt: { type: Date, default: Date.now }
  }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
