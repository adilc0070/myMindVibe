const express=require('express')
const authRoute=express()
const bodyParser=require('body-parser')
const path=require('path')
const { sendVerificationEmail } = require('../middlewares/nodeMailer')
// const user=require('../model/user')

authRoute.use(bodyParser.json())
authRoute.use(bodyParser.urlencoded({extended:true}))
authRoute.use(express.static(path.join(__dirname,'public')))
authRoute.post('/login', (req, res) => {
    console.log("req.body ", req.body['login-email']);
    const email = req.body['login-email'];
    res.redirect('/')
});
authRoute.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
authRoute.post('/register', (req, res) => {
    let {registerName, registerPhone, registerEmail, registerPassword,registerCode}=req.body
    console.log("name", registerName);
    console.log("phone", registerPhone);
    console.log("email", registerEmail);
    console.log("password", registerPassword);
    console.log("code", registerCode, 'req.body.registerCode', req.body.registerCode);
    res.redirect('/');
})

authRoute.post('/send-verification', async (req, res) => {
    const { email } = req.body;
    await sendVerificationEmail(email);
    res.status(200).json({ message: 'Verification email sent' });
})

module.exports = authRoute;