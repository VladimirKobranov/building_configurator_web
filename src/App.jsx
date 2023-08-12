import React, {useContext, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, PivotControls} from '@react-three/drei';
import {Environment} from './Environment';
import {SliderContext} from "./ChakraInit";
import {Model} from "./Model";
import {degToRad} from "three/src/math/MathUtils";

export default function App() {
    const [meshPositions, setMeshPositions] = useState([]);
    const [meshRotations, setMeshRotations] = useState([]);
    const [meshType, setMeshType] = useState([]);
    const [gridData, setGridData] = useState([]);

    const xTile = 3.0;
    const yTile = 3.0;
    const zTile = 3.0;

    const {sliderValueX} = useContext(SliderContext);
    const {sliderValueY} = useContext(SliderContext);
    const {sliderValueZ} = useContext(SliderContext);
    const {seed} = useContext(SliderContext);

    const seedRandom = require('seedrandom');
    let generator = seedRandom(seed);

    const generateGrid = () => {
        const gridData = [];

        for (let x = 0.0; x < sliderValueX; x++) {
            for (let y = 0.0; y < sliderValueY+1; y++) {
                for (let z = 0.0; z < sliderValueZ; z++) {
                    const position = [x * xTile - (sliderValueX - 1) * xTile / 2,
                        y * yTile - yTile / 2,
                        z * zTile - (sliderValueZ - 1) * zTile / 2
                    ];
                    let angleX = degToRad(0);
                    let angleY = degToRad(0);
                    let angleZ = degToRad(0);
                    let mesh = 'null';

                    // main floor
                    if (x === 0 || x === sliderValueX - 1) {
                        if(x === 0){
                            angleY = degToRad(180)
                            if(z === 0 || z === sliderValueZ-1){
                                if(y === sliderValueY){
                                    mesh = 'Ceiling_corner'
                                }else{
                                    mesh = 'Corner'
                                }
                                z === sliderValueZ-1 ? angleY = degToRad(270): angleY = degToRad(180)
                            }else {
                                if(y === sliderValueY){
                                    mesh = 'Ceiling'
                                }else{
                                    mesh = `Window_${Math.floor(generator() * 3)}`;
                                }
                            }
                        }else {
                            angleY = degToRad(0)
                            if(z === 0 || z === sliderValueZ-1){
                                if(y === sliderValueY){
                                    mesh = 'Ceiling_corner'
                                }else{
                                    mesh = 'Corner'
                                }
                                z === sliderValueZ-1 ? angleY = degToRad(0): angleY = degToRad(90)
                            }else {
                                if(y === sliderValueY){
                                    mesh = 'Ceiling'
                                }else {
                                    mesh = `Window_${Math.floor(generator() * 3)}`;
                                }
                            }
                        }
                    } else if (z === 0) {
                        angleY = degToRad(90)
                        if(y === sliderValueY){
                            mesh = 'Ceiling'
                        }else {
                            mesh = `Window_${Math.floor(generator() * 3)}`;
                        }
                    } else if (z === sliderValueZ - 1) {
                        angleY = degToRad(270)
                        if(y === sliderValueY){
                            mesh = 'Ceiling'
                        }else {
                            mesh = `Window_${Math.floor(generator() * 3)}`;
                        }
                    }else {
                        if(y === sliderValueY){
                            mesh = 'Ceiling_cap'
                        }else {
                            mesh = 'null'
                        }
                    }


                    const rotation = [angleX, angleY, angleZ]
                    const gridItem = {
                        position: position,
                        rotation: rotation,
                        meshType: mesh
                    };


                    gridData.push(gridItem);
                }
            }
        }
        setMeshPositions(gridData.map(item => item.position));
        setMeshRotations(gridData.map(item => item.rotation));
        setMeshType(gridData.map(item => item.mesh))
        setGridData(gridData);
        console.log("grid data: ", gridData);
    };


    useEffect(() => {
        generateGrid()
        console.log('updated')
    }, [sliderValueX, sliderValueY, sliderValueZ,seed]);


    return (
        <Canvas shadows camera={{position: [-55, 20, 35], fov: 25}}>
            <color attach="background" args={['skyblue']}/>
            <Environment/>
            <OrbitControls makeDefault/>
            <PivotControls activeAxes={[true, true, true]} rotation={[0, 0, 0]} scale={3} anchor={[1, -1, 1]}>
                {gridData.map((item, index) => (
                    <Model scale={1} key={index}
                                 name={item.meshType}
                                 position={item.position}
                                 rotation={item.rotation}/>
                ))}
            </PivotControls>
        </Canvas>
    );
}
