const connectdb = require("./connect");
require("dotenv").config();
const express = require("express");
const cors =require('cors');

connectdb();
const app = express();
const port = process.env.PORT || 5000;
// const port = 5000;

app.use(cors())
app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))

app.listen(port,()=>{
    console.log(`connection is setup at http://localhost:${port}`);
})