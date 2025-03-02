const Otp = require('../models/Otp');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const createUser = async (req, res) => {
    try {
        const { registerName, registerEmail, registerPassword, registerPhone, registerCode } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email:registerEmail });
        if (existingUser) {
            
            return res.status(400).json({ error: 'User already exists' });
        }
            //check if code is valid
            const validCode = await Otp.findOne({email:registerEmail, otp:registerCode });
        if (!validCode) {
            return res.status(400).json({ error: 'Invalid code' });
        }else{
            const newUser = new User({ name:registerName, email:registerEmail, password:registerPassword, phone:registerPhone });
            await newUser.save();
            await Otp.deleteOne({email:registerEmail, otp:registerCode });
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            return res.status(200).json({ message: 'User created successfully' }); 
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

module.exports = { createUser };

        
        