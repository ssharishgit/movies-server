const mongoose =  require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  //define user schema
  username:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email")
      }
    }
  },
  password:{
    type: String,
    required: true,
    validate(value){
      if(value.toLowerCase().includes("password")){
        throw new Error("Should not contian password")
      }
      else if(!validator.isStrongPassword(value)){
        throw new Error("Enter a strong password")
      }
    }
  },
  language:{
    type: String,
    required: false
  },
  location:{
    type: String,
    required: true
  },
})

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);
  return token;
}

const User = mongoose.model('User',userSchema)
module.exports = User