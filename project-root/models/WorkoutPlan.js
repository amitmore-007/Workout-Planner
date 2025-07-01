const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: String,
  duration: String,
  weight: String,
  pace: String,
  progression: String,
  focus: String
});

const weeklyPlanSchema = new mongoose.Schema({
  monday: [String],
  tuesday: [String],
  wednesday: [String],
  thursday: [String],
  friday: [String],
  saturday: [String],
  sunday: [String]
});

const workoutPlanSchema = new mongoose.Schema({
  creatorName: { type: String, required: true },
  goal: { 
    type: String, 
    enum: ['Weight Loss', 'Muscle Gain', 'Strength', 'General Fitness', 'Flexibility', 'Endurance'],
    required: true
  },
  planName: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  totalDuration: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String, required: true },
  videoPreview: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  weeklyPlan: weeklyPlanSchema,
  detailedContent: {
    exercises: [exerciseSchema],
    nutrition: { type: String, required: true }
  },
  likes: { type: Number, default: 0 },
  ratings: [{
    stars: { type: Number, min: 1, max: 5 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  avgRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Calculate average rating before saving
workoutPlanSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.stars, 0);
    this.avgRating = sum / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);