//Importing dependencies

const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Initializing App
const app = express();

// Environment variable setip
dotenv.config({ path: ".env" });
const port = 8000;

//Setting up middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Connecting with the Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("\nConnected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Starting Server
app.listen(port, () => console.log(`\nServer started at ${port}`));

// Importing Database Objects
const User = require("./models/user.js");
const Message = require("./models/message.js");

// API Endpoints

app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;

  // Create a new user
  const newUser = new User({ name, email, password, image });
  newUser
    .save()
    .then(() => {
      res.status(200).json({
        message: "User registered.",
        success: true,
      });
    })
    .catch((e) => {
      console.log("User registration error : ", e);
      res
        .status(500)
        .json({ message: "Error in registration.", success: false });
    });
});
