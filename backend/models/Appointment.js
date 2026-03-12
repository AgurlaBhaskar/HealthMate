const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerName: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'General Physician', 'Nutritionist'
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mode: { type: String, enum: ['Video Call', 'In-person'], default: 'Video Call' },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
