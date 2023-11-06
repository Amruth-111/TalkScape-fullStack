import React,{useEffect, useState} from 'react'
import axios from 'axios'

const Chats = () => {

    const [chats,setChats]=useState([])

    const fetchChats=async()=>{
        const {data}=await axios.get('http://localhost:8000/api/chats')
        console.log(data)
        setChats(data)

    }
    useEffect(()=>{
        fetchChats()
    },[])

  return (
    <div>
       {chats.map(c=><div key={c._id}>{c.chatName}</div>)}
    </div>
  )
}

export default Chats
