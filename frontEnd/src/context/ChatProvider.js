import { createContext,useState,useContext, useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";


const chatContext=createContext()

const ChatProvider=({children})=>{
    const navigate=useNavigate()
    const [user,setUser]=useState()
    const[chats,setChats]=useState([])
    const [selectedChat,setSelectedChat]=useState()
    const [notification,setNotification]=useState([])
    // useEffect(()=>{
    //     let userInfo=JSON.parse(localStorage.getItem("token"))
    //     console.log(userInfo)
    //     setUser(userInfo);
    //     if(!userInfo){
    //         navigate('/')
    //     }
    // },[navigate])

      
      const updateUserInfo = useCallback(() => {
        let userInfo = JSON.parse(localStorage.getItem("token"));
        setUser(userInfo);
    
        // Check if userInfo is available and navigate accordingly
        if (userInfo) {
          navigate('/chats');
        }
      }, [navigate]);
    
      useEffect(() => {
        updateUserInfo();
      }, [updateUserInfo]);
      

    return (
        <chatContext.Provider value={{user,setUser,chats,setChats,selectedChat,setSelectedChat,notification,setNotification,updateUserInfo}}>
        {children}
         </chatContext.Provider>
    )
       
}

export const ChatState=()=>{
    return useContext(chatContext)
}

export default ChatProvider