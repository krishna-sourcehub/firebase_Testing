const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const firebaseUsersModel = require('../models/firebaseuser');
dotenv.config();
const getUserData = async (idToken) => {
    try {
        console.log(idToken);

        const apiKey = process.env.apiKey;
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

        const config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                idToken: idToken, 
            },
        };

        const response = await axios(config);
          const userData = response.data.users;

          console.log('User data:', userData);

        if (response.status == "200") {
            console.log("User is Found");
          
            const userToSave = new firebaseUsersModel({
                userId: userData[0].localId,
                email: userData[0].email,
                isVerified: userData[0].emailVerified,
                createdAt: new Date(parseInt(userData[0].createdAt)),
                providerInfo: userData[0].providerUserInfo.map(provider => ({
                    providerId: provider.providerId,
                    federatedId: provider.federatedId,
                    email: provider.email,
                    rawId: provider.rawId
                })),
                validSince: new Date(parseInt(userData[0].validSince)), 
                lastLoginAt: new Date(parseInt(userData[0].lastLoginAt)), 
                lastRefreshAt: new Date(userData[0].lastRefreshAt),
            });

            // Save the new instance
            await userToSave.save();
            console.log("User data saved successfully");
        }


        return userData;

    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.error.message;
            console.error('Response error:', errorMessage);
            return errorMessage;

        }
        // else if (error.request) {
        //     // The request was made, but no response was received
        //     console.error('No response received:', error.request);
        // } else {
        //     // An error occurred setting up the request
        //     console.error('Request error:', error.message);
        // }

        // Log the complete error object for further inspection
        // console.error('Complete error:', error);

        // Throw the error so it can be handled by the calling code if necessary
        // throw error;
    }
};

// Export the function if you want to use it in other modules
module.exports = { getUserData };
