const mongoose = require("mongoose");

  const candidateSchema = new mongoose.Schema([
    {
        name:{
            type:String,
            required:true
        },
        age:{
            type:String,
            required:true
        },
       party:{
            type:String,
            required:true
        },
        votes:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true
                },
                votingId:{
                    type: Date,
                    default: Date.now()
                }
            }
        ],
        votesCounting:{
            type:Number,
            required:true
        }
    }
],{timestamps:true});

const Candidate = mongoose.model("User",candidateSchema);

module.exports = Candidate;