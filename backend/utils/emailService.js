const sgMail = require('@sendgrid/mail');

const sendEmail = async ({ to, subject, text, html }) => {
  const hasRealKey = process.env.SENDGRID_API_KEY && 
                     process.env.SENDGRID_API_KEY !== 'your_sg_api_key_here' &&
                     process.env.SENDGRID_SENDER_EMAIL !== 'your_verified_sender_email@example.com';

  if (hasRealKey) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject,
        text,
        html,
      };
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('SendGrid Error:', error.response ? error.response.body : error);
      throw error;
    }
  } else {
    // Test Mode
    console.log('--- TEST MODE: EMAIL LOG ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('---------------------------');
    return { success: true, testMode: true };
  }
};

module.exports = { sendEmail };
