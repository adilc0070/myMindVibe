const express=require('express')
const authRoute=express()
const bodyParser=require('body-parser')
const path=require('path')
const user=require('../model/user')

authRoute.use(bodyParser.json())
authRoute.use(bodyParser.urlencoded({extended:true}))
authRoute.use(express.static(path.join(__dirname,'public')))
authRoute.post('/login', (req, res) => {
    console.log("req.body ", req.body);
    res.render('index', {
        user: {
            name: req.body.username
        }
    })
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
module.exports = authRoute;