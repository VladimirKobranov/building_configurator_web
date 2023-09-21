import React, {Suspense, useContext, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Environment, Html, OrbitControls, SoftShadows, useProgress} from '@react-three/drei';
import {SliderContext} from "./ChakraInit";
import {Model} from "./Model";
import {degToRad} from "three/src/math/MathUtils";
import {EffectComposer, FXAA, N8AO, SMAA, SSAO} from "@react-three/postprocessing";
import {CircularProgress, CircularProgressLabel, Text} from "@chakra-ui/react";


function Loader() {
    const {progress} = useProgress()
    return (
        <Html center>
            <CircularProgress value={Math.floor(progress)} color='tomato' size='70px' thickness='8px'>
                <CircularProgressLabel>{Math.floor(progress)}%</CircularProgressLabel>
            </CircularProgress>
            <Text>
                Loading...
            </Text>
        </Html>
    )
}

export default function App() {
    const [meshPositions, setMeshPositions] = useState([]);
    const [meshRotations, setMeshRotations] = useState([]);
    const [meshType, setMeshType] = useState([]);
    const [pipeMeshType, setPipeMeshType] = useState([]);
    const [aircondMeshType, setAircondMeshType] = useState([]);
    const [roofAccessoriesMeshType, setRoofAccessoriesMeshType] = useState([]);
    const [balconyAccessoriesMeshType, setBalconyAccessoriesMeshType] = useState([]);
    const [gridData, setGridData] = useState([]);

    const xTile = 3.0;
    const yTile = 3.0;
    const zTile = 3.0;

    const {sliderValueX} = useContext(SliderContext);
    const {sliderValueY} = useContext(SliderContext);
    const {sliderValueZ} = useContext(SliderContext);
    const {seed} = useContext(SliderContext);

    const {doorSide} = useContext(SliderContext);
    const {doorPosition} = useContext(SliderContext);
    const {balconyPosition} = useContext(SliderContext);
    const {balconySide} = useContext(SliderContext);

    const {pipeBool} = useContext(SliderContext);
    const {airCondBool} = useContext(SliderContext);
    const {airCondPercentage} = useContext(SliderContext);
    const {roofAccessoriesPercentage} = useContext(SliderContext);
    const {roofAccessoriesBool} = useContext(SliderContext);
    const {balconyAccessoriesPercentage} = useContext(SliderContext);
    const {balconyAccessoriesBool} = useContext(SliderContext);

    const {rotateSpeed} = useContext(SliderContext);

    const seedRandom = require('seedrandom');
    let generator = seedRandom(seed);

    const generateGrid = () => {
        const gridData = [];

        for (let x = 0.0; x < sliderValueX; x++) {
            for (let y = 0.0; y < sliderValueY + 1; y++) {
                for (let z = 0.0; z < sliderValueZ; z++) {
                    const position = [x * xTile - (sliderValueX - 1) * xTile / 2,
                        y * yTile, //- yTile / 2
                        z * zTile - (sliderValueZ - 1) * zTile / 2
                    ];
                    if (sliderValueX === 1 || sliderValueY === 0 || sliderValueZ === 1) break;
                    let angleX = degToRad(0);
                    let angleY = degToRad(0);
                    let angleZ = degToRad(0);
                    let mesh = 'null';
                    let pipeMesh = 'null';
                    let aircondMesh = 'null';
                    let roofAccessoriesMesh = 'null';
                    let balconyAccessoriesMesh = 'null';

                    // main floor
                    if (x === 0 || x === sliderValueX - 1) {
                        if (x === 0) {

                            angleY = degToRad(180) //Front facade
                            if (z === 0 || z === sliderValueZ - 1) {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling_corner'
                                    if (z !== sliderValueZ - 1 && pipeBool) {
                                        pipeMesh = 'Pipe_2'
                                    }
                                } else if (y === 0) {
                                    mesh = 'Corner'
                                    if (z !== sliderValueZ - 1 && pipeBool) {
                                        pipeMesh = 'Pipe_1'
                                    }
                                } else {
                                    mesh = 'Corner'
                                    if (z !== sliderValueZ - 1 && pipeBool) {
                                        pipeMesh = 'Pipe_0'
                                    }
                                }
                                z === sliderValueZ - 1 ? angleY = degToRad(270) : angleY = degToRad(180)
                            } else {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling'
                                } else if (y === 0 && doorSide === 'Front' && z === doorPosition) {
                                    mesh = 'Door_0'
                                } else {
                                    if (y != 0 && balconyPosition.includes(z) && balconySide.includes('Front')) {
                                        mesh = `Window_balcony_${Math.floor(generator() * 7)}`;
                                        if (Math.floor(generator() * 100 < balconyAccessoriesPercentage && balconyAccessoriesBool)) {
                                            balconyAccessoriesMesh = `BalconyAccessories_${Math.floor(generator() * 5)}`;
                                        }
                                    } else {
                                        mesh = `Window_${Math.floor(generator() * 3)}`;
                                        if (Math.floor(generator() * 100) < airCondPercentage && airCondBool && y !== 0) {
                                            aircondMesh = `AirCond_${Math.floor(generator() * 3)}`;
                                        }

                                    }
                                }
                            }
                        } else {

                            angleY = degToRad(0) //Back facade
                            if (z === 0 || z === sliderValueZ - 1) {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling_corner'
                                    if (z !== 0 && pipeBool) {
                                        pipeMesh = 'Pipe_2'
                                    }
                                } else if (y === 0) {
                                    mesh = 'Corner'
                                    if (z !== 0 && pipeBool) {
                                        pipeMesh = 'Pipe_1'
                                    }
                                } else {
                                    mesh = 'Corner'
                                    if (z !== 0 && pipeBool) {
                                        pipeMesh = 'Pipe_0'
                                    }
                                }
                                z === sliderValueZ - 1 ? angleY = degToRad(0) : angleY = degToRad(90)
                            } else if (y === 0 && doorSide === 'Back' && z === doorPosition) {
                                mesh = 'Door_0'
                            } else {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling'
                                } else {
                                    if (y != 0 && balconyPosition.includes(z) && balconySide.includes('Back')) {
                                        mesh = `Window_balcony_${Math.floor(generator() * 7)}`;
                                        if (Math.floor(generator() * 100 < balconyAccessoriesPercentage && balconyAccessoriesBool)) {
                                            balconyAccessoriesMesh = `BalconyAccessories_${Math.floor(generator() * 5)}`;
                                        }
                                    } else {
                                        mesh = `Window_${Math.floor(generator() * 3)}`;
                                        if (Math.floor(generator() * 100) < airCondPercentage && airCondBool && y !== 0) {
                                            aircondMesh = `AirCond_${Math.floor(generator() * 3)}`;
                                        }
                                    }
                                }
                            }
                        }
                    } else if (z === 0) {

                        angleY = degToRad(90) //Left facade
                        if (y === sliderValueY) {
                            mesh = 'Ceiling'
                        } else if (y === 0 && doorSide === 'Left' && x === doorPosition) {
                            mesh = 'Door_0'
                        } else {
                            if (y != 0 && balconyPosition.includes(x) && balconySide.includes('Left')) {
                                mesh = `Window_balcony_${Math.floor(generator() * 7)}`;
                                if (Math.floor(generator() * 100 < balconyAccessoriesPercentage && balconyAccessoriesBool)) {
                                    balconyAccessoriesMesh = `BalconyAccessories_${Math.floor(generator() * 5)}`;
                                }
                            } else {
                                mesh = `Window_${Math.floor(generator() * 3)}`;
                                if (Math.floor(generator() * 100) < airCondPercentage && airCondBool && y !== 0) {
                                    aircondMesh = `AirCond_${Math.floor(generator() * 3)}`;
                                }
                            }
                        }
                    } else if (z === sliderValueZ - 1) {

                        angleY = degToRad(270) //Right facade
                        if (y === sliderValueY) {
                            mesh = 'Ceiling'
                        } else if (y === 0 && doorSide === 'Right' && x === doorPosition) {
                            mesh = 'Door_0'
                        } else {
                            if (y != 0 && balconyPosition.includes(x) && balconySide.includes('Right')) {
                                mesh = `Window_balcony_${Math.floor(generator() * 7)}`;
                                if (Math.floor(generator() * 100 < balconyAccessoriesPercentage && balconyAccessoriesBool)) {
                                    balconyAccessoriesMesh = `BalconyAccessories_${Math.floor(generator() * 5)}`;
                                }
                            } else {
                                mesh = `Window_${Math.floor(generator() * 3)}`;
                                if (Math.floor(generator() * 100) < airCondPercentage && airCondBool && y !== 0) {
                                    aircondMesh = `AirCond_${Math.floor(generator() * 3)}`;
                                }
                            }
                        }
                    } else {
                        // Roof cap
                        if (y === sliderValueY) {
                            mesh = 'Ceiling_cap'
                            if (Math.floor(generator() * 100) < roofAccessoriesPercentage && roofAccessoriesBool) {
                                roofAccessoriesMesh = `RoofAccessories_${Math.floor(generator() * 4)}`;
                            }
                        } else {
                            mesh = 'null'
                        }
                    }

                    const rotation = [angleX, angleY, angleZ]
                    const gridItem = {
                        position: position,
                        rotation: rotation,
                        meshType: mesh,
                        pipeMeshType: pipeMesh,
                        aircondMeshType: aircondMesh,
                        roofAccessoriesMesh: roofAccessoriesMesh,
                        balconyAccessoriesMesh: balconyAccessoriesMesh,
                    };

                    gridData.push(gridItem);
                }
            }
        }
        setMeshPositions(gridData.map(item => item.position));
        setMeshRotations(gridData.map(item => item.rotation));
        setMeshType(gridData.map(item => item.mesh));
        setPipeMeshType(gridData.map(item => item.pipeMeshType));
        setAircondMeshType(gridData.map((item => item.aircondMeshType)));
        setRoofAccessoriesMeshType(gridData.map((item => item.roofAccessoriesMeshType)));
        setBalconyAccessoriesMeshType(gridData.map((item => item.balconyAccessoriesMeshType)));
        setGridData(gridData);
        console.log("grid data: ", gridData);
    };

    useEffect(() => {
        generateGrid()
        console.log('updated')
    }, [sliderValueX, sliderValueY, sliderValueZ, seed, doorSide, doorPosition, balconyPosition, balconySide, pipeBool, airCondBool, airCondPercentage, rotateSpeed, roofAccessoriesPercentage, roofAccessoriesBool, balconyAccessoriesPercentage, balconyAccessoriesBool]);

    return (
        <Canvas shadows={'basic'} camera={{position: [-50, 20, -40], fov: 30}} gl={{antialias: false}}>
            <Suspense fallback={<Loader/>}>
                <SoftShadows samples={8} focus={2} size={2}/>
                <color attach="background" args={["#d0d0d0"]}/>
                <ambientLight intensity={0.3} color={'white'}/>
                <directionalLight
                    position={[-25, 25, 25]}
                    intensity={5}
                    castShadow
                    shadow-bias={0.00001}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.1}
                    shadow-camera-far={500}
                    shadow-camera-left={-100}
                    shadow-camera-right={100}
                    shadow-camera-top={100}
                    shadow-camera-bottom={-100}
                />
                <Environment preset="city"/>
                {/*<AccumulativeShadows temporal={true} frames={100} scale={100} position={[0, 0.01, 0]} opacity={0.5}>*/}
                {/*    <ambientLight intensity={0.3} color={'white'}/>*/}
                {/*    <directionalLight*/}
                {/*        position={[-25, 25, 25]}*/}
                {/*        intensity={5}*/}
                {/*        castShadow*/}
                {/*        shadow-bias={0.00001}*/}
                {/*        shadow-mapSize-width={8128}*/}
                {/*        shadow-mapSize-height={8128}*/}
                {/*        shadow-camera-near={0.1}*/}
                {/*        shadow-camera-far={500}*/}
                {/*        shadow-camera-left={-100}*/}
                {/*        shadow-camera-right={100}*/}
                {/*        shadow-camera-top={100}*/}
                {/*        shadow-camera-bottom={-100}*/}
                {/*    />*/}
                {/*</AccumulativeShadows>*/}
                {/*<PivotControls activeAxes={[true, true, true]} rotation={[0, 0, 0]} scale={3} anchor={[1, -1, 1]}>*/}
                {gridData.map((item, index) => (
                    <Model scale={1} key={index}
                           name={item.meshType}
                           position={item.position}
                           rotation={item.rotation}/>
                ))}
                {gridData.map((item, index) => (
                    <Model scale={1} key={index}
                           name={item.pipeMeshType}
                           position={item.position}
                           rotation={item.rotation}/>
                ))}
                {gridData.map((item, index) => (
                    <Model scale={1} key={index}
                           name={item.aircondMeshType}
                           position={item.position}
                           rotation={item.rotation}/>
                ))}
                {gridData.map((item, index) => (
                    <Model scale={1} key={index}
                           name={item.roofAccessoriesMesh}
                           position={item.position}
                           rotation={item.rotation}/>
                ))}
                {gridData.map((item, index) => (
                    <Model scale={1} key={index}
                           name={item.balconyAccessoriesMesh}
                           position={item.position}
                           rotation={item.rotation}/>
                ))}
                {/*</PivotControls>*/}
                <mesh receiveShadow castShadow rotation-x={degToRad(-90)}>
                    <planeGeometry args={[100, 100]} rotate={[90, 0, 0]}/>
                    <meshLambertMaterial color="#F2F2F2"/>
                </mesh>
                <EffectComposer multisampling={10}>
                    <N8AO fullRes color="black" aoRadius={2} intensity={1} aoSamples={32} denoiseSamples={32}/>
                    <SMAA/>
                    <SSAO/>
                    <FXAA/>
                </EffectComposer>
                <OrbitControls autoRotate autoRotateSpeed={rotateSpeed} target={[5, 5, 5]} makeDefault/>
            </Suspense>
        </Canvas>
    );
}
