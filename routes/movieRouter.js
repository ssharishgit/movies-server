const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const { userRegistration,userLogin,userInfo,userUpdate } = require('../controller/userController')

const router = express.Router()

router.post('/users/register',userRegistration)

router.post('/users/login',userLogin)

router.get('/users/info',auth,userInfo)

router.put('/users/:id',userUpdate)

router.get('/theatres', async (req, res)=> {
  try {
    const db = mongoose.connection.db;
    const theatresCollection = db.collection('theatres');
    const theatres = await theatresCollection.find({}).toArray();
    
    if (!theatres || theatres.length === 0) {
      return res.status(404).json({
        message: "No theatres found",
        status: "Not Found"
      });
    }
    res.status(200).json({
      data: theatres
    });
  } catch (error) {
    console.error('theatres retrieval error:', error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

router.post('/theatres/adminlogin', async (req,res)=>{
  try{
    const db = mongoose.connection.db;
    const theatresCollection = db.collection('theatres');
    const theatre = await theatresCollection.findOne({email:req.body.email});
    if(!theatre){
      return res.status(400).send({message:"Theatre not found,Please enter correct email"});
    }else{
      if(theatre.password !== (req.body.password).toString().trim()){
        return res.status(400).send({message:"Invalid credentials"});
      }else{
        res.status(200).send({
          message:"Admin login successful",
          theatre,
        })
      }
    }
    
  }catch(error){
    res.status(500).send({"message":error});
  }
})

router.put('/updatedetails/:id',async (req,res)=>{
  try{
    const db = mongoose.connection.db;
    const theatresCollection = db.collection('theatres');

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }
    const filter = { _id: id };
    const update = { $set: req.body };

    let updateTheatre = await theatresCollection.findOneAndUpdate(filter, update, {
      returnDocument: 'after', 
      runValidators: true,
    });
    if(!updateTheatre){
      return res.status(400).send({"message":"Theatre not Found"})
    }
    res.status(200).send({ message: "Theatre updated", updateTheatre })
  }catch(error){
    res.status(500).send({"message":error.message || "Some Internal Error"});
  }
})

router.put('/theatres/:id', async (req,res)=>{
  try{
    const db = mongoose.connection.db;
    const theatresCollection = db.collection('theatres');

    const { id } = req.params; 
    const showId = Number(req.body.id); 
    const newBooking = req.body.booking; 
    const movie = newBooking.movie;
    const date = newBooking.date;

    const theatre = await theatresCollection.findOne({
      "_id": Number(id),
      "shows.id": showId,
    });
    if (!theatre) {
      return res.status(404).send({ message: "Theatre or show not found" });
    }

    const show = theatre.shows.find(show => show.id === showId);

    if (!show) {
      return res.status(404).send({ message: "Show not found" });
    }

    const existingBooking = show.booking.find(
      booking => booking.movie === movie && booking.date === date
    );

    if (existingBooking) {
      const updateResult = await theatresCollection.updateOne(
        {
          "_id": Number(id),
          "shows.id": showId,
        },
        {
          $push: {
            "shows.$[show].booking.$[booking].booked_seats": {
              $each: newBooking.booked_seats,
            },
          },
        },
        {
          arrayFilters: [
            { "show.id": showId },
            { "booking.movie": movie, "booking.date": date },
          ],
        }
      );
      return res.status(200).send({ message: "Seats updated", updateResult });
    } else {
      const updateResult = await theatresCollection.updateOne(
        {
          "_id": Number(id),
          "shows.id": showId,
        },
        {
          $push: {
            "shows.$[show].booking": newBooking,
          },
        },
        {
          arrayFilters: [{ "show.id": showId }],
        }
      );
      return res.status(200).send({ message: "New booking", updateResult });
    }
  }catch(error){
    res.status(500).send({"message":error.message || "Some Internal Error"});
  }
})

module.exports = router