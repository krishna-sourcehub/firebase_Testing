const express = require('express');
const { getUserData } = require('../controllers/getfirebaseAuth');
const { verify } = require('jsonwebtoken');
var router = express.Router();




router.post("/", async (req, res) => {
    try {
        const { idToken } = await req.body;
        var verifyuser = await getUserData(idToken);
        console.log(verifyuser);
        if(verifyuser=="INVALID_ID_TOKEN"){
            res.status(200).send("INVALID_ID_TOKEN");
        }
        if(verifyuser=="API key not valid. Please pass a valid API key."){
            res.status(200).send("API key not valid. Please pass a valid API key.");
        }
        
        // console.log(loginCredentials);
        // if (loginCredentials === "user not found") {
        //     res.status(200).send("Invalid User name or Password");
        // } else if (loginCredentials === "api key error") {
        //     res.status(200).send("Server Busy");
        // }else{
        //     // res.status(200).json({token:loginCredentials.token,id:loginCredentials.id});
        // }

    } catch (e) {
        // console.log(e);
    }

})



module.exports = router;