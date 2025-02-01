const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Task Management API!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Start server
app.listen(process.env.PORT, () =>
    console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
);
