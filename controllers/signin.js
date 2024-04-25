const User = require("../models/User");
const sendMailController = require("../controllers/SendMail");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyUser = require("../models/verifyUser");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
dotenv.config();
const fiveMinutes = 15 * 60 * 1000;

async function InsertVerifyUser(name, email, password) {

    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generatorToken({ email, name });

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        });

        const activationLink = `https://auth-back-uilb.onrender.com/signin/${token}`;
        const content = `<h4>Hi, ${newUser.name}</h4>
        <h5>Welcome to User app.</h5>
        <p>Thank you for signing up. Click on the below link to activate:</p>
        <a href="${activationLink}">Click here</a>
        <p>Regards,</p>
        <p>Team</p>`;

        await newUser.save();
        console.log(newUser);
        sendMailController.sendMail(email, "User Verification", content);
    } catch (e) {
        console.error("Error during user registration:", e.message);
    }
}

function generatorToken(userDetails) {
    const token = jwt.sign(userDetails, process.env.signup_Secret_Token);
    return token;
}

async function InsertSignUpUser(token) {
    try {
        const validToken = await verifyUser.findOne({ token: token });
        if (validToken) {
            const newUser = new User({
                name: validToken.name,
                email: validToken.email,
                password: validToken.password,
                forgetPassword: {}
            });

            await newUser.save();
            await verifyUser.deleteMany({ token: token });
            const content = `<h4> Registeration Successfull </h4>
                             <h5>Welcome ${newUser.name}.</h5>
                             <p>You are Successfully Registered</p>
                             <p>Regards,</p>
                             <p>Team</p>`;
            sendMailController.sendMail(newUser.email, "Registeration Successful", content);
            return `<h4>Registeration Successful</h4>
                    <h5>Welcome ${newUser.name}.</h5>
                    <p>You are Successfully Registered</p>
                    <p>Regards,</p>
                    <p>Team</p>`;
        }
        return `<h4> Registeration Failed</h4>
                <p>Link Expired ... </p>
                <p>Regards,</p>
                <p>Team</p>`;

    } catch (e) {
        console.log(e);
        return `
        <html>
        <body>
        <h4> Registeration Failed</h4>
        <p>Unexpected error Occured</p>
        <p>Regards,</p>
        <p>Team</p>
        </body>
        </html>`;

    }
}

function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function initiatePasswordReset(email) {
    const user = await User.findOne({ email });
    if (user) {
        const otp = generateOtp();
        const currentTime = new Date();

        user.forgetPassword = {
            time: currentTime,
            otp,
        };

        await user.save();
        runAfterDelay(() => myDelayedFunction(email), fiveMinutes);
        const content = `<h4>Hi, there</h4>
        <h5>Welcome to my app.</h5>
        <p>OTP: ${otp}</p>
        <p>Click the following link to verify: <a href="">Verify</a></p>
        <p>Regards,</p>
        <p>Team</p>`;


        sendMailController.sendMail(email, "User Verification", content);
        return true;
    } else {
        return false;
    }
}

async function verifyOtpAndChangePassword(email, enteredOtp, newPassword) {
    const user = await User.findOne({ email });

    if (user && user.forgetPassword) {
        const storedOtp = user.forgetPassword.otp;
        const storedTime = user.forgetPassword.time;
        if(storedOtp){
             // Check if the OTP is valid and hasn't expired (within a certain time limit)
        const isValidOtp = storedOtp === enteredOtp && (new Date() - storedTime);

        if (isValidOtp) {
            // Change the user's password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;

            // Clear the forgetPassword field
            user.forgetPassword = undefined;

            // Save the changes to the user document
            await user.save();


            return true; // Password changed successfully
        } else {
            return false;
        }
        }else{
            return false;
        }
       
    }

    return false;
}

async function myDelayedFunction(email) {
    const user = await User.findOne({ email });
    console.log('This function runs after 15 minutes!');

    // Clear the forgetPassword field
    user.forgetPassword = undefined;
    await user.save();
}

function runAfterDelay(callback, delayInMilliseconds) {
    setTimeout(callback, delayInMilliseconds);
}



module.exports = { InsertVerifyUser, InsertSignUpUser, initiatePasswordReset, verifyOtpAndChangePassword };

