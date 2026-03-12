const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book a new appointment
router.post('/', async (req, res) => {
  try {
    const { user, providerName, type, date, time, mode, notes } = req.body;
    const newAppointment = new Appointment({ user, providerName, type, date, time, mode, notes });
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all appointments for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId }).sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update appointment status (e.g., Cancelled)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
    res.json(appointment);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


module.exports = router;
