const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

// middleware function to verify the JWT from the request headers
const auth = async(req,res,next)=> {
  try{
    const token = req.header('Authorization').replace("Bearer ","")
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    const user = await User.findOne({_id:decoded._id})
    req.user = user
    req.token = token
  
    next()
  }catch(error){
    res.status(500).send({"error message":error})
  }
  
}

module.exports = auth;