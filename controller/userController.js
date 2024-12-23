const User = require('../model/userModel')
const bcrypt = require('bcryptjs')

// checks User is already present,validates based on User schema and Hash the password
userRegistration = async (req,res)=>{
  try{
    let user = await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).send({message:"User already exists"})
    }
    if(req.body.password){
      req.body.password = await  bcrypt.hash(req.body.password,8)
    }
    const newUser =  new User(req.body)
    await newUser.save()
    res.status(200).send({
      message:"Registration  Successful",
      newUser
    })
  }
  catch(error){
    res.status(500).send({"message":error})
  }
}

// Verifys user credentials generate JWT and Return token to the user
userLogin = async (req,res)=>{
  let user = await User.findOne({email:req.body.email})
  if(!user){
    return res.status(400).send({message:"User not found.Please Check your credentials"})
  }
  let isValidPassword = await bcrypt.compare(req.body.password,user.password);
  if(!isValidPassword){
    return res.status(400).send({message:"Incorrect Password.Please Check your credentials"})
  }
  if(user && isValidPassword){
    const token = await user.generateAuthToken()
    res.status(200).send({
      message:"User loggin successful",
      user,
      token
    })
  }
}

// after token verified the gives the user information
userInfo = async (req,res)=>{
  try{
    res.status(200).send({token:req.token,user:req.user})
  }catch(error){
    res.status(500).send({"message":error})
  }
}

userUpdate = async (req,res)=>{
  try{
    let alteredUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!alteredUser){
      return res.status(400).send({"message":"User with this id not Found"})
    }
    res.status(200).send({
      "message": "User updated",
      alteredUser
    })
  }catch(error){
    res.status(500).send({"message":error})
  }
}

module.exports = { userRegistration,userLogin,userInfo,userUpdate }