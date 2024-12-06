const mongoose =  require('mongoose')

// initiating the MongoDB atlas connection using Mongoose
const connection = async()=>{
  let connect = mongoose.connect(process.env.MONGODB_URL)
  if(connect){
    console.log("Connected to MongoDB")
  }
}

module.exports = connection;
