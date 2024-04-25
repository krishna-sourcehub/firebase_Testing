const express = require('express');
const { AuthicateUser } = require('../controllers/login');
var router = express.Router();
const client = require("../redis")

client
    .connect()
    .then(() => {
        console.log("Connected to redis");
    })
    .catch((e) => {
        console.log(e);
    });

router.post("/", async (req, res) => {
    try {
        const { email, password } = await req.body;
        var loginCredentials = await AuthicateUser(email, password);
        console.log(loginCredentials);
        if (loginCredentials === "Invalid User name or Password") {
            res.status(200).send("Invalid User name or Password");
        } else if (loginCredentials === "Server Busy") {
            res.status(200).send("Server Busy");
        }else{
            res.status(200).json({token:loginCredentials.token,id:loginCredentials.id});
        }

    } catch (e) {
        console.log(e);
    }

})



module.exports = router;