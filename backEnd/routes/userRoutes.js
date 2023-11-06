const express=require('express')
const { body } = require('express-validator');


const route=express.Router()
const user=require('../controllers/userController')
const auth=require('../middleware/auth')

route.post('/signup',[
    body('name','enter a valid name').isLength({min:3}),
    body('password','password must be atleast 5 digit').isLength({min:5}),
    body('email','enter a valid email').isEmail(),
],user.userSignUp)


route.post('/login',[
    body('password','password must be atleast 5 digitd').isLength({min:5}),
    body('email','enter a valid email').isEmail(),
],user.userLogIn)

module.exports=route

route.post('/getuser',auth,user.userLogIn)