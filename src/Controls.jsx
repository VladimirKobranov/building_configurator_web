import React, {useContext} from "react";
import {Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack} from "@chakra-ui/react";
import {SliderContext} from "./ChakraInit";

function Controls() {
    const {sliderValueX, setSliderValueX} = useContext(SliderContext);
    const {sliderValueY, setSliderValueY} = useContext(SliderContext);
    const {sliderValueZ, setSliderValueZ} = useContext(SliderContext);

    function onSliderChangeX(val) {
        setSliderValueX(val)
        console.log('value from slider X: ', sliderValueX)
    }

    function onSliderChangeY(val) {
        setSliderValueY(val)
        console.log('value from slider Y: ', sliderValueY)
    }

    function onSliderChangeZ(val) {
        setSliderValueZ(val)
        console.log('value from slider Z: ', sliderValueZ)
    }

    return (
        <Box
            position="absolute"
            top="3%"
            right="0"
            width="20%"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <VStack w='90%'>

                <Text>X number depth: {sliderValueX}</Text>
                <Slider defaultValue={sliderValueX} min={0} max={20} step={1} onChangeEnd={val => onSliderChangeX(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

                <Text>Y number height: {sliderValueY}</Text>
                <Slider defaultValue={sliderValueY} min={0} max={20} step={1} onChangeEnd={val => onSliderChangeY(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

                <Text>Z number width: {sliderValueZ}</Text>
                <Slider defaultValue={sliderValueZ} min={0} max={20} step={1} onChangeEnd={val => onSliderChangeZ(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

            </VStack>
        </Box>
    );
}

export default Controls;
