
const jwt=require('jsonwebtoken')
require('dotenv').config

const jwtToken=async(id)=>{
    try{
        const token=jwt.sign({id},process.env.JWT_KEY)
        return token
    }catch(e){
        return e
    }
   
}

module.exports= jwtToken 
