const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require("./router/Route.js");
const app = express();

const PORT = process.env.PORT || 4000




app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


// database connection
connectDb()


// user signup
app.use('/api',userRouter)



app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})