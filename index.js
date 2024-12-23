const movieRoutes = require("./routes/movieRouter")
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
  res.send("Movie Ticket Booking System")
})

app.use(movieRoutes)
// listen to port
app.listen(PORT,()=>{
  console.log("Server started at",PORT)
})