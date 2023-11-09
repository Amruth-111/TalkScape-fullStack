import React from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react"
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Lin = () => {
  const navigate=useNavigate()
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast=useToast()
  const submitHandler = async () => {
    setLoading(true);
    if( !email ||!password ){
      toast({
        title:"please select the image",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setLoading(false);
      return;
    }
   
    try{
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const {data}=await axios.post("http://localhost:8000/api/users/login",{email,password},config)
      console.log(data.token)
      toast({
        title:"Logged in successfully",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
     const res=JSON.stringify(data)
      localStorage.setItem("token",res)
      navigate('/chats')
      setLoading(false)

    }catch(e){
      toast({
        title:"Error in dom",
        description:e.response.data.message,
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setLoading(false)
    }
    navigate('/')
  }


 

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
