// const router = require("express").Router();
// const User = require("../models/user");
// const { generateToken } = require("../Auth");
// const bcrypt = require("bcrypt");
// const { jwtAuthMiddleware } = require("../Auth");

// router.post("/register", async (req, res) => {
//     try {
//         const hashPassword = await bcrypt.hash(req.body.password, 10);

//         const data = {
//             name: req.body.name,
//             email: req.body.email,
//             age: req.body.age,
//             address: req.body.address,
//             phoneNo: req.body.phoneNo,
//             cnicCardNumber: req.body.cnicCardNumber,
//             DOB: req.body.DOB,
//             password: hashPassword,
//             role: req.body.role
//         }

//         const user = await User.create(data);
//         const newUser = await user.save();

//         const payload = {
//             userId: user._id,
//             username: user.name,
//             password: user.password,
//             role: user.role
//         }

//         const userToken = generateToken(payload);

//         if (!userToken) {
//             return res.status(401).json("token not generated");
//         }
//         res.status(200).json({
//             newUser,
//             userToken
//         });
//     } catch (error) {
//         res.status(401).json("internal server error")
//     }
// });


// router.post("/login", jwtAuthMiddleware, async (req, res) => {
//     const { cnicCardNumber, password } = req.body;

//     const user = await User.findOne({ cnicCardNumber: cnicCardNumber });

//     if (!user) {
//         return res.status(404).json("invalid cnic number")
//     }

//     const isPass = await bcrypt.compare(password, user.password);

//     if (isPass == false) {
//         return res.status(401).json("password incorrect")
//     }

//     const payload = {
//         userId: user._id,
//         username: user.name,
//         password: user.password,
//         role: user.role
//     }

//     const userToken = generateToken(payload);

//     if (!userToken) {
//         return res.status(401).json("token not generated");
//     }

//     res.cookie("token", userToken)
//     res.status(200).json({
//         user,
//         isPass,
//         userToken
//     });

// });

// router.get("/profile", jwtAuthMiddleware, async (req, res) => {

//     try {
//         const userId = req.user;
//         const response = await User.findById(userId);

//         if (!response) {
//             return res.status(401).json("User not found");
//         }

//         res.status(200).json({
//             message: "User found",
//             response
//         })

//     } catch (error) {
//         res.status(404).json("internal server error")
//     }


// });

// router.post("/profile/password", jwtAuthMiddleware,async (req, res) => {

//     const { currentPassword, newPassword } = req.body;

//     const userId = req.user;
//     const user = await User.findById(userId);

//     if (!user) {
//         return res.status(400).json("user not found")
//     }

//     const isPass = await bcrypt.compare(user.password, currentPassword);
//     if (!isPass == false) {
//         return res.status(400).json("username or password incorrect")
//     }

//     user.password = newPassword;

//     res.status(200).json("password updated")
// });
// module.exports = router;



// // {
// //     "name":"roohullah",
// //     "email":"roohullah@gmail.com",
// //     "age":23,
// //     "address":"peshawar",
// //     "phoneNo":"03489561308",
// //     "cnicCardNumber":"1730156273757",
// //     "DOB":"12/3/2002",
// //     "password":"pakistan12345"

// // }




const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken} = require('../Auth');


router.post('/register', async (req, res) =>{
    try{
        const data = req.body 

  
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }


        if (!/^\d{12}$/.test(data.cnicCardNumber)) {
            return res.status(400).json({ error: 'cnicCardNumber must be exactly 12 digits' });
        }

        
        const existingUser = await User.findOne({ cnicCardNumber: data.cnicCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same cnicCardNumber already exists' });
        }


        const newUser = new User(data);

      
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


router.post('/login', async(req, res) => {
    try{
    
        const {cnicCardNumber, password} = req.body;

      
        if (!cnicCardNumber || !password) {
            return res.status(400).json({ error: 'cnicCardNumber Number and password are required' });
        }

   
        const user = await User.findOne({cnicCardNumber: cnicCardNumber});

       
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid cnicCardNumber or Password'});
        }

    
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

     
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; 
        const { currentPassword, newPassword } = req.body; 

      
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

     
        const user = await User.findById(userId);

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

   
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;