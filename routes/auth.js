const express = require('express')
const authRoute = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')
const { sendVerificationEmail } = require('../middlewares/nodeMailer')
const { createUser } = require('../controller/users');
const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
authRoute.use(bodyParser.json())
authRoute.use(bodyParser.urlencoded({ extended: true }))
authRoute.use(express.static(path.join(__dirname, 'public')))
authRoute.use(cookieParser());

authRoute.post('/login', async (req, res) => {
    console.log("req.body ", req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    if (user.password !== password) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.redirect('/')
});
authRoute.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
authRoute.post('/register', createUser);

authRoute.post('/send-verification', async (req, res) => {
    const { email } = req.body;
    await sendVerificationEmail(email);
    res.status(200).json({ message: 'Verification email sent' });
})

module.exports = authRoute;