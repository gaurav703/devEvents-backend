const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { storage } = require("./storage/storage");
const multer = require("multer");
const upload = multer({ storage });
const Event = require("./model/Event");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://gauravkamble704:doyx9WXdnScAj5w0@deveventdatabase.q3u1eea.mongodb.net/?retryWrites=true&w=majority&appName=DevEventdatabase",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
// const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Use routes
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// creating a route for event
app.post("/api/events/", upload.single("image"), async (req, res) => {
  try {
    console.log("req.files===", req.files);
    console.log("req.file===", req.file.path);
    const result = req.file.path;
    console.log("result=====", result);
    // Handle user registration
    const {
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      price,
      url,
      categoryId,
      organizer,
    } = req.body;
    console.log("reqbody==", req.body);
    const isFree = req.body.isFree === "true" ? true : false;

    const event = new Event({
      title: title,
      description: description,
      location: location,
      imageUrl: result,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      price: price,
      isFree: isFree,
      url: url,
      categoryId: categoryId,
      organizer: organizer,
    });

    console.log("event==", event);
    await event.save();
    res.status(201).send(event);
  } catch (err) {
    res.status(400).send(err);
    console.log("er", err);
  }
});

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the backend of the DevMeets app");
});

app.listen(PORT, () => {
  console.log("server is running on port 5000");
  console.log("http://localhost:5000");
});
