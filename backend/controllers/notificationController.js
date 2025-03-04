const sendNotification = require("../utils/mailer");

const sendEmailNotification = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendNotification(email, subject, message);
    res.status(200).json({ message: "Notification sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error sending notification" });
  }
};

module.exports = { sendEmailNotification };
