// Import necessary modules and components
import React from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from '../context/ChatProvider'

// Functional component for displaying user's chats
const MyChats = ({ fetchAgain }) => {
  // State variables
  const [loggedUser, setLoggedUser] = useState();

  // Destructuring values from ChatState context
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  // Toast for displaying notifications
  const toast = useToast();

  // Function to fetch user's chats from the server
  const fetchChats = async () => {
    try {
      // Configure headers for the request
      const config = {
        headers: {
          "Content-type": "application/json",
          Authentication: `${user.token}`,
        },
      };

      // Make API request to get user's chats
      const { data } = await axios.get("https://talk-scape-m6kt.onrender.com/api/chats/", config);
      setChats(data);
    } catch (error) {
      // Show error toast if fetching chats fails
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // useEffect hook to fetch user's chats when component mounts
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("token")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  // JSX structure of the component
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* Header section */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        {/* New Group Chat button (commented out) */}
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chats section */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          // Display the list of chats using Stack component
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                {/* Display chat information */}
                <Text  as="span" fontWeight="bold">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                <Text>
                  {!chat.isGroupChat
                
                    ? (chat.latestMessage?`${getSender(loggedUser, chat.users) }:${chat.latestMessage.content}`:"")
                    :(chat.latestMessage? `${chat.chatName}:${chat.lastMessage.content}`:"")
                  }
                </Text>
              
              </Box>
            ))}
          </Stack>
        ) : (
          // Show loading spinner if chats are still loading
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

// Export the component
export default MyChats;
