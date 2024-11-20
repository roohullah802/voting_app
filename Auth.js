const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthMiddleware = (req,res,next)=>{
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token){
        return res.status(401).json("Unauthorized");
    }

    const decode = jwt.verify(token,process.env.SECRET_KEY);

    req.user = decode;
    next();
    
  } catch (error) {
    res.status(401).json({
        message:"invalid token"
    })
  }


}

const generateToken = (userData)=>{
  return jwt.sign(userData,process.env.SECRET_KEY);
}


module.exports = {jwtAuthMiddleware,generateToken};