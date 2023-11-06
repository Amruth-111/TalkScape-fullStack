const express=require('express')
const body_parser=require('body-parser')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const port=process.env.PORT

const app=express();
app.use(body_parser.json())
app.use(cors())



const chats=require("./data/data")
const dbConnect=require('./config/db')

dbConnect()

app.get('/',(req,res)=>{
    res.send('started my api')
})

app.get('/api/chats',(req,res)=>{
    console.log(chats)
    res.send(chats)
})

app.get('/api/chats/:id',(req,res)=>{
    console.log(req.params.id)

    const result=chats.find((c)=>c._id===req.params.id)

    res.send(result)
})
console.log(process.env.MONGO_STRING)
console.log(port)


app.listen(port)