const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const signin=require('../controllers/signin');

router.put('/:userId', UserController.updateUser);

router.get('/retrive/:userId', UserController.getUserById);

module.exports = router;
