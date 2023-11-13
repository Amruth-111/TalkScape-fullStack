import React from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react"
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
const Lin = () => {
  const { updateUserInfo } = ChatState();
  // const navigate=useNavigate()
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast()


  const submitHandler = async (e) => {

    try {
      e.preventDefault()
      setLoading(true);

      if (!email || !password) {
        toast({
          title: "Please fill in all the details",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }


      const obj = {
        email: email,
        password: password,
      };
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://talk-scape-m6kt.onrender.com/api/users/login",
        obj,
        config
      );


      // Log the response data
      if (!data.success) {
        toast({
          title: data.msg,
          description: data.msg,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Logged in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      const res = JSON.stringify(data);
      localStorage.setItem("token", res);
      setLoading(false);
      // navigate('/');
      updateUserInfo()

    } catch (error) {
      console.error("error while logging in", error);

      toast({
        title: " error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    }
  };





  return (
    <VStack spacing="10px">
      <FormControl idisplay="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl idisplay="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Lin
