const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./routes/userRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limit


app.use('/api/auth', userRouter);


mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser : true , useUnifiedTopology: true})
.then(()=>{

    console.log("Connected With Mongo DB Successfully");
}).catch((err)=>{

    console.log("Error Occured in connecting with Mongo DB");
});

const PORT = 8000;

app.listen(PORT, ()=>{

    console.log(`Application run on seerver port ${PORT}`);
});

