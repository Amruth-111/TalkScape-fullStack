// Importing Chakra UI components, icons, and other dependencies
import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

// Functional component for updating group chat details
const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  // Chakra UI hooks for modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State variables for managing group chat updates
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  // Extracting relevant information from the Chat context
  const { selectedChat, setSelectedChat, user } = ChatState();

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
          Authentication: ` ${user.token}`,
        },
      };
      // Fetching user data based on the search query
      const { data } = await axios.get(`https://talk-scape-m6kt.onrender.com/api/users?search=${search}`, config);
  
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      // Displaying an error toast if search fails
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  // Function to handle renaming the group chat
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      // Configuring headers for authentication
      const config = {
        headers: {
          Authentication: ` ${user.token}`,
        },
      };
      // Making a PUT request to update the group chat name
      const { data } = await axios.put(
        `https://talk-scape-m6kt.onrender.com/api/chats/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );


      // Updating the selected chat with the new data
      setSelectedChat(data.data);
      // Triggering a fetch update
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      // Displaying an error toast if renaming fails
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    // Clearing the input field
    setGroupChatName("");
  };

  // Function to handle adding a user to the group chat
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      // Displaying an error toast if the user is already in the group
      toast({
        title: "User Already in Group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      // Displaying an error toast if the current user is not an admin
      toast({
        title: "Only Admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      // Configuring headers for authentication
      const config = {
        headers: {
          Authentication: ` ${user.token}`,
        },
      };
      // Making a PUT request to add a user to the group chat
      const { data } = await axios.put(
        `https://talk-scape-m6kt.onrender.com/api/chats/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // Updating the selected chat with the new data
      setSelectedChat(data);
      // Triggering a fetch update
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      // Displaying an error toast if adding user fails
      toast({
        title: "error while adding",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    // Clearing the input field
    setGroupChatName("");
  };

  // Function to handle removing a user from the group chat
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      // Displaying an error toast if the current user is not an admin or removing another user
      toast({
        title: "Only Admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      // Configuring headers for authentication
      const config = {
        headers: {
          Authentication: ` ${user.token}`,
        },
      };
      // Making a PUT request to remove a user from the group chat
      const { data } = await axios.put(
        `https://talk-scape-m6kt.onrender.com/api/chats/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // If the user removes themselves, clear the selected chat
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data.data);
      // Triggering a fetch update
      setFetchAgain(!fetchAgain);
      setLoading(false);
      fetchMessages()
    } catch (error) {
      // Displaying an error toast if removing user fails
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    // Clearing the input field
    setGroupChatName("");
  };

  // JSX structure for the modal component
  return (
    <>
      {/* IconButton triggering the modal on click */}
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      {/* Modal structure */}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          {/* Modal header displaying the selected chat name */}
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          {/* Modal close button */}
          <ModalCloseButton />
          {/* Modal body */}
          <ModalBody display="flex" flexDir="column" alignItems="center">
            {/* Displaying user badges for each user in the group */}
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            {/* Form control for updating the chat name */}
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              {/* Button to update the chat name */}
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            {/* Form control for adding a user to the group */}
            <FormControl>
              <Input
                placeholder="Add User to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* Displaying search results or loading spinner */}
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          {/* Modal footer with a button to leave the group */}
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Exporting the component as the default export
export default UpdateGroupChatModal;
