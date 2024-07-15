//Importing dependencies

const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");

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

// Signup
app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;

  if (!email || !name || !password || !image) {
    return res.status(404).json({
      message: "All fields are required",
    });
  }

  //Check if user already exist with this email
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
      });
    }
  });
  // Create a new user
  const newUser = new User({ name, email, password, image });
  newUser
    .save()
    .then(() => {
      return res.status(200).json({
        message: "User registered.",
        success: true,
      });
    })
    .catch((e) => {
      console.log("User registration error : ", e);
      return res
        .status(500)
        .json({ message: "Error in registration.", success: false });
    });
});

function createToken(userID) {
  const payload = {
    userID: userID,
  };

  const token = jwt.sign(payload, "lskdjoii5473iiiiiiiiii76iiiiirj34", {
    expiresIn: "1h",
  });
  return token;
}
//Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "Invalid credentials",
    });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // User not found
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Comparing passwords
      if (user.password !== password) {
        return res.status(404).json({
          message: "Invalid password",
        });
      }

      const token = createToken(user._id);
      return res.status(200).json({ token });
    })
    .catch((e) => {
      console.log("Error in finding user e : ", e);
      res.status(500).json({
        message: "Internal server error",
      });
    });
});

//Get other users
app.get("/users/:userID", async (req, res) => {
  const loggedInUserID = req.params.userID;

  await User.find({ _id: { $ne: loggedInUserID } })
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        message: "Error retrieving users",
      });
    });
});

// Sending Friend Requests

app.post("/friend-request", async (req, res) => {
  const { currentUserID, selectedUserID } = req.body;
  try {
    //Update senders sent requests array
    await User.findByIdAndUpdate(currentUserID, {
      $addToSet: { sentFriendRequests: selectedUserID },
    });
    //Update recievers recieved request array
    await User.findByIdAndUpdate(selectedUserID, {
      $addToSet: { friendRequests: currentUserID },
    });

    return res.status(200).json({ message: "Request sent", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});
app.post("/friend-request/accept", async (req, res) => {
  const { currentUserID, selectedUserID } = req.body;
  try {
    //Finding users
    const sender = await User.findById(currentUserID);
    const receiver = await User.findById(selectedUserID);

    //Adding friends
    await User.findByIdAndUpdate(sender._id, {
      $addToSet: { friends: selectedUserID },
    });

    // Push currentUserID into receiver's friends if it doesn't already exist
    await User.findByIdAndUpdate(receiver._id, {
      $addToSet: { friends: currentUserID },
    });

    receiver.friendRequests = receiver.friendRequests.filter(
      (request) => request._id.toString() !== currentUserID.toString()
    );
    sender.friendRequests = sender.sentFriendRequests.filter(
      (request) => request._id.toString() !== selectedUserID.toString()
    );

    await sender.save();
    await receiver.save();
    return res.status(200).json({ message: "Request accepted", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

// Show all friend requests

app.get("/requests/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await User.findById(userID)
      .populate("friendRequests", "name email image")
      .lean();
    const friendRequests = user.friendRequests;
    res.status(200).json({ friendRequests, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

async function reset() {
  const all = await User.find();
  await all.forEach((element) => {
    element.friends = [];
    element.friendRequests = [];
    element.sentFriendRequests = [];
    element.save();
  });
}
// reset();

// Get all friends of the logged in user
app.get("/all-friends/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID).populate(
      "friends",
      "name email image"
    );
    const allFriends = user.friends;

    return res.status(200).json({ allFriends, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

// Post messages
// Image upload facility : Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/messages/", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderID, receiverID, messageType, message } = req.body;

    const newMessage = new Message({
      senderID,
      receiverID,
      messageType,
      message,
      timeStamp: new Date(),
      imageURL: messageType === "image" ? req.file.path : null,
    });
    await newMessage.save();
    return res.status(200).json({
      success: true,
      message: "Message sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

// get user details for DM
app.get("/user/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await User.findById(userID);

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

// get conversation

app.get("/messages/:senderID/:receiverID", async (req, res) => {
  try {
    const senderID = req.params.senderID;
    const receiverID = req.params.receiverID;

    const messages = await Message.find({
      $or: [
        {
          senderID: senderID,
          receiverID: receiverID,
        },
        {
          senderID: receiverID,
          receiverID: senderID,
        },
      ],
    }).populate("senderID", "_id name");

    return res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

// get user's friend requests
app.get("/sent-requests/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const sentRequests = await User.findById(userID).populate(
      "sentFriendRequests",
      "_id name"
    );
    return res.status(200).json({
      success: true,
      sentRequests: sentRequests.sentFriendRequests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Some error", success: false });
  }
});

const path = require("path");
app.use("/files", express.static(path.join(__dirname, "files")));
app.get("/files", (req, res) => {
  const imagePath = path.join(
    __dirname,
    "files",
    "721055916441-781746627-image.jpg"
  );
  res.sendFile(imagePath);
});
