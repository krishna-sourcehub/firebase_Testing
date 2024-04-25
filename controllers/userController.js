const User = require('../models/User');

const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const newData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        else{
            return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        }

        
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
    
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User found', user });
    } catch (error) {
        console.error('Error retrieving user by ID:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = {
    updateUser,  getUserById
};
