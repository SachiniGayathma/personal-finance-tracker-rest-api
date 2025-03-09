
const budgetSchema = require('../models/BudgetSchema');
const sendNotification = require('../utils/mailer');
const User = require('../models/User');




exports.createBudget = async (req, res)=>{

    try{

        const userId = req.user.id;
        const {category,amount,spentAmount,startDate,endDate} = req.body;
        const newBudget = new budgetSchema({userId,category,amount,spentAmount : 0,startDate,endDate})
        await newBudget.save();
        res.status(201).json({message : "Budget Saved Successfully"})
       
        

    }catch(err){

        res.status(404).json(err);
    }
    

};

exports.viewAllBudgets = async (req, res) => {
    try {
      const userId = req.user.id;
      
      
      const budgets = await budgetSchema.find({ userId });
  
     
      if (budgets.length === 0) {
        return res.status(404).json({ message: "No budgets found for this user" });
      }
  
     
      res.status(200).json({ budgets });
  
    } catch (err) {
      
      res.status(500).json({ message: 'Error fetching budgets', error: err.message });
    }
  };
  

  exports.updateBudget = async (req, res) => {
    try {
      const budgetId = req.params.id;
      const { category, amount, startDate, endDate } = req.body;
  
      // Find the budget by ID
      const budget = await budgetSchema.findById(budgetId);
      if (!budget) {
        return res.status(404).json({ message: "Budget Not Found" });
      }
  
      // Ensure that the budget belongs to the authenticated user
      if (budget.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this budget" });
      }
  
      // Update only the provided fields
      if (category) budget.category = category;
      if (amount) budget.amount = amount;
      if (startDate) budget.startDate = startDate;
      if (endDate) budget.endDate = endDate;
  
      // Save the updated budget
      const updatedBudget = await budget.save();
  
      res.status(200).json({
        message: "Budget Updated Successfully",
        budget: updatedBudget,
      });
  
    } catch (err) {
      res.status(500).json({ message: "Error Updating Budget", error: err.message });
    }
  };
  

  exports.deleteBudget = async(req,res)=>{

    try{const userId = req.params.id;
      const budget = await budgetSchema.findByIdAndDelete(userId);
      if(!budget) return res.status(404).json({message : "Budget Not Found"});
      // Ensure that the budget belongs to the authenticated user
      if (budget.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this budget" });
      };

      res.status(201).json({message:`Budget ${budget} deleted successfully`})
    }catch(err){

      res.status(404).json(err);
    }

  }

  exports.checkBudgetFlow = async (req, res) => {
    try {
        // Fetch all budgets that are within the current date range
        const budgets = await budgetSchema.find({ 
            endDate: { $gte: new Date() }, 
            startDate: { $lte: new Date() }
        }).populate('userId');  // Populate user details

        // Loop through each budget and check if they are nearing or exceeding
        for (let budget of budgets) {
            const { userId, amount, spentAmount } = budget;
            const user = userId; // You can also use user details if needed

            if (spentAmount >= amount) {
                // Budget has been exceeded
                await sendNotification(user.email,"Budget Exceeded" ,`Your budget of ${amount} has been exceeded.`);
            } else if (spentAmount >= amount * 0.9) {
                // Budget is nearing, spent amount is over 90%
                await sendNotification(user.email,"Budget Is Nearing" ,`You are nearing your budget limit of ${amount}. You have spent ${spentAmount}.`);
            }
        }

        res.status(200).json({ message: 'Budget check completed.' });
    } catch (error) {
        console.error(`Error checking budget flow: ${error}`);
        res.status(500).json({ message: 'Error checking budget flow', error });
    }
};

