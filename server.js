const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
app.set("view engine","ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

   


app.listen(process.env.PORT,()=>{
    console.log(`the server is now running at ${process.env.PORT}`);
});