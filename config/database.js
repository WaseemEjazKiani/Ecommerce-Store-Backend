const mongoose = require("mongoose");

const connecDatabase = ()=>{
    mongoose.connect("mongodb://localhost:27017/Big").then((data)=>{
        console.log("yahooo");
    })

}

module.exports = connecDatabase