

// Import necessary modules and components
import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Button } from "@chakra-ui/button";
import ProfileModal from './ProfileModal.js';
import ChatLoading from '../ChatLoading';
import UserListItem from './UserListItem';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from '../../config/ChatLogics';

// Main functional component
const SideDrawer = () => {
    // State variables
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState("");
    const { user, chats, setChats, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    // Logout function
    const logoutHandler = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Search function
    const handleSearch = async () => {
        // Check if search is empty
        if (!search) {
            // Show warning toast if search is empty
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            // Set loading state to true
            setLoading(true);

            // Configure headers for the request
            const config = {
                headers: {
                    Authentication: `${user.token}`,
                },
            };

            // Make API request to search users
            const { data } = await axios.get(`https://talk-scape-m6kt.onrender.com/api/users?search=${search}`, config);
            setLoading(false);
            setSearchResult(data.data);
        } catch (error) {
            // Show error toast if search request fails
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    // Function to access a chat
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            // Configure headers for the request
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authentication: `${user.token}`,
                },
            };

            // Make API request to create a new chat
            const { data } = await axios.post(`https://talk-scape-m6kt.onrender.com/api/chats/`, { userId }, config);

            // Update chats state if the chat is not already present
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            // Set selected chat and close the drawer
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            // Show error toast if chat request fails
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    // JSX structure of the component
    return (
        <>
            {/* Header section */}
            <Box
                display="flex"
                flexDirection="row"
                padding="10px"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                {/* Search button with tooltip */}
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        {/* Text to display on larger screens */}
                        <Text display={{ base: "none", md: "block" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                {/* App title */}
                <Text fontSize="2xl" fontFamily="Work sans">
                    TextScape
                </Text>
                <div>
                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize="2xl" m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No New Messages"}
                       { console.log(notification)}
                        {notification.map((notif) => (
                            
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    setSelectedChat(notif.chat);
                                    
                                    setNotification(notification.filter((n) => n.sender._id !== notif.sender._id));
                                    console.log(notification)
                                }}
                            >
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                {/* User menu */}
{/*                 
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                    </Menu> */}
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            {/* User avatar */}
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        {/* User profile menu */}
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            {/* Drawer section for searching users */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        {/* Search input and button */}
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>

                        {/* Loading spinner or search results */}
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}

                        {/* Loading spinner for chat access */}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

// Export the component
export default SideDrawer;

