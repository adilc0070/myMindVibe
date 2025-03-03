const express = require('express')
const authRoute = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')
const { sendVerificationEmail } = require('../middlewares/nodeMailer')
const { createUser, loginUser } = require('../controller/users');

authRoute.use(bodyParser.json())
authRoute.use(bodyParser.urlencoded({ extended: true }))
authRoute.use(express.static(path.join(__dirname, 'public')))
authRoute.use(cookieParser());

authRoute.post('/login', loginUser);
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