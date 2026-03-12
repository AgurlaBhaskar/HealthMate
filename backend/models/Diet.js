const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], required: true },
  foodItem: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number }, // in grams
  carbs: { type: Number }, // in grams
  fat: { type: Number }, // in grams
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Diet', dietSchema);
