// const mongoose = require("mongoose");


// const userSchema = new mongoose.Schema([
//     {
//         name:{
//             type:String,
//             required:true
//         },
//        email: {
//             type:String,
//             required:true
//         },
//         age:{
//             type:Number,
//             required:true
//         },
//         address:{
//             type:String,
//             required:true
//         },
//         phoneNo:{
//             type:String,
//             required:true
//         },
//         cnicCardNumber:{
//             type: String,
//             required: true
//         },
//         DOB:{
//             type:String,
//             required:true
//         },
//         password:{
//             type:String,
//             required:true
//         },
//         isVoted:{
//             type:Boolean,
//             default:false
//         },
//         role:{
//             type:String,
//             enum:["voter","admin"],
//             default:"voter"
//         }

//     }
// ],{timestamps: true});

// const User = mongoose.model("User",userSchema);

// module.exports = User;




const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    cnicCardNumber: {
        type: Number,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});


userSchema.pre('save', async function(next){
    const person = this;

    
    if(!person.isModified('password')) return next();
    try{
   
        const salt = await bcrypt.genSalt(10);

      
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
   
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
   
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;