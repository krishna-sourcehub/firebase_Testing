const express = require('express');
const router = express.Router();
const signin = require('../controllers/signin');
const { initiatePasswordReset, verifyOtpAndChangePassword } = signin;

router.post('/password', async (req, res) => {
    try {
        const { email } = req.body;
        const generatedOtp = await initiatePasswordReset(email);
        console.log("Generated OTP:", generatedOtp);
        if(generatedOtp){
            res.status(200).json({ message:true});
            
        }else{
            res.status(200).json({ message:false});
        }
        
    } catch (error) {
        console.error("Error during password reset initiation:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/verify', async (req, res) => {
    try {
        const { email, enteredOtp, newPassword } = req.body;
        const passwordChanged = await verifyOtpAndChangePassword(email, enteredOtp, newPassword);

        if (passwordChanged) {
            res.status(200).json({ message: 'Password changed successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP or user not found' });
        }
    } catch (error) {
        console.error("Error during OTP verification and password change:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
