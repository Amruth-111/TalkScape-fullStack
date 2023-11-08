import { createContext,useState,useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const chatContext=createContext()

const ChatProvider=({children})=>{
    const navigate=useNavigate()
    const [user,setUser]=useState()
    useEffect(()=>{
        let userInfo=JSON.parse(localStorage.getItem("token"))
        console.log(userInfo)
        setUser(userInfo);
        if(!userInfo){
            navigate('/')
        }
    },[navigate])

    return (
        <chatContext.Provider value={{user,setUser}}>
        {children}
         </chatContext.Provider>
    )
       
}

export const ChatState=()=>{
    return useContext(chatContext)
}

export default ChatProvider