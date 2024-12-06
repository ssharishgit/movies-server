const userRoutes = require("./routes/userRouter")
const dotenv = require('dotenv')
const cors = require('cors')
const connection =  require('./db/connection')

const express = require('express');
const app =  express()
dotenv.config()

//start our server PORT establish the connection
const PORT = 8001;
app.use(cors())
connection()
//  serever response will be in the JSON format
app.use(express.json())

// root end point
app.get('/',(req,res)=>{
  res.send("User Authentication and Authorization")
})

app.use(userRoutes)
// listen to port
app.listen(PORT,()=>{
  console.log("Server started at",PORT)
})