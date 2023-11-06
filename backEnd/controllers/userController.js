const { validationResult } = require('express-validator');
const User=require('../models/userModel')
const jwtToken=require('../config/jwt')
const bcrypt=require('bcrypt');
const { use } = require('../routes/userRoutes');

exports.userSignUp = async (req, res) => {

    try {
        const { name, email, password, pic } = req.body
        let success=false
        const errors = validationResult(req);
        //if there error exists then catch that error and send the errors back
        if (!errors.isEmpty()) {
            return res.status(404).json({ success, errors: errors.array() });
        }

        const user=await user.findOne({email})
        // console.log(user)

        //if email exists we suggest the user to log in
        if(user){
            return res.status(404).json({ success, msg:"email already exists...log in" });
        }
        const salt=await bcrypt.genSalt(10)

        const secPassword=await bcrypt.hash(password,salt)

        console.log(secPassword)
        //else 
       user=await User.create({
            name,
            email,
            password:secPassword,
            pic
        })
        
        const createUser=await User.save()
        
        const token=await jwtToken(createUser._id)
        console.log(token)
        console.log(createUser._id)
        success=true
        res.status(201).json({ success, msg:"successfully registered" ,data:createUser,token});
        // res.status(201).json({success,msg:"logged in sucessfully",authToken });

    } catch (e) {
        return res.status(500).json({  msg:"error in the server side" ,error:e});
    }
  

}

exports.userLogIn = async (req, res) => {

    try {
        const {  email, password } = req.body
        let success=false
        const errors = validationResult(req);
        //if there error exists then catch that error and send the errors back
        if (!errors.isEmpty()) {
            return res.status(404).json({ success, errors: errors.array() });
        }

        const userExists=await User.findOne({email})
        // console.log(user)

        //if email doesnot exists we suggest the user to signup
        if(!userExists){
            return res.status(404).json({ success, msg:"email doesnot exists...try  signup" });
        }
        const ispassword=bcrypt.compare(password,userExists.password)
        if(!ispassword){
            return res.status(404).json({ success, msg:"Invalid credentials" });
        }
        
        const token=await jwtToken(userExists._id)
        success=true
        res.status(201).json({ success, msg:"successfully loggedin" ,data:userExists,token});
        // res.status(201).json({success,msg:"logged in sucessfully",authToken });

    } catch (e) {
        return res.status(500).json({  msg:"error in the server side" ,error:e});
    }
  

}

exports.getUser=async(req,res)=>{
    try{
        const userId=req.user.id;
        const user=await user.findById(userId)
        res.send(user)

    }catch(e){
        res.send(e)
    }
}