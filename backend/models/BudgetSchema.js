const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({


    userId : {

        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    category : {

        type : String,
        required: true
    },

    amount : {

        type : Number,
        required: true
    },

    spentAmount : {

        type : Number,
        default : 0
    },


    startDate : {

        type : Date,
        required : true
    },

    endDate : {

        type: Date,



    },



});

module.exports = mongoose.model('Budget', BudgetSchema);