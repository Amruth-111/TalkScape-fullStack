const express = require('express')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT

const app = express();
app.use(body_parser.json())
app.use(cors())



const chats = require("./data/data")
const dbConnect = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { errorHandler, notFound } = require('./middleware/errorhandlers')
dbConnect()

app.get('/', (req, res) => {
    res.send('started my api')
})

app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)
app.use(notFound)
app.use(errorHandler)


console.log(process.env.MONGO_STRING)
console.log(port)


const server = app.listen(port)
const io = require('socket.io')(server, {
    pingTimeout: 80000,
    cors: {
        origin: 'http://localhost:3000'
    },

})


io.on('connection', (socket) => {
    console.log("connected to socket.io server")
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room),
        console.log("user joined the room", room)
    })

    socket.on('typing',(room)=>socket.in(room).emit("typing"))
    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"))
    socket.on("new message", (newMessageRecieved) => {
        let chat=newMessageRecieved.chat;
        // console.log(chat)
        // console.log(newMessageRecieved)
        if(!chat.users)return console.log("chat.users not defined")

        chat.users.forEach(user=>{
            console.log(newMessageRecieved.sender._id),user._id
            if(user._id==newMessageRecieved.sender._id)return;
            socket.in(user._id).emit("message recieved",newMessageRecieved)
        })
   
    })


})