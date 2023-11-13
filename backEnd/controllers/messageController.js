const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

exports.sendMessage = asyncHandler(async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(404).json({ msg: 'something is missing ' });
        }
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        }

        let message = await Message.create(newMessage)

        // 
        // Populate 'sender' first
        message = await message.populate("sender", "name pic")

        // Then populate 'chat'
        message = await message.populate("chat")

        
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email pic"
        })
        
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })

        res.status(201).json(message)

    } catch (e) {
        return res.status(500).json({ msg: "error in the server side message model", error: e });
    }



})

exports.fetchMessage = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.chatId;
        let messages = await Message.find({ chat: chatId })
            .populate('sender', 'name email pic')
            .populate('chat')
    
        res.status(201).json(messages)

    } catch (e) {
        return res.status(500).json({ msg: "error in the server side fetchmessage model", error: e });
    }


})