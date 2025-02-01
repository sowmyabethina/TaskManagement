const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        // Use IPv4 address explicitly (127.0.0.1) to avoid the ::1 issue
        await mongoose.connect('mongodb://127.0.0.1:27017/taskManagerDB');
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Database Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
