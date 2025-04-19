const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'creator' },
});

module.exports = mongoose.model('Creator', creatorSchema);
