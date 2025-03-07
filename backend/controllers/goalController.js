const GoalSchema = require('../models/GoalSchema');


exports.createGoal = async(req,res)=>{

    try{
        
        
    const userId = req.user.id;
    const {title, targetAmount,currentSavings,deadline, createdAt} = req.body;
    const Goal = new GoalSchema({userId,title,targetAmount,currentSavings : 0,deadline,createdAt})
    const savedGoal = await Goal.save();
    if(!savedGoal) return res.status(404).json({message : "Goal Not found"});
    res.status(201).json({message : "Goal Saved Successfully",savedGoal});
    }catch(err){

        res.status(404).json(err);

    }
    

};


exports.allGoal = async (req,res) =>{


    const userId = req.user.id;
    const goals = await GoalSchema.find({userId});
    if(goals.length === 0) return res.status(404).json({message : "No Goals Found For This User"});
    res.status(201).json(goals)




};

exports.viewGoalById = async(req,res)=>{


    try{

    const userId = req.user.id;
    const goalId = req.params.id;
    const goal = await GoalSchema.findOne({_id :goalId});
    if(!goal) return res.status(404).json({message : "Goal Not Found"});
     // Ensure the goal belongs to the user
   if (goal.userId.toString() !== userId) {
    return res.status(403).json({ message: "Unauthorized to View this goal" });
   }

   res.status(201).json({message : "Goal Details As Below",goal});

    }catch(err){

        res.status(500).json({message : "Server Error",err});

    }

    

}


exports.updateGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const goalId = req.params.id;

        // Find the goal by ID
        const goal = await GoalSchema.findOne({ _id: goalId });
        if (!goal) return res.status(404).json({ message: "Goal Not Found" });

        // Ensure the goal belongs to the user
        if (goal.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to update this goal" });
        }

        // Extract fields from request body
        const { title, targetAmount, currentSavings, deadline, createdAt } = req.body;

        // Update the goal
        const updatedGoal = await GoalSchema.findByIdAndUpdate(
            goalId,
            { title, targetAmount, currentSavings, deadline, createdAt },
            { new: true }
        );

        if (!updatedGoal) return res.status(500).json({ message: "Error Occurred in Updating Goal" });

        res.status(200).json({ message: "Goal Updated Successfully", updatedGoal });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


exports.deleteGoal = async(req,res) =>{


    try{

const userId = req.user.id;
const goalId = req.params.id;
   // Find the goal by ID
   const goal = await GoalSchema.findOne({ _id: goalId });
   if (!goal) return res.status(404).json({ message: "Goal Not Found" });
    
   // Ensure the goal belongs to the user
   if (goal.userId.toString() !== userId) {
    return res.status(403).json({ message: "Unauthorized to update this goal" });
   }

   const deletedGoal = await GoalSchema.findByIdAndDelete({_id : goalId});
   if(!deletedGoal) return res.status(404).json({message : "Goal Not Found"});
   res.status(201).json({message : "Goal Deleted Successfully",deletedGoal});


    }catch(err){

        res.status(500).json({message : "Server Error",err});


    }






};

