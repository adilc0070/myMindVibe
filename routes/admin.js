const express=require('express')
const adminRoute=express()
const bodyParser=require('body-parser')
const path=require('path')

adminRoute.use(bodyParser.json())
adminRoute.use(bodyParser.urlencoded({extended:true}))
adminRoute.use(express.static(path.join(__dirname,'public')))

adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')


adminRoute.get('/',(req,res)=>{    
    res.render('dashboard')
})


module.exports=adminRoute