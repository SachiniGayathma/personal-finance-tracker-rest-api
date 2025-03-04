const Transaction = require('../models/TransactionSchema');

exports.createTransaction = async (req, res) => {
  const { amount, category, type, date, isRecurring, recurrencePattern, endDate,tags} = req.body;
  
  // Assuming the user's ID is available from the authenticated request (after login)
  const userId = req.user.id;

  try {
    const newTransaction = new Transaction({
      userId, // associate the transaction with the logged-in user
      amount,
      category,
      type,
      date,
      isRecurring,
      recurrencePattern,
      endDate,
      tags : tags || []
    });

    const transaction = await newTransaction.save();
    if (!transaction) {
      return res.status(404).json({ message: "Error occurred while saving the transaction" });
    }
    
    res.status(201).json({ message: "Transaction saved successfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error creating transaction", error: err });
  }
};

exports.getllTransactions = async (req,res)=>{

  try{

    const userId = req.user.id;

    const transaction = await Transaction.find({userId});
    if(!transaction) return res.status(404).json({message : "Transactions Are Not Available"});
    res.status(201).json({message : `Your Transaction History as Below/n" ${transaction}`});


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