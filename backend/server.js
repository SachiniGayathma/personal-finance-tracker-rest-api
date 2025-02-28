const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

require('dotenv').config();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser : true, useUnifiedTopology: true})
.then(()=>{

    console.log("Connected With Mongo DB Successfully.....");
}).catch((err)=>{

    console.log("Error Occured In Connecting With Mongo DB");

});

const PORT = 8000;

app.listen(PORT, ()=>{


    console.log(`App is running on Port ${PORT}`);
});