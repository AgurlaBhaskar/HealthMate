const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'Running', 'Walking', 'Weightlifting', 'Yoga'
  duration: { type: Number, required: true }, // in minutes
  distance: { type: Number }, // in km, if applicable
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
