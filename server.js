const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const candidateRouter = require("./routes/candidateRoutes");
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

require("dotenv").config();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/user",userRoutes);
app.use("/candidate", candidateRouter);

   

connectDB();
app.listen(process.env.PORT,()=>{
    
    console.log(`the server is now running at ${process.env.PORT}`);
});



