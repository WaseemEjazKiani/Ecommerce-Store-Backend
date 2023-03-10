const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const {sendToken} = require("../utils/jwtoken")
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
//// Register User


exports.registerUser = catchAsyncErrors( async(req, res, next)=>{
    const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    })
    const {name , email , password} = req.body;

    const user = await User.create({
        name , email , password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        } 
    })
    sendToken(user,200,res);
});


exports.loginUser = catchAsyncErrors( async(req, res, next)=>{

    const {email , password} = req.body;
    console.log("recieved values",email,password);

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password"));
    }
    const user = await User.findOne({email}).select("+password");
    console.log("all done");

    if(!user){
        console.log("User not found");
        return next(new ErrorHandler("Invalid Email or Password"));
    }
    const isPasswordMatch = user.comparePassword(password);

    if(!isPasswordMatch){
        
        console.log("Email or password");
        return next(new ErrorHandler("Invalid Email or Password"));
    }

    sendToken(user,200,res);

})

exports.logout = catchAsyncErrors( (req, res, next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: " Logout Successfully"
    })
})


exports.forgotPassword = catchAsyncErrors( async (req, res, next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User Not Found",404));
    }
    const resetToken = user.getPasswordResetToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/pasword/${resetToken}`;

    const message = ` Your Password Reset Token is :- \n \n ${resetPasswordUrl} \n \n if you donot have 
    requested it then Ignore`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        })
        res.status(200).json({
            success:true,
            message: `Message send to ${user.email} Successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire= undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message,500));
    }
})



exports.resetPassword = catchAsyncErrors( async (req, res, next)=>{
    const resetToken = req.params.token;
    
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    
    if(!user){
        return next(new ErrorHandler("Reset Password Token is not Valid or Expired",400));
    };

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password Doesnot Match",400));
    };

    user.password = req.body.password;
    user.PresetPasswordToken= undefined;
    user.resetPasswordExpire= undefined;

    await user.save();
    sendToken(user,201,res);
})

/////////////////////////////// User Apni Details Dekhnay K liyeee //////////////////////////////

exports.getUserDetails = catchAsyncErrors( async (req, res, next)=>{
    console.log("done");
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
})

/////////////////////////////// User Apna Password Change Kary //////////////////////////////

exports.updatePassword = catchAsyncErrors( async (req, res, next)=>{
    
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next( new ErrorHandler("Old Pasword is Incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next( new ErrorHandler("Password Doesnot Match", 400));    
    }

    user.password= req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
})


/////////////////////////////// Update User Profile //////////////////////////////

exports.updateUserProfile = catchAsyncErrors( async (req, res, next)=>{
    
    const {name,email}= req.body;

    const user = await User.findByIdAndUpdate(req.user.id,{name,email});
    res.status(200).json({
        success: true,
        message:"Updated Successfully"
    })
})


exports.getAllUsers = catchAsyncErrors( async (req, res, next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})


exports.getSingleUser = catchAsyncErrors( async (req, res, next)=>{

    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler("User Does not Exist",400));
    };

    res.status(200).json({
        success:true,
        user
    })
});


exports.updateUserRole = catchAsyncErrors( async (req, res, next)=>{
    
    const role= req.body.role;
    const id = req.params.id;

    console.log(id);
    console.log(role);

    const user = await User.findById(id);
    user.role= role;
    await user.save();
    
    res.status(200).json({
        success: true,
        message:"Role Updated Successfully"
    })
})


exports.deleteUser = catchAsyncErrors( async (req, res, next)=>{
    
    const id = req.params.id;

    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("User Does not Exist",400));
    };

    await user.remove();
    
    res.status(200).json({
        success: true,
        message:"User Deleted Successfully"
    })
})