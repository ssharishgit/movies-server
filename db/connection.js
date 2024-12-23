const mongoose =  require('mongoose')

// initiating the MongoDB atlas connection using Mongoose
const connection = async()=>{
  try{
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    if(connect){
      console.log("Connected to MongoDB");
    }
  }catch(err){
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connection;
