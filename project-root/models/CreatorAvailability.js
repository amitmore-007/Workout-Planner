const mongoose = require('mongoose');

const creatorAvailabilitySchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  sessionTypes: [{
    name: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  availableSlots: [{
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  timezone: {
    type: String,
    default: 'UTC'
  },
  experience: {
    type: String
  },
  specializations: [{
    type: String
  }],
  languages: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('CreatorAvailability', creatorAvailabilitySchema);
