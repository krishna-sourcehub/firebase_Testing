const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.Atlas_Secret);
        console.log("Database Connection Established");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
};

module.exports = connectDb;
