const express=require('express')
const { body } = require('express-validator');

const route=express.Router()
const chat=require('../controllers/chatController')
const auth=require('../middleware/auth')

route.post('/',auth,chat.accessChats)
route.get('/',auth,chat.fetchChats)
route.post('/group',auth,chat.createGroupChat)
route.put('/rename',auth,chat.renameGroup)
route.put('/groupremove',auth,chat.removeFromGroup)
route.post('/groupadd',auth,chat.addToGroup)

module.exports=route