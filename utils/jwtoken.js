exports.sendToken = (user, statusCode, res)=>{
    const token =  user.getJWTToken();
    const options={
        expires: new Date( Date.now + process.env.JWT_EXPIRE *24 *60* 60*1000),
        httpOnly: true
    }
    res.status(statusCode).cookie(`token`,token).json({
        success: true,
        user,
        token
    })
}