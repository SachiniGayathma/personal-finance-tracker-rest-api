const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link transaction to a user
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    default: null
    
  },
  date: { type: Date, required: true },
  tags :[{type : String }],

  goalId : {

    type : mongoose.Schema.Types.ObjectId,
    ref : "Goal",
    default: null
    


  },

  savingValue :{

    type : Number,
    required : true

  },

  // Recurring transaction fields
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { 
    type: String, 
    enum: ["daily", "weekly", "monthly"], 
    default: null,
  },
  endDate: { 
    type: Date, 
    default: null,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
