const User = require("../models/user");

const roleChecker = async(userId)=>{

    try {
        const user = await User.find(userId);
    if (user.role === "admin") {
        return true
    }

    } catch (error) {
        return false        
    }
}

module.exports = roleChecker;