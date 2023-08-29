import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Checkbox,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react";
import {SliderContext} from "./ChakraInit";
import {Radio, RadioGroup} from '@chakra-ui/react'
import {Input} from '@chakra-ui/react'
import {Divider} from '@chakra-ui/react'
import {Heading} from '@chakra-ui/react'

function Controls() {
    const {sliderValueX, setSliderValueX} = useContext(SliderContext);
    const {sliderValueY, setSliderValueY} = useContext(SliderContext);
    const {sliderValueZ, setSliderValueZ} = useContext(SliderContext);
    const {seed, setSeed} = useContext(SliderContext);

    const {rotateSpeed, setRotateSpeed} = useContext(SliderContext);

    const {doorSide, setDoorSide} = useContext(SliderContext);
    const {doorPosition, setDoorPosition} = useContext(SliderContext);
    const [selectedDoorSide, setSelectedDoorSide] = useState('Front');

    const {balconyPosition, setBalconyPosition} = useContext(SliderContext);

    function onSliderChangeX(val) {
        setSliderValueX(val)
    }

    function onSliderChangeY(val) {
        setSliderValueY(val)
    }

    function onSliderChangeZ(val) {
        setSliderValueZ(val)
    }

    function onSliderChangeSeed(val) {
        setSeed(val)
    }

    function onSliderChangeDoorPosition(val) {
        setDoorPosition(val)
    }

    function onSliderChangeSpeed(val) {
        setRotateSpeed(val)
    }

    function onInputChangeBalconyPositions(val) {
        const parsedArray = val.split(',').map(str => parseInt(str.trim(), 10)).filter(num => !isNaN(num));
        if (parsedArray.length === 0) {
            setBalconyPosition([1, 3]);
        } else {
            setBalconyPosition(parsedArray);
        }
    }

    useEffect(() => {
        if (doorSide === 'Front' || doorSide === 'Back') {
            setSelectedDoorSide(sliderValueZ - 2)
        } else {
            setSelectedDoorSide(sliderValueX - 2)
        }
    }, [doorSide, sliderValueX, sliderValueZ]);


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
                <Heading as='h3' size='lg'>
                    Configurator
                </Heading>

                <Text>Depth number: {sliderValueX}</Text>
                <Slider defaultValue={sliderValueX} min={0} max={20} step={1} onChangeEnd={val => onSliderChangeX(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

                <Text>Height number: {sliderValueY}</Text>
                <Slider defaultValue={sliderValueY} min={0} max={20} step={1} onChangeEnd={val => onSliderChangeY(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

                <Text>Width number: {sliderValueZ}</Text>
                <Slider defaultValue={sliderValueZ} min={0} max={20} step={1} onChangeEnd={val => onSliderChangeZ(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>


                <Text>Entrance door side:</Text>
                <RadioGroup onChange={setDoorSide} value={doorSide}>
                    <Stack direction='row' spacing='20px'>
                        <Radio value='Front'>Front</Radio>
                        <Radio value='Back'>Back</Radio>
                        <Radio value='Left'>Left</Radio>
                        <Radio value='Right'>Right</Radio>
                    </Stack>
                </RadioGroup>

                <Text>Door position: {doorPosition}</Text>
                <Slider defaultValue={doorPosition} min={1} max={selectedDoorSide} step={1}
                        onChangeEnd={val => onSliderChangeDoorPosition(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

                <Text>Balcony positions:</Text>
                <Input placeholder={`enter numbers with comma: ${balconyPosition.join(', ')}`}
                       onBlur={event => onInputChangeBalconyPositions(event.target.value)}/>


                <Text>Balcony sides:</Text>
                <Stack direction='row'>
                    <Checkbox defaultChecked>Front</Checkbox>
                    <Checkbox>Back</Checkbox>
                    <Checkbox>Left</Checkbox>
                    <Checkbox>Right</Checkbox>
                </Stack>

                <Divider mb='20px' mt='20px'/>

                <Heading as='h4' size='md'>
                    Additional settings:
                </Heading>

                <Text>Seed: {seed}</Text>
                <Slider defaultValue={seed} min={0} max={100} step={1} onChangeEnd={val => onSliderChangeSeed(val)}>
                    <SliderTrack bg='red.100'>
                        <Box position='relative' right={10}/>
                        <SliderFilledTrack bg='tomato'/>
                    </SliderTrack>
                    <SliderThumb boxSize={6}/>
                </Slider>

                <Text>Camera rotation speed: {rotateSpeed}</Text>
                <Slider defaultValue={rotateSpeed} min={0} max={5} step={0.1}
                        onChangeEnd={val => onSliderChangeSpeed(val)}>
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
