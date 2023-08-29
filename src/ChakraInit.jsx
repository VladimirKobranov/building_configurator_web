import * as React from 'react'
import {createContext, useState} from 'react'
import {Box, ChakraProvider} from '@chakra-ui/react'
import App from "./App";
import Controls from "./Controls";

export const SliderContext = createContext();

function ChakraInit() {
    const [sliderValueX, setSliderValueX] = useState(5);
    const [sliderValueY, setSliderValueY] = useState(4);
    const [sliderValueZ, setSliderValueZ] = useState(6);
    const [seed, setSeed] = useState(50);
    const [doorSide, setDoorSide] = useState('Front');
    const [doorPosition, setDoorPosition] = useState(2);
    const [balconyPosition, setBalconyPosition] = useState([1, 3]);
    const [balconySide, setBalconySide] = useState(['Front', 'Back'])
    const [pipeBool, setPipeBool] = useState(true);
    const [airCondBool, setAirCondBool] = useState(true);
    const [airCondPercentage, setAirCondPercentage] = useState(50);

    const [rotateSpeed, setRotateSpeed] = useState(0.2);

    return (
        <ChakraProvider>
            <SliderContext.Provider value={{
                sliderValueX,
                setSliderValueX,
                sliderValueY,
                setSliderValueY,
                sliderValueZ,
                setSliderValueZ,
                seed,
                setSeed,
                doorSide,
                setDoorSide,
                doorPosition,
                setDoorPosition,
                rotateSpeed,
                setRotateSpeed,
                balconyPosition,
                setBalconyPosition,
                balconySide,
                setBalconySide,
                pipeBool,
                setPipeBool,
                airCondBool,
                setAirCondBool,
                airCondPercentage,
                setAirCondPercentage
            }}>
                <Box w='80%' h='100%'>
                    <App/>
                </Box>
                <Controls/>
            </SliderContext.Provider>
        </ChakraProvider>
    )
}

export default ChakraInit;