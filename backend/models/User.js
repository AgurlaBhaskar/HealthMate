const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  bmi: { type: Number },
  fitnessGoal: { type: String }, // e.g., 'Weight Loss', 'Muscle Gain', 'Maintain'
  medicalInfo: { type: String },
  role: { type: String, enum: ['user', 'admin', 'trainer', 'nutritionist'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
