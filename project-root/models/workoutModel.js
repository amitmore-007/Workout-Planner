const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: true,
    default: 'General Fitness'
  },
  difficulty: {
    type: String,
    required: true,
    default: 'Intermediate'
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  primaryMuscles: {
    type: [String], // Array of muscle groups
    required: true
  },
  secondaryMuscles: {
    type: [String], // Array of muscle groups
    default: []
  },
  equipment: {
    type: String,
    required: true,
    default: 'Bodyweight'
  },
  instructions: {
    type: [String], // Array of step-by-step instructions
    required: true
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
