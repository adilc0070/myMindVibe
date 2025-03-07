const express=require('express')
const clientRoute=express()
const bodyParser=require('body-parser')
const path=require('path')
const cookieParser = require('cookie-parser');
const bookingRoute=require('./booking')
const authRoute = require('./auth')
const { authenticateUserToken } = require('../middlewares/authenticator');
const jwt = require('jsonwebtoken');
const user = require('../models/user')


clientRoute.use(bodyParser.json())
clientRoute.use(bodyParser.urlencoded({extended:true}))
clientRoute.use(express.static(path.join(__dirname,'public')))
clientRoute.use(cookieParser());
clientRoute.use('/booking' ,authenticateUserToken, bookingRoute)
clientRoute.use('/auth', authRoute);
clientRoute.set('view engine','ejs')
clientRoute.set('views','./views')


clientRoute.get('/', async (req,res)=>{
    const token = req.cookies.token;
    if(token){
        const userToken = jwt.verify(token, process.env.JWT_SECRET);
    
        const userData = await user.findById(userToken.userId);
        res.render('index',{
            user:{
                name:userData.name,
                email:userData.email
            }
        })
    }else{
        res.render('index',{
            user:{
                name:'',
                details:{}
            }
        })
    }
})


clientRoute.get('/news-detail',(req,res)=>{
    res.render('news-detail')
})

module.exports=clientRoute
