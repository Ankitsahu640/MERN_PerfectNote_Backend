const mongoose = require('mongoose');
require("dotenv").config();
const dbUrl = process.env.DB;
mongoose.set('strictQuery', false);


const connectdb = ()=>{
    mongoose.connect(dbUrl,{
        useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log("server problem ",e);
});
}

module.exports = connectdb;