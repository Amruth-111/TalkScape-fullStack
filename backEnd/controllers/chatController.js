
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

exports.accessChats = async (req, res) => {
    try {
        let success = false
        let { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success, msg: "user id not present" })
        }
        //if user id is present then find the perticular chat in chats db
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name email pic"
        })
        // console.log(isChat)
        if (isChat.length > 0) {
            res.send(isChat[0])
            //is the chat is not present then create a new chat between two personals
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            };

            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: createdChat.id }).populate("users", "-password")
                return res.status(200).send(fullChat)

            } catch (e) {
                res.status(400).send("backend sub access chat error")
                throw new Error(e.message)
            }
        };

    } catch (e) {
        res.status(400).send("backend main access chat error")
    }
}

exports.fetchChats = async (req, res) => {
    try {

        // fetch all the chats of the requested user 
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        // console.log(chats)
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email pic"
        })
        // console.log(chats)
        res.status(200).send(chats)
    } catch (e) {
        res.status(400).send("backend main fetch chat error")
    }
}


exports.createGroupChat = async (req, res) => {
    try {
        let success = false
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ success, msg: "user not specified" })
        }
        let users = JSON.parse(req.body.users)
        //if the users are lesser than 2 the we cant create the group
        if (users.length < 2) {
            return res.status(400).json({ success, msg: "select more than 1 users to create group" })
        }
        //used to push even the current user to the group
        users.push(req.user)
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user

        })
        const fullChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password")
            .populate("groupAdmin", "-password")
        success = true
        res.status(201).json({ success,msg:"Group chat created successfully " ,data: fullChat })
    } catch (e) {
        res.status(400).json({e:e,msg:"backend main createGroupchat error"})
    }
}

exports.renameGroup = async (req, res) => {
    try {
        let success = false
        const id = req.body.chatId
        if (!req.body.chatId || !req.body.chatName) {
            return res.status(400).json({ success, msg: "name not specified" })
        }

        //use findByIdAndUpdate to update the group name with perticular groupid
        const renameGroupChat = await Chat.findByIdAndUpdate(
            id,
            { chatName: req.body.chatName },
            { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        success = true
        res.status(201).json({ success,msg:"rename successfull", data: renameGroupChat })

    } catch (e) {
        res.status(400).send("backend main rename Groupchat error")
    }
}

exports.removeFromGroup = async (req, res) => {
    try {
        let success = false
        const { chatId, userId } = req.body
        if (!userId || !chatId) {
            return res.status(400).json({ success, msg: " some details missing" })
        }

        const removeGroupUser = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        success = true
        res.status(201).json({ success,msg:"removed user successfully" ,data: removeGroupUser })


    } catch (e) {
        res.status(400).json({e:e,msg:"backend main removeGroupUser error"})
    }
}

exports.addToGroup = async (req, res) => {
    try {
        let success = false
        const { chatId, userId } = req.body
        if (!userId || !chatId) {
            return res.status(400).json({ success, msg: " some details missing" })
        }

        const removeGroupUser = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(201).json({ success,msg:"added user successfully", data: removeGroupUser })

    } catch (e) {
        res.status(400).send("backend main removeGroupchat error")
    }
}