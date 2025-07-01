const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  meal: String, // breakfast, lunch, dinner, snack
  item: String,
  macros: String,
  calories: Number,
  instructions: String
});

const weeklyBreakdownSchema = new mongoose.Schema({
  week: String,
  focus: String,
  schedule: String,
  meals: [mealSchema]
});

const detailedContentSchema = new mongoose.Schema({
  overview: String,
  weeklyBreakdown: [weeklyBreakdownSchema],
  supplements: [String],
  expectedResults: String,
  shoppingLists: [String], // Premium only
  mealPrepGuides: [String], // Premium only
  videoContent: [String], // Premium only
  personalizedMacros: { // Premium only
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }
});

const dietPlanSchema = new mongoose.Schema({
  creatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Creator', 
    required: true 
  },
  creatorName: { type: String, required: true },
  planType: {
    type: String,
    enum: ['regular', 'premium'],
    required: true,
    default: 'regular'
  },
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: {
    type: String,
    enum: ['Keto', 'Mediterranean', 'Vegan', 'Intermittent Fasting', 'Weight Loss', 'Muscle Gain', 'General Health'],
    required: true
  },
  description: { type: String, required: true },
  duration: { type: String, required: true }, // "12 weeks"
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  price: { 
    type: Number, 
    required: function() { return this.planType === 'premium'; },
    default: 0
  },
  features: [String],
  preview: { type: String, required: true },
  detailedContent: detailedContentSchema,
  image: String,
  imagePublicId: String, // For Cloudinary image management
  tags: [String],
  isPublished: { type: Boolean, default: false },
  ratings: [{
    stars: { type: Number, min: 1, max: 5 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 },
  totalPurchases: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate average rating before saving
dietPlanSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.stars, 0);
    this.avgRating = sum / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
