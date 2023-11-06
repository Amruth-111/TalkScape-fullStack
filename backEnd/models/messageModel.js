const mongoose=require('mongoose')

const messageModel=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users' 
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chats' 
    }
},{
    timestamp:true
})

const message=mongoose.model('Message',messageModel)

module.exports=message