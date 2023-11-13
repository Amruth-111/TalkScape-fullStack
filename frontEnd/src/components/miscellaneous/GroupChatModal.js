// Importing necessary components and libraries from Chakra UI, axios, and React
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "../../context/ChatProvider";
  import UserBadgeItem from "./UserBadgeItem";
  import UserListItem from "./UserListItem";
  
  // Functional component for creating group chat modal
  const GroupChatModal = ({ children }) => {
    // Using Chakra UI hooks for modal state
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    // State variables for managing group chat creation
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    // Extracting user and chat information from context
    const { user, chats, setChats } = ChatState();
  
    // Function to handle adding users to the selected list
    const handleGroup = (userToAdd) => {
      // Check if the user is already added
      if (selectedUsers.includes(userToAdd)) {
        // Display a warning toast
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      // Add the user to the selected list
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
    // Function to handle user search
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        // Configuring headers for authentication
        const config = {
          headers: {
            Authentication: `${user.token}`,
          },
        };
        // Fetching user data based on the search query
        const { data } = await axios.get(`https://talk-scape-m6kt.onrender.com/api/users?search=${search}`, config);
    
        setLoading(false);
        setSearchResult(data.data);
      } catch (error) {
        // Displaying an error toast if search fails
        toast({
          title: "error fetching result",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
  
    // Function to handle user deletion from the selected list
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    // Function to handle form submission and create a new group chat
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        // Display a warning toast if required fields are not filled
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        // Configuring headers for authentication
        const config = {
          headers: {
            Authentication: `${user.token}`,
          },
        };
        // Making a POST request to create a new group chat
        const { data } = await axios.post(
          `https://talk-scape-m6kt.onrender.com/api/chats/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        // Updating the chat context with the new group chat
        setChats([data.data, ...chats]);
        // Closing the modal
        onClose();
        // Displaying a success toast
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        // Displaying an error toast if chat creation fails
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
  
    // JSX structure for the modal component
    return (
      <>
        {/* Triggering the modal on click */}
        <span onClick={onOpen}>{children}</span>
  
        {/* Modal structure */}
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            {/* Modal header */}
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            {/* Modal body */}
            <ModalBody display="flex" flexDir="column" alignItems="center">
              {/* Input for group chat name */}
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              {/* Input for adding users */}
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              {/* Displaying selected users as badges */}
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {/* Displaying search results or loading indicator */}
              {loading ? (
                // <ChatLoading />
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            {/* Modal footer with a button to create the chat */}
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  // Exporting the component as the default export
  export default GroupChatModal;
  