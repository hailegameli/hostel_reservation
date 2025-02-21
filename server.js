//importing required modules
const express = require('express');//express is used to create web server
const readline = require('readline');//readline 
const mongoose = require('mongoose');//used to connect with MongoDB
const app = express();
const MongoDBURI=process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel';
//.connect connects to the MongoDB database hostel running on the localhost.
mongoose.connect(MongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true });
//defines the schema for the Reservation model
const reservationSchema = new mongoose.Schema({
  StudentName: String,
  FatherName: String,
  email: String,
  phoneNumber: String,
  Branch: String,
  Year: String,
  MeritScore: Number,
  Category: String,
  Appstatus: String,
});
//creates the Reservation model based on the defined schema.
const Reservation = mongoose.model('Reservation', reservationSchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//get access the information from the server to display it on localhost
app.get('/', (req, res) => {
  res.render('index');
});
// It extracts information from the submitted form
app.post('/reserve', async (req, res) => {
  const {
    StudentName,
    FatherName,
    email,
    phoneNumber,
    Branch,
    Year,
    dateOfBirth,
    MeritScore,
    Category,
  } = req.body;

//creating reservation to display the details on MongoDB
  const reservation = new Reservation({
    StudentName,
    FatherName,
    email,
    phoneNumber,
    Branch,
    Year,
    MeritScore,
    Category,
  });
//sets the application status to the Appstatus based on condition
  if (MeritScore>80) {
    reservation.Appstatus = 'Seat Allocated';
  } else {
    reservation.Appstatus = 'Seat Not Allocated';
  }
  await reservation.save();
  console.log(reservation)
  res.render('result', { reservation });
});
//This starts the server on the specified port and logs a message to the console when the server is running.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
