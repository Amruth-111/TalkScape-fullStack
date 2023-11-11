import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react'
import React from 'react'
import Sup from './Authentication/Sup'
import Lin from './Authentication/Lin'
import { useNavigate } from "react-router-dom";
import {  useEffect } from "react";
const Home = () => {
    const navigate=useNavigate()

    useEffect(()=>{
        let userInfo=JSON.parse(localStorage.getItem("token"))
  
        if(userInfo){
            navigate('/chats')
        }
    },[navigate])
    const uploadPreset=process.env.REACT_APP_UPLOAD_PRESET
    const cloudName=process.env.REACT_APP_CLOUD_NAME_API_KEY


    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text align='center' fontSize="4xl" fontFamily="Work sans">
                    Talk-Scape
                </Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs isFitted variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab>Login</Tab>
                        <Tab>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Lin />
                        </TabPanel>
                        <TabPanel>
                            <Sup cloudName={cloudName} uploadPreset={uploadPreset}/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Home
