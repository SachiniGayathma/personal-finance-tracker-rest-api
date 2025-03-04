
const budgetSchema = require('../models/BudgetSchema');




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