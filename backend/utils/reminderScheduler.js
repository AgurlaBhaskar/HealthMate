const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); // Explicitly import User for population
const { sendEmail } = require('./emailService');

const initReminderScheduler = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily appointment reminder check...');
    await sendReminders();
  });

  // For testing purposes, you could uncomment this to run every minute
  // cron.schedule('* * * * *', async () => {
  //   console.log('Running minute-by-minute test reminder check...');
  //   await sendReminders();
  // });
};

const sendReminders = async () => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Set range for "tomorrow" (from start of day to end of day)
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      date: {
        $gte: startOfTomorrow,
        $lte: endOfTomorrow
      },
      status: 'Scheduled',
      reminderSent: { $ne: true }
    }).populate('user');

    console.log(`Found ${appointments.length} appointments for tomorrow.`);

    for (const appt of appointments) {
      if (appt.user && appt.user.email) {
        try {
          await sendEmail({
            to: appt.user.email,
            subject: 'Appointment Reminder - HealthMate',
            text: `Reminder: You have an appointment with ${appt.providerName} for ${appt.type} tomorrow at ${appt.time}.`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4F46E5;">Appointment Reminder</h2>
                <p>Hello ${appt.user.name || 'Valued User'},</p>
                <p>This is a reminder for your upcoming appointment:</p>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>With:</strong> ${appt.providerName}</li>
                  <li><strong>Type:</strong> ${appt.type}</li>
                  <li><strong>Date:</strong> ${appt.date.toLocaleDateString()}</li>
                  <li><strong>Time:</strong> ${appt.time}</li>
                  <li><strong>Mode:</strong> ${appt.mode}</li>
                </ul>
                <p>Best regards,<br>The HealthMate Team</p>
              </div>
            `,
          });

          appt.reminderSent = true;
          await appt.save();
          console.log(`Reminder sent to ${appt.user.email} for appointment ${appt._id}`);
        } catch (error) {
          console.error(`Failed to send reminder for appointment ${appt._id}:`, error.message);
        }
      }
    }
  } catch (err) {
    console.error('Error in reminder scheduler:', err);
  }
};

module.exports = { initReminderScheduler, sendReminders };
