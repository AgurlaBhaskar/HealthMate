const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Add new activity
router.post('/', async (req, res) => {
  try {
    const { user, type, duration, distance, caloriesBurned, date, notes } = req.body;
    const newActivity = new Activity({ user, type, duration, distance, caloriesBurned, date, notes });
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all activities for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
