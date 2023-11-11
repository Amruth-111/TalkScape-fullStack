

import React, {  useState } from 'react'
// import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import MyChats from './MyChats'
import ChatBox from './ChatBox'
import { Box } from "@chakra-ui/layout";
import SideDrawer from './miscellaneous/SideDrawer'



const Chats = () => {
  const { user } = ChatState()

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>

  )
}

export default Chats