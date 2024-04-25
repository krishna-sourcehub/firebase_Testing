const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerInfoSchema = new Schema({
    providerId: {
        type: String,
        required: true,
    },
    federatedId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    rawId: {
        type: String,
        required: true,
    }
});

const userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        isVerified: {
            type: Boolean, // Change to Boolean for true/false
            required: true,
        },
        providerInfo: {
            type: [providerInfoSchema], // Use sub-schema for providerInfo
            required: true,
        },
        validSince: {
            type: Date, // Change to Date
            required: true,
        },
        lastLoginAt: {
            type: Date, // Change to Date
            required: true,
        },
        lastRefreshAt: {
            type: Date, // Change to Date
            required: true,
        },
        Session: {
            type: String,
        },
    },
    {
        collection: "firebase_users",
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

module.exports = mongoose.model("firebase_users", userSchema);
