const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, height, weight, fitnessGoal } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      const heightInMeters = height / 100;
      bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    user = new User({
      name, email, password: hashedPassword, age, height, weight, bmi, fitnessGoal
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user.id, name, email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User Profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { age, height, weight, fitnessGoal, medicalInfo } = req.body;
    let updateFields = { age, height, weight, fitnessGoal, medicalInfo };
    
    if (height && weight) {
      const heightInMeters = height / 100;
      updateFields.bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    const user = await User.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /auth/forgot-password
// @desc    Send OTP to email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User with this email does not exist' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and Expiry (10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send Email via Centralized Service
    try {
      await sendEmail({
        to: email,
        subject: 'HealthMate - Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4F46E5;">HealthMate Password Reset</h2>
            <p>You requested a password reset. Use the following OTP to proceed:</p>
            <div style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
            <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
      res.json({ message: 'OTP sent successfully to your email' });
    } catch (sendError) {
      res.status(500).json({ 
        message: 'Error sending email. Please check your credentials if using real mode.',
        error: sendError.message 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// @route   POST /auth/reset-password
// @desc    Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check OTP and Expiry
    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;
