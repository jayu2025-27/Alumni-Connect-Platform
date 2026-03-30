const nodemailer = require('nodemailer');

// Define transporter using the provided Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jayshreepathak.2580@gmail.com',
    pass: 'rckz btxc mdqq guve', // App password
  },
});

const sendNotificationEmail = async (subject, htmlContent) => {
  try {
    const mailOptions = {
      from: '"Alumni Connect System" <jayshreepathak.2580@gmail.com>',
      to: 'jayshreepathak.2580@gmail.com', // Sending specifically to the admin's email as requested
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
};

module.exports = {
  sendNotificationEmail,
};
