const jwt = require('jsonwebtoken');
require("dotenv").config();

const jwtAuthMiddleware = (req, res, next) => {

    
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' });


    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try{
       
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

       
        req.user = decoded
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}



const generateToken = (userData) => {
   
    return jwt.sign(userData, process.env.SECRET_KEY, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};