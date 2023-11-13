const express = require('express')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const path=require('path')
const port = process.env.PORT

const app = express();
app.use(body_parser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://talk-scape.onrender.com');
    next();
  });
  



// const chats = require("./data/data")
const dbConnect = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { errorHandler, notFound } = require('./middleware/errorhandlers')
dbConnect()



app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)
app.use(notFound)
app.use(errorHandler)


//...........deployment..............
// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname1, "/frontEnd/build")));
//     console.log("skjskjss");
//     app.get("*", (req, res) => {
//         console.log(req);
//         res.sendFile(path.resolve(__dirname1, "frontEnd", "build", "index.html"));
//     });
// } else {
//     app.get('/', (req, res) => {
//         res.send('Started my API');
//     });
// }




//...........deployment..............



const server = app.listen(port)
const io = require('socket.io')(server, {
    pingTimeout: 80000,
    cors: {
        origin: 'https://talk-scape.onrender.com'
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
     
        if(!chat.users)return console.log("chat.users not defined")

        chat.users.forEach(user=>{
            // console.log(newMessageRecieved.sender._id),user._id
            if(user._id==newMessageRecieved.sender._id)return;
            socket.in(user._id).emit("message recieved",newMessageRecieved)
        })
   
    })
    socket.off("setup",()=>{
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })


})