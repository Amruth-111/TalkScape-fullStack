const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

exports.accessChats = async (req, res) => {
    try {
        let success = false
        let { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success, msg: "user id not present" })
        }
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
        console.log(isChat)
        if (isChat.length > 0) {
            res.send(isChat[0])
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
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        console.log(chats)
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email pic"
        })
        console.log(chats)
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

        users.push(req.user)
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user

        })
        const fullChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password")
            .populate("groupAdmin", "-password")
            success=true
        res.status(201).json({ success, data: fullChat })
    } catch (e) {
        res.status(400).send("backend main createGroupchat error")
    }
}

exports.renameGroup = async (req, res) => {
    try {
        let success = false
        const id = req.body.groupId
        if (!req.body.groupId || !req.body.newName) {
            return res.status(400).json({ success, msg: "name not specified" })
        }

        const renameGroupChat = await Chat.findByIdAndUpdate(
            id,
            { chatName: req.body.newName },
            { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            success=true
        res.status(201).json({ success, data: renameGroupChat })

    } catch (e) {
        res.status(400).send("backend main renameGroupchat error")
    }
}

exports.removeFromGroup = async (req, res) => {
    try {
        let success = false
        const {groupId,userId}=req.body
        if (!userId || !groupId) {
            return res.status(400).json({ success, msg: " some details missing" })
        }

        const removeGroupUser = await Chat.findByIdAndUpdate(
            groupId,
            { $pull:{users:userId }},
            { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            success=true
        res.status(201).json({ success, data: removeGroupUser })


    } catch (e) {
        res.status(400).send("backend main removeGroupUser error")
    }
}

exports.addToGroup = async (req, res) => {
    try {
        let success = false
        const {groupId,userId}=req.body
        if (!userId || !groupId) {
            return res.status(400).json({ success, msg: " some details missing" })
        }

        const removeGroupUser = await Chat.findByIdAndUpdate(
            groupId,
            { $push:{users:userId }},
            { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(201).json({ success, data: removeGroupUser })

    } catch (e) {
        res.status(400).send("backend main removeGroupchat error")
    }
}