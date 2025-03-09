const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link transaction to a user
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  date: { type: Date, required: true },
  tags :[{type : String }],


  savingValue :{

    type : Number,
    default :0

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
