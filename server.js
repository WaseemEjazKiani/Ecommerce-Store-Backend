const app = require("./app")
const dotenv= require("dotenv")
const cloudinary = require("cloudinary");
const connecDatabase = require("./config/database")

////////////////////////////////                  Server DB LINK Disturbed              ////////////////////////////////
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message} `);
    console.log("shutting server down due to Uncaught Exception Error ");
    process.exit(1);
})

dotenv.config({path:"backend/config/config.env"});
connecDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`I am running on ${process.env.PORT}`)
})



////////////////////////////////                  Server DB LINK Disturbed              ////////////////////////////////

process.on("unhandledRejection",(err)=>{
        console.log(`Error: ${err.message} `);
        console.log("shutting server down due to unhandled promise Rejection ")
        server.close(()=>{
        process.exit(1);
    })
})