const mongoose=require('mongoose')

const chatModel=mongoose.Schema({
    chatName:{
        type:String,
        trim:true,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users' 
    }
},{
    timestamp:true
})

const chats=mongoose.model('Chats',chatModel)

module.exports=chats