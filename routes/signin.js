const express = require('express');
const { CheckUser } = require('../controllers/login');
const { InsertVerifyUser, InsertSignUpUser } = require('../controllers/signin');
var router = express.Router();
const User=require('../models/User');
router.get('/:token', async (req, res) => {
    try {
        const response = await InsertSignUpUser(req.params.token)
        console.log(req.params.token)
        res.status(200).send(response)
    } catch (e) {
        console.log(e);
        res.status(500).send(
            `<html>
                <body>
                    <h4> Registeration Failed</h4>
                    <p>Link Expierd .....</p>
                    <p>Regards,</p>
                    <p>Team</p>
                </body>
            </html>`);
    }

});

router.post("/verify", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        const existingUser = await CheckUser(email);

        if (existingUser) {
            console.log("Email already exists. Registration failed.");
            res.status(200).json({ message: false});
        } else {
            await InsertVerifyUser(name, email, password);
            console.log("Registration successful!");
            res.status(200).json({ message: true });
        }
     }
    catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;