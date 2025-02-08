const express=require('express')
const clientRoute=express()
const bodyParser=require('body-parser')
const path=require('path')
const bookingRoute=require('./booking')

clientRoute.use(bodyParser.json())
clientRoute.use(bodyParser.urlencoded({extended:true}))
clientRoute.use(express.static(path.join(__dirname,'public')))
clientRoute.use('/booking',bookingRoute)

clientRoute.set('view engine','ejs')
clientRoute.set('views','./views')


clientRoute.get('/',(req,res)=>{
    res.render('index',{
        user:{
            name:'Guest'
            
        }
    })
})

clientRoute.get('/news-detail',(req,res)=>{
    res.render('news-detail')
})

module.exports=clientRoute
