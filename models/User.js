const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        joinedOn: {
            type: Date,
            default: Date.now()
        },
        forgetPassword: {
            time: Date,
            otp: String,
        },
        gender: {
            type: String,
        },
        DOB: {
            type: String,
        },
        age: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        state: {
            type: String,
            default:true
        },
        token: {
            type: String,
        },
    },
    {
        collection: "User",
    }
);

module.exports = mongoose.model("User", userSchema);
