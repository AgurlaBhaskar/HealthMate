const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================================================================
// 🚨 DATABASE CONNECTION - MODIFY HERE 🚨
// =========================================================================
// To connect to your MongoDB database, uncomment the lines below and
// replace the 'mongoURI' string with your actual MongoDB connection string.
// Make sure to add your IP address to the MongoDB Atlas network access list if using Atlas.
// =========================================================================

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthmate";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB Database Connected Successfully");
}).catch((err) => {
  console.error("MongoDB Connection Error: ", err);
});

// =========================================================================

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/diets', require('./routes/dietRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('HealthMate API is running. Note: DB connection is currently commented out.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
