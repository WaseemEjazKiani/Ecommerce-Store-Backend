const { use } = require("express/lib/application");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed from 30 characters"],
        minLength: [4, "Name should have more then 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"] 
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have minimum 8 characters"],
        select: false
    },
    avatar:{
            public_id:{
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
    role:{
        type: String,
        default: "user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
});


userSchema.pre("save", async function(next){
    
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password, 10);

})

userSchema.methods.getJWTToken= function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET)
}

userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
/// Generate Pasword Reset Token

userSchema.methods.getPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   

    this.resetPasswordExpire = Date.now() + 15 *60* 1000;
    
    return resetToken;

}


module.exports =  mongoose.model("User",userSchema);



