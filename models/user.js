const mongoose = require("mongoose");


const userSchema = new mongoose.Schema([
    {
        name:{
            type:String,
            required:true
        },
       email: {
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        phoneNo:{
            type:String,
            required:true
        },
        cnicCardNumber:{
            type: String,
            required: true
        },
        DOB:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        isVoted:{
            type:Boolean,
            default:false
        },
        role:{
            type:String,
            enum:["voter", "admin"],
            default:"voter"
        }

    }
],{timestamps: true});

const User = mongoose.model("User",userSchema);

module.exports = User;