const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require('./routes/user');
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require('./routes/enrollment');



const app = express();
require('dotenv').config();


// Google Login
const passport = require('passport');
const session = require('express-session');
require('./passport');


const corsOptions = {

    origin: ['http://localhost:8000'],

    credentials: true, //(cookies, authorization headers)
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRoutes);
app.use("/courses", courseRoutes);
app.use('/enrollment', enrollmentRoutes)

app.use(
  session({
    secret: process.env.clientSecret,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(process.env.MONGODB_STRING)

mongoose.connection.once('open', () => {
    console.log("Now connected to MongoDB Atlas");
});

if(require.main === module){
    app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`));
}


module.exports = {app,mongoose};