const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    ///////////////////////     CAST    ERROR   ////////////////////////////////
    if(err.name === "CastError"){
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 404);
    }


    ///////////////////////     Duplicate Key Email Error   ////////////////////////////////  
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Error`;
        err = new ErrorHandler(message, 404);
    }
///////////////////////     JSON WEB TOKEN Error   ////////////////////////////////  
if(err.name === "JsonWebTokenError"){
    const message = `Json Web Token Error, Please Try Again`;
    err = new ErrorHandler(message, 400);
}
///////////////////////     JWT Expire Error   ////////////////////////////////  
if(err.name === "TokenExpiredError"){
    const message = `Json Web Token is Expired, Please Try Again`;
    err = new ErrorHandler(message, 400);
}


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};