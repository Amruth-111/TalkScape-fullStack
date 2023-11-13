const mongoose=require('mongoose')
require('dotenv').config

const dbConnect=async()=>{
    try{
        console.log(process.env.MONGO_STRING)
        const db=await mongoose.connect(process.env.MONGO_STRING)
        console.log('connected to mongodb', db.connection.host)

    }catch(e){
        console.log(e)
    }
    
}
module.exports=dbConnect