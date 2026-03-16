const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User'); // Register User schema
const { sendReminders } = require('../utils/reminderScheduler');

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthmate";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("Connected to MongoDB for Manual Reminder Trigger");
  
  console.log("Starting manual reminder check...");
  await sendReminders();
  
  console.log("Manual check completed.");
  process.exit(0);
}).catch((err) => {
  console.error("Connection Error: ", err);
  process.exit(1);
});
