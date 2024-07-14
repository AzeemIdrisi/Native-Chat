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
const port = 8000;
dotenv.config({ path: ".env" });

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
