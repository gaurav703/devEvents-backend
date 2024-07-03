const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");

// Use routes
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the backend of the DevMeets app");
});

app.listen(PORT, () => {
  console.log("server is running on port 3000");
  console.log("http://localhost:3000");
});
