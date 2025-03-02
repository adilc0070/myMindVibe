const express=require('express')
const authRoute=express()
const bodyParser=require('body-parser')
const path=require('path')
const { sendVerificationEmail } = require('../middlewares/nodeMailer')
const { createUser } = require('../controller/users');
authRoute.use(bodyParser.json())
authRoute.use(bodyParser.urlencoded({extended:true}))
authRoute.use(express.static(path.join(__dirname,'public')))


authRoute.post('/login', async (req, res) => {
    console.log("req.body ", req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await user.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    if (user.password !== password) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    res.redirect('/')
});
authRoute.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
authRoute.post('/register', async (req, res) => {
    console.log('here');
    
    await createUser(req, res);
});

authRoute.post('/send-verification', async (req, res) => {
    const { email } = req.body;
    await sendVerificationEmail(email);
    res.status(200).json({ message: 'Verification email sent' });
})

module.exports = authRoute;