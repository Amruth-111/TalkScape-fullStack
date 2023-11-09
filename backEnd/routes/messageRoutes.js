
const express=require('express')
const route=express.Router()


const message=require('../controllers/messageController')
const auth=require('../middleware/auth')

route.post('/',auth,message.sendMessage)
route.get('/:chatId',auth,message.fetchMessage)

module.exports=route