import * as React from 'react'
import {createContext, useState} from 'react'
import {Box, ChakraProvider} from '@chakra-ui/react'
import App from "./App";
import Controls from "./Controls";

export const SliderContext = createContext();

function ChakraInit() {
    const [sliderValueX, setSliderValueX] = useState(3);
    const [sliderValueY, setSliderValueY] = useState(3);
    const [sliderValueZ, setSliderValueZ] = useState(3);

    return (
        <ChakraProvider>
            <SliderContext.Provider value={{sliderValueX, setSliderValueX, sliderValueY,setSliderValueY,sliderValueZ,setSliderValueZ}}>
                <Box w='80%' h='100%'>
                    <App/>
                </Box>
                <Controls/>
            </SliderContext.Provider>
        </ChakraProvider>
    )
}

export default ChakraInit;