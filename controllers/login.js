const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const client = require("../redis");
const verifyUser = require("../models/verifyUser");
dotenv.config();
async function CheckUser(email) {
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return "Server Busy";
    }
}



async function AuthicateUser(email, password) {
    try {
        const validUser = await User.findOne({ email: email });
        const validPass = await bcrypt.compare(password, validUser.password);
        if (validPass) {
            const token = jwt.sign({ email }, process.env.login_Secret_Token);
            const response = {
                id: validUser._id,
                name: validUser.name,
                email: validUser.email,
                token: token,
                status: true
            }

            await client.set(`key-${email}`, JSON.stringify(response))
            await User.findOneAndUpdate({ email: validUser.email }, { $set: { token: token } }, { new: true });
            await verifyUser.deleteMany({email:email});
            return response;
            console.log("this id ",response.id)
        }
        return "Invalid User name or Password"
    } catch (e) {
        console.log(e);
        return "Server Busy";
    }

}

async function AuthorizeUser(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.login_Secret_Token);
        console.log(decodedToken);
        if (decodedToken) {
            const email = decodedToken.email;
            const auth = await client.get(`key-${email}`)
            if (auth) {
                const data = JSON.parse(auth);
                console.log(data)
                
                return data;
            } else {
                const data = await User.findOne({ email: email });
                return data;
            }
        }
        else{
            return false;
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = { CheckUser, AuthicateUser, AuthorizeUser };
