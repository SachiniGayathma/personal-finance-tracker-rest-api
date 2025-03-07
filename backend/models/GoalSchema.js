const mongoose = require('mongoose');


const GoalSchema = new mongoose.Schema({

    userId :{

        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    title : {

        type : String,
        required : true
    },

    targetAmount :{

        type : Number,
        required : true

    },

    currentSavings :{

        type :Number,
        default : 0
    },

    deadline : {

        type : Date,
        required : true
    },

 

    cretedAt :{

        type : Date,
        default : Date.now
    }


})

module.exports = mongoose.model("Goal", GoalSchema);