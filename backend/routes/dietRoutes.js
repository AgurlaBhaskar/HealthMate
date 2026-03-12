const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');

// Add new diet log
router.post('/', async (req, res) => {
  try {
    const { user, mealType, foodItem, calories, protein, carbs, fat } = req.body;
    const newDiet = new Diet({ user, mealType, foodItem, calories, protein, carbs, fat });
    const savedDiet = await newDiet.save();
    res.status(201).json(savedDiet);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get diet logs for a user (optional filtering for today)
router.get('/user/:userId', async (req, res) => {
  try {
    let query = { user: req.params.userId };
    
    if (req.query.today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const diets = await Diet.find(query).sort({ date: -1 });
    res.json(diets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
