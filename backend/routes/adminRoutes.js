const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Diet = require('../models/Diet');
const Activity = require('../models/Activity');
const { auth, admin } = require('../middleware/auth');

// Apply middleware to all admin routes
router.use(auth);
router.use(admin);

// Get system statistics with growth data
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const apptCount = await Appointment.countDocuments();
    const dietCount = await Diet.countDocuments();
    const activityCount = await Activity.countDocuments();
    
    // Calculate monthly user growth (last 6 months)
    const growth = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date();
      start.setMonth(start.getMonth() - i);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      
      const count = await User.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });
      
      growth.push({
        month: start.toLocaleString('default', { month: 'short' }),
        count: count
      });
    }

    res.json({
      users: userCount,
      appointments: apptCount,
      diets: dietCount,
      activities: activityCount,
      growth: growth
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'trainer', 'nutritionist'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ msg: 'User role updated', user: { id: user._id, role: user.role } });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user', 'name email').sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all diet records
router.get('/diets', async (req, res) => {
  try {
    const diets = await Diet.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(diets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all activity records
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete an appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Appointment deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a diet record
router.delete('/diets/:id', async (req, res) => {
  try {
    await Diet.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Diet record deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete an activity record
router.delete('/activities/:id', async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Activity record deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also clean up their records
    await Appointment.deleteMany({ user: req.params.id });
    await Diet.deleteMany({ user: req.params.id });
    await Activity.deleteMany({ user: req.params.id });
    res.json({ message: 'User and all related records deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
