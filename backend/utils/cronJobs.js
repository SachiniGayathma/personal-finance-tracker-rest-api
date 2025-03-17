const cron = require("node-cron");
const sendNotification = require("./mailer");
const Transaction = require("../models/TransactionSchema");
const User = require("../models/User");
const Budget = require('../models/BudgetSchema');
const moment = require("moment");
const GoalSchema = require("../models/GoalSchema");

const checkRecurringTransactions = async () => {
  try {
    const today = moment().startOf("day").toDate();
    const transactions = await Transaction.find({});
    for(const currentTransaction of transactions){

     const transactionDate = currentTransaction.date;
     const nextRecurrencePattern= currentTransaction.recurrencePattern;
     const endDate = currentTransaction.endDate;
     let nextRecurrenceDate;
     let remainingDates;

     if (endDate && moment(endDate).isBefore(today)) {
      // Skip processing if the end date has passed
      continue;
    }
     

     if(nextRecurrencePattern === "daily"){

      nextRecurrenceDate = moment(transactionDate).add(1,"days").toDate();

     }else if(nextRecurrencePattern === "weekly"){

      nextRecurrenceDate = moment(transactionDate).add(7,"days").toDate();
     }else if(nextRecurrencePattern === "monthly"){

      nextRecurrenceDate = moment(transactionDate).add(1, "month").toDate();
     }
    
     remainingDates = moment(nextRecurrenceDate).diff(today,"days");

     if(remainingDates <= 2){

      const user = await User.findOne({ _id: currentTransaction.userId });

      if(user && user.email){

        sendNotification(user.email, `Upcomming Transaction ${currentTransaction._id}`, `You Have ${remainingDates} Days Left For The Upcomming Transaction ${currentTransaction.amount}`);

        console.log(
          `✅ Email sent to ${user.email} for transaction ID: ${currentTransaction._id}`
        );
      } else {
        console.log(
          `⚠️ User email not found for transaction ID: ${currentTransaction._id}`
        );
      }
     

     }else if(remainingDates == 0 ){

      const user = await User.findOne({ _id: currentTransaction.userId });

      if(user && user.email){

        sendNotification(user.email, `Today Transaction ${currentTransaction._id}`, `Happening Today ${currentTransaction.amount} of Recurring Transaction`);

        console.log(
          `✅ Email sent to ${user.email} for transaction ID: ${currentTransaction._id}`
        );
      } else {
        console.log(
          `⚠️ User email not found for transaction ID: ${currentTransaction._id}`
        );
      }


     }else if(remainingDates < 0 ){


      const user = await User.findOne({ _id: currentTransaction.userId });

      if(user && user.email){

        sendNotification(user.email, ` Transaction ${currentTransaction._id} Overdue`, ` ${currentTransaction.amount} of Recurring Transaction is Over due`);

        console.log(
          `✅ Email sent to ${user.email} for transaction ID: ${currentTransaction._id}`
        );
      } else {
        console.log(
          `⚠️ User email not found for transaction ID: ${currentTransaction._id}`
        );
      }

     }


    }





    console.log("Cron job executed successfully for Recurring Transaction! ");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
};

const checkBudgets = async() =>{

  try{

    const today = moment().startOf("day").toDate();
    const budgets = await Budget.find({});

    for(const rollBudgets of budgets){

      const spentAmount = rollBudgets.spentAmount;
      const budgetAmount = rollBudgets.amount;

      if(spentAmount > budgetAmount * 70/100  && !spentAmount > budgetAmount){

        
      const user = await User.findOne({ _id: rollBudgets.userId });
      if(user && user.email){

        sendNotification(user.email,`⚠️ Budget Nearing Warning ${rollBudgets._id}`, `Dear User \nPlease be kind enough to note that you have been reached ${spentAmount * 100 /budgetAmount} % of the budget${rollBudgets._id} by ${today}\n Category : ${rollBudgets.category}\n Budget Amount :${rollBudgets.amount}\n Spent Amount : ${rollBudgets.spentAmount}\n Balance : ${rollBudgets.amount - rollBudgets.spentAmount}`);
        console.log(
          `✅ Email sent to ${user.email} for transaction ID: ${rollBudgets._id}`
        );
      } else {
        console.log(
          `⚠️ User email not found for transaction ID: ${rollBudgets._id}`
        );
      }
        
      }else if(spentAmount > budgetAmount){


        const user = await User.findOne({ _id: rollBudgets.userId });
      if(user && user.email){

        sendNotification(user.email,`⚠️ Budget Exceeding Warning ${rollBudgets._id}`, `Dear User \nPlease be kind enough to note that you have been exceeded the budget${rollBudgets._id} by ${today}\n Category : ${rollBudgets.category}\n Budget Amount :${rollBudgets.amount}\n Spent Amount : ${rollBudgets.spentAmount}\n Exceeded By: ${rollBudgets.spentAmount- rollBudgets.amount }`);
        console.log(
          `✅ Email sent to ${user.email} for transaction ID: ${rollBudgets._id}`
        );
      } else {
        console.log(
          `⚠️ User email not found for transaction ID: ${rollBudgets._id}`
        );
      }

      }


    }


    console.log("Cron job executed successfully for Budget Tracking! ");
  }catch(err){

    console.log(err);
  }

  





};



cron.schedule("0 4 11 * * * * ",checkRecurringTransactions);
cron.schedule("0 32 11 * * * *", checkBudgets);


