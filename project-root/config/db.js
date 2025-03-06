const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load .env manually
dotenv.config({ path: "./config/.env" });

const connectDB = async () => {
    try {
        console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging line

        await mongoose.connect(process.env.MONGO_URI, {
            
        });

        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
