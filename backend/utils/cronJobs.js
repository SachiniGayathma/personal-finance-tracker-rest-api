const cron = require("node-cron");
const sendNotification = require("./mailer");
const Transaction = require("../models/TransactionSchema");
const moment = require("moment");

// Run every day at 8 AM
cron.schedule("0 8 * * *", async () => {
  try {
    const today = moment().format("YYYY-MM-DD");

    // Find all recurring transactions that are due today
    const recurringTransactions = await Transaction.find({
      recurrence: { $ne: null }, // Only recurring transactions
      nextDueDate: today,
    });

    recurringTransactions.forEach(async (transaction) => {
      const userEmail = transaction.userEmail;

      // Send notification
      await sendNotification(
        userEmail,
        `Reminder: ${transaction.category} Payment Due`,
        `Your ${transaction.category} transaction (${transaction.amount} ${transaction.currency}) is due today.`
      );

      // Update nextDueDate (assuming recurrence is 'monthly')
      const newNextDueDate = moment(transaction.nextDueDate)
        .add(1, "month")
        .format("YYYY-MM-DD");

      await Transaction.findByIdAndUpdate(transaction._id, {
        nextDueDate: newNextDueDate,
      });
    });

    console.log("Recurring transaction notifications sent!");
  } catch (error) {
    console.error("Error checking transactions:", error);
  }
});
