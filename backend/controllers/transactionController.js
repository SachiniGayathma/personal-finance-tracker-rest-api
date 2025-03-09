const Transaction = require('../models/TransactionSchema');
const Budget = require('../models/BudgetSchema');
const Goal = require('../models/GoalSchema');
const sendNotification = require('../utils/mailer');
const User= require('../models/User');
const moment = require('moment');

exports.createTransaction = async (req, res) => {
  const { amount, category, type,  date, savingValue, isRecurring, recurrencePattern, endDate, tags } = req.body;

  const userId = req.user.id;

  try {
    const newTransaction = new Transaction({
      userId,
      amount,
      category,
      type,
      date,
      savingValue ,
      isRecurring,
      recurrencePattern,
      endDate,
      tags: tags || []
    });

    const transaction = await newTransaction.save();
    if (!transaction) {
      return res.status(404).json({ message: "Error occurred while saving the transaction" });
    }


    const budgets = await Budget.find({userId});

    for(const processBudgets of budgets){

      const budget = await Budget.findById(processBudgets._id);
      if(tags.some(tag => budget.category.includes(tag)) && type == 'expense'){

        budget.spentAmount +=  amount;
        await budget.save();


      }


    }

    // Check if budgetId is provided, if so update the budget
   /* if (budgetId) {
      const budget = await Budget.findById(budgetId);
      if (!budget) return res.status(404).json({ message: "Budget not found" });

      if (type === 'expense') {
        budget.spentAmount += amount;
      } else if (type === 'income') {
        budget.spentAmount -= amount;
      }
      await budget.save();
    }*/

    const goals = await Goal.find({userId});
   
    if (goals && type == 'income') {

      for(const updatingGoals of goals){

        const goalStart = await Goal.findById(updatingGoals._id);
        
        if (goalStart) {
          // Update currentSavings correctly
          goalStart.currentSavings += amount / (savingValue / goals.length);
          
          // Save the updated goal
          await goalStart.save();
        }
      

      }
      
    }

    res.status(201).json({ message: "Transaction saved successfully", transaction });

  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ message: "Error creating transaction", error: err });
  }
};

exports.getllTransactions = async (req,res)=>{

  try{

    const userId = req.user.id;

    const transaction = await Transaction.find({});
    if(!transaction) return res.status(404).json({message : "Transactions Are Not Available"});
    res.status(201).json({message : 'Transaction History as Below/n',transaction});


  }catch(err){

    res.status(404).json(err);

  }



};


exports.getSingleTransaction = async(req,res)=>{

  try{

    const transactionId = req.params.id;
    const transaction = await Transaction.findById(transactionId);
    if(!transaction) return res.status(404).json({message : "Transaction Is Not Found"});
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to View this transaction" });
    }//Ensures that The transaction belongs to a specific user
 
    res.status(201).json({message : `Transaction Details/n ${transaction}`});


  }catch(err){

    res.status(404).json(err);
  }
};


exports.filterTransactionsByTags = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tags } = req.query;  // Get tags from query parameters

    if (!tags) {
      return res.status(400).json({ message: "Please provide tags to filter transactions" });
    }

    const tagsArray = tags.split(',');  // Split tags into an array if they are comma-separated

    // Find transactions by tags
    const transactions = await Transaction.find({
      userId,
      tags: { $in: tagsArray }  // Match any of the provided tags
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for the given tags" });
    }

    res.status(200).json({ message: "Filtered Transactions", transactions });
  } catch (err) {
    res.status(500).json({ message: "Error filtering transactions by tags", error: err });
  }
};




exports.updateTransaction = async (req,res)=>{




  try{ 
    
    const transactionId = req.params.id;
    const { amount, category, type, date, isRecurring, recurrencePattern, endDate,tags } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(transactionId);
    if(!transaction) return res.status(404).json({message : "Transactions Not Found"});
   
    if (transaction.userId.toString() !== req.user.id) {
     return res.status(403).json({ message: "Unauthorized to update this transaction" });
   }//Ensures that The transaction belongs to a specific user

   transaction.amount = amount || transaction.amount;
   transaction.category = category|| transaction.category;
   transaction.type = type || transaction.type;
   transaction.date = date || transaction.date;
   transaction.isRecurring = isRecurring || transaction.isRecurring;
   transaction.recurrencePattern = recurrencePattern || transaction.recurrencePattern;
   transaction.endDate = endDate || transaction.endDate;
   transaction.tags = tags || transaction.tags;
   
   const updatedTransaction = await transaction.save();
   if(!updatedTransaction) return res.status(404).json({message : "Error Occured In Updating Transaction"});
   res.status(201).json({message : "Transaction Updated Successfully and View The Updates" + "\n" + updatedTransaction});

   


   }catch(err){

    res.status(404).json(err);
   }

};

exports.deleteTransaction = async (req, res) =>{

  const transactionId = req.params.id;
  const transaction = await Transaction.findByIdAndDelete(transactionId);
  if(!transaction) return res.status(404).json({message : "Transaction Is Not Found"});

  if (transaction.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized to delete this transaction" });
  }

  
  res.status(201).json({message : "Transaction" + transactionId + "Deleted Successfully"});


};

exports.checkRecurringTransactions = async (req,res) => {
  try {
    // Get current date
    const currentDate = moment().startOf('day'); // Start of today to avoid time difference issues

    // Find all recurring transactions
    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      endDate: { $gte: currentDate }, // Ensure the recurring transaction has not ended
    });

    if (!recurringTransactions || recurringTransactions.length === 0) {
      console.log('No upcoming or missed recurring transactions.');
      return;
    }

    // Loop through all recurring transactions to check if they're due
    for (const transaction of recurringTransactions) {
      const { recurrencePattern, endDate, nextOccurrence, amount, category, type } = transaction;

      // Calculate the next expected occurrence based on the recurrence pattern
      let nextOccurrenceDate = moment(transaction.date);

      if (nextOccurrence) {
        nextOccurrenceDate.add(1, recurrencePattern); // Add based on recurrence pattern (daily, weekly, monthly)
      }

      // Check if the next occurrence is today or has been missed
      if (nextOccurrenceDate.isSameOrBefore(currentDate)) {
        // If the next occurrence is today or has passed, send a notification

        // Fetch user data from the User collection
       const user = await User.findById(transaction.userId);
        if (!user) {
          console.log('User not found');
          continue; // Skip this transaction if the user is not found
        }

        const email = user.email;
        const subject = `Upcoming Recurring Transaction: ${category}`;
        const message = `Your recurring transaction for ${category} is due today. Amount: ${amount} (${type}).`;

        // Send email notification
       const status =
        await sendNotification(email, subject, message);
        if(!status) return res.status(404).json({message : "Error Occured In Sending Notification"});
        res.status(201).json({message : "Email Sent Successfully"});
        

        // Update the next occurrence date for future reference
        transaction.nextOccurrence = nextOccurrenceDate;
        await transaction.save();
      }
    }
  } catch (err) {
    console.error('Error checking recurring transactions:', err);
  }
};