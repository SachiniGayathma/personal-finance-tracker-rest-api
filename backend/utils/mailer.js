const nodemailer = require("nodemailer");
require("dotenv").config(); // If using environment variables

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendNotification = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send email
const sendNotificationWithPDF = async (to, subject, message,filePath) => {
  try {
    await transporter.sendMail({
      from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      attachments: [
        {
            path: filePath // Attach the file using the path
        }
    ]
    });
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendNotification;
module.exports = sendNotificationWithPDF;
