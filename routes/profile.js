const express = require('express');
const { AuthorizeUser } = require('../controllers/login');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const retrieve_token = req.headers.authorization;
        const auth_token = await AuthorizeUser(retrieve_token);

        if (auth_token === false) {
            res.status(401).send("Invalid Token");
        } else {
            console.log("this auth", auth_token);
            res.status(200).json({ auth_token });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Server Busy");
    }
});


router.post("/details", async (req, res) => {
    try {
        const details = req.body;
    } catch (e) {
        console.log(e);
    }
})
module.exports = router;