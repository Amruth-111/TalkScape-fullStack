const jwt=require('jsonwebtoken')
const User=require('../models/userModel')

const authentication=async(req,res,next)=>{
    try{
        const {authentication}=req.headers
        console.log(authentication)
        const result= jwt.verify(authentication,process.env.JWT_KEY)
        if(!result){
            return res.status(400).send("token doesnt match please enter the correct token")
        }
        const res=await User.findById(result.id).select("-password")
        req.user=res
        next()
    }catch(e){
        return res.status(500).json({error:e,msg:"serverside error"})
    }
    
}
module.exports=authentication