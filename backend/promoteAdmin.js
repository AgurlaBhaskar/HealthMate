const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const promoteToAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthmate');
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`User ${email} promoted to admin.`);
    } else {
      console.log(`User ${email} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email.');
  process.exit(1);
}
promoteToAdmin(email);
