const catchAsyncErrors = require("./catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthUser = catchAsyncErrors( async (req,res,next)=>{
    const {token} = req.cookies;
    console.log(token);
    if(!token){
        return next(new ErrorHandler("Please Login First",401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user= await User.findById(decodedData.id);
    next();
});


exports.authorizedRole = (...roles)=>{

    return (req,res,next)=>{
        
        if (!roles.includes(req.user.role)){
            
            return next(new ErrorHandler(`Roles: ${req.user.role} is not allowed to access this resource`,403));
        }
        next(); 
    }
};
