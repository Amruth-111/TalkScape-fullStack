import React from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from '@chakra-ui/react'
import { useState } from "react";

import axios from 'axios';

// import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const navigate=useNavigate()
  const { updateUserInfo } = ChatState();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const toast=useToast()
  
  const submitHandler = async () => {
    setPicLoading(true);
    if(!name || !email ||!password || !confirmpassword){
      toast({
        title:"please enter all the details",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setPicLoading(false);
      return;
    }
    if(password !== confirmpassword){
      toast({
        title:"password doesnot match",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setPicLoading(false);
      return;
    }
    if(password.length < 5){
      toast({ 
        title:"password must be atlest 5 chars",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setPicLoading(false);
      return;
    }
    try{
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const {data}=await axios.post("https://talk-scape-m6kt.onrender.com/api/users/",{name,email,password,pic},config)

      if(!data.success){
        toast({
          title:data.msg,
          description:data.msg,
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"bottom"
        })
        setPicLoading(false)
        return;
      }
        toast({
          title:"Registration successfull",
          status:"success",
          duration:5000,
          isClosable:true,
          position:"bottom"
        })
       
        const res=JSON.stringify(data)
        localStorage.setItem("token",res)
        updateUserInfo()
        setPicLoading(false)

       
     
    }catch(e){
      toast({
        title:"cant signup",
        description:e,
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setPicLoading(false)
    }
    navigate('/')
    
  }


  const postDetails=async(pics)=>{
      setPicLoading(true)
    if(pics===undefined){
      toast({
        title:"please select the image",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      return;
    }

    if(pics.type==="image/jpeg" ||pics.type==="image/png"){
      const data=new FormData()
      data.append("file",pics)
      data.append("upload_preset",props.uploadPreset)
      data.append("cloud_name",props.cloudName)
      axios.post(`https://api.cloudinary.com/v1_1/${props.cloudName}/image/upload`,data)
      .then((res)=>{
        setPic(res.data.url.toString())
        setPicLoading(false)
    
        toast({
          title: "Image uploaded successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }).catch(e=>{
   
          setPicLoading(false)
      })
    }else{
      toast({
        title:"please select an image of either jpeg or png",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      setPicLoading(false)
      return;
    }
  }
  return (
    <VStack spacing="5px">
        <FormControl idisplay="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
      </FormControl>
      <FormControl idisplay="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl idisplay="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl idisplay="cpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl idisplay="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup
