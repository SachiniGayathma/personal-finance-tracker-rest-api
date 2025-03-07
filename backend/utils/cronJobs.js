const cron = require("node-cron");
const sendNotification = require("./mailer");
const Transaction = require("../models/TransactionSchema");
const User = require("../models/User");
const moment = require("moment");

const checkRecurringTransactions = async () => {
  try {
    const today = moment().startOf("day").toDate();

    // Find all users
    const users = await User.find();
    
    for (const user of users) {
      const userId = user._id;

      // 1. Calculate total income for the selected period
      const incomeTransactions = await Transaction.find({
        userId,
        type: "income",
        date: { $gte: moment(today).startOf("month").toDate() },
      });

      const totalIncome = incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      // 2. Calculate total expenses (including recurring ones)
      const expenses = await Transaction.find({
        userId,
        type: "expense",
        date: { $gte: moment(today).startOf("month").toDate() },
      });

      const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);

      // 3. Calculate total goal savings
      const goalSavings = await Transaction.find({
        userId,
        goalId: { $exists: true }, // Only transactions linked to a goal
      });

      const totalGoalSavings = goalSavings.reduce((sum, tx) => sum + tx.savingValue, 0);

      // 4. Calculate remaining balance
      const remainingBalance = totalIncome - (totalExpenses + totalGoalSavings);

      // 5. Find recurring transactions due today
      const recurringExpenses = await Transaction.find({
        userId,
        isRecurring: true,
        type: "expense",
        nextDueDate: { $lte: today }
      });

      for (const transaction of recurringExpenses) {
        if (remainingBalance < transaction.amount) {
          // Not enough funds, send an email alert
          await sendNotification(
            user.email,
            `Insufficient Funds for ${transaction.category}`,
            `Your recurring expense of ${transaction.amount} cannot be processed due to insufficient balance.`
          );
        } else {
          // Deduct the amount and update nextDueDate
          let newNextDueDate;
          if (transaction.recurrencePattern === "daily") {
            newNextDueDate = moment(transaction.nextDueDate).add(1, "day").toDate();
          } else if (transaction.recurrencePattern === "weekly") {
            newNextDueDate = moment(transaction.nextDueDate).add(1, "week").toDate();
          } else if (transaction.recurrencePattern === "monthly") {
            newNextDueDate = moment(transaction.nextDueDate).add(1, "month").toDate();
          }

          await Transaction.findByIdAndUpdate(transaction._id, { nextDueDate: newNextDueDate });
        }
      }
    }

    console.log("Cron job executed successfully!");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
};



/*module.exports = { runCronJob: checkRecurringTransactions };*/
