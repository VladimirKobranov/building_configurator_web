import React, {Suspense, useContext, useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {
    AccumulativeShadows,
    Environment,
    OrbitControls,
    PivotControls,
    SoftShadows,
    useTexture
} from '@react-three/drei';
import {SliderContext} from "./ChakraInit";
import {Model} from "./Model";
import {degToRad} from "three/src/math/MathUtils";
import {EffectComposer, FXAA, N8AO, SMAA, SSAO} from "@react-three/postprocessing";

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

    const {doorSide} = useContext(SliderContext);
    const {doorPosition} = useContext(SliderContext);
    const {balconyPosition} = useContext(SliderContext);

    const {rotateSpeed} = useContext(SliderContext);

    const seedRandom = require('seedrandom');
    let generator = seedRandom(seed);


    const generateGrid = () => {
        const gridData = [];
        console.log('balcony pos:', balconyPosition);

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

                    // main floor
                    if (x === 0 || x === sliderValueX - 1) {
                        if (x === 0) {
                            angleY = degToRad(180)
                            if (z === 0 || z === sliderValueZ - 1) {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling_corner'
                                } else {
                                    mesh = 'Corner'
                                }
                                z === sliderValueZ - 1 ? angleY = degToRad(270) : angleY = degToRad(180)
                            } else {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling'
                                } else if (y === 0 && doorSide === 'Front' && z === doorPosition) {
                                    mesh = 'Door_0'
                                } else {
                                    if (y != 0 && balconyPosition.includes(z)) {
                                        mesh = 'Window_Balcony_1';
                                    } else {
                                        mesh = `Window_${Math.floor(generator() * 3)}`;
                                    }
                                }
                            }
                        } else {
                            angleY = degToRad(0)
                            if (z === 0 || z === sliderValueZ - 1) {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling_corner'
                                } else {
                                    mesh = 'Corner'
                                }
                                z === sliderValueZ - 1 ? angleY = degToRad(0) : angleY = degToRad(90)
                            } else if (y === 0 && doorSide === 'Back' && z === doorPosition) {
                                mesh = 'Door_0'
                            } else {
                                if (y === sliderValueY) {
                                    mesh = 'Ceiling'
                                } else {
                                    mesh = `Window_${Math.floor(generator() * 3)}`;
                                }
                            }
                        }
                    } else if (z === 0) {
                        angleY = degToRad(90)
                        if (y === sliderValueY) {
                            mesh = 'Ceiling'
                        } else if (y === 0 && doorSide === 'Left' && x === doorPosition) {
                            mesh = 'Door_0'
                        } else {
                            mesh = `Window_${Math.floor(generator() * 3)}`;
                        }
                    } else if (z === sliderValueZ - 1) {
                        angleY = degToRad(270)
                        if (y === sliderValueY) {
                            mesh = 'Ceiling'
                        } else if (y === 0 && doorSide === 'Right' && x === doorPosition) {
                            mesh = 'Door_0'
                        } else {
                            mesh = `Window_${Math.floor(generator() * 3)}`;
                        }
                    } else {
                        if (y === sliderValueY) {
                            mesh = 'Ceiling_cap'
                        } else {
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
    }, [sliderValueX, sliderValueY, sliderValueZ, seed, doorSide, doorPosition, balconyPosition, rotateSpeed]);

    return (
        <Canvas shadows={'soft'} camera={{position: [-70, 25, -50], fov: 30}} gl={{antialias: false}}>
            <Suspense fallback={null}>
                <SoftShadows samples={64} focus={2} size={1}/>
                <color attach="background" args={["#d0d0d0"]}/>
                <ambientLight intensity={0.3} color={'white'}/>
                <directionalLight
                    position={[-25, 25, 25]}
                    intensity={5}
                    castShadow
                    shadow-bias={0.00001}
                    shadow-mapSize-width={8128}
                    shadow-mapSize-height={8128}
                    shadow-camera-near={0.1}
                    shadow-camera-far={500}
                    shadow-camera-left={-100}
                    shadow-camera-right={100}
                    shadow-camera-top={100}
                    shadow-camera-bottom={-100}
                />
                <Environment preset="city"/>
                <AccumulativeShadows temporal={true} frames={100} scale={100} position={[0, 0.01, 0]} opacity={0.5}>
                    <ambientLight intensity={0.3} color={'white'}/>
                    <directionalLight
                        position={[-25, 25, 25]}
                        intensity={5}
                        castShadow
                        shadow-bias={0.00001}
                        shadow-mapSize-width={8128}
                        shadow-mapSize-height={8128}
                        shadow-camera-near={0.1}
                        shadow-camera-far={500}
                        shadow-camera-left={-100}
                        shadow-camera-right={100}
                        shadow-camera-top={100}
                        shadow-camera-bottom={-100}
                    />
                </AccumulativeShadows>
                <PivotControls activeAxes={[true, true, true]} rotation={[0, 0, 0]} scale={3} anchor={[1, -1, 1]}>
                    {gridData.map((item, index) => (
                        <Model scale={1} key={index}
                               name={item.meshType}
                               position={item.position}
                               rotation={item.rotation}/>
                    ))}
                </PivotControls>
                <mesh receiveShadow castShadow rotation-x={degToRad(-90)}>
                    <planeGeometry args={[100, 100]} rotate={[90, 0, 0]}/>
                    <meshLambertMaterial color="#F2F2F2"/>
                </mesh>
                {/*<mesh receiveShadow castShadow position={[10, 2.5, 10]}>*/}
                {/*    <boxGeometry args={[5, 5, 5]}/>*/}
                {/*    <meshLambertMaterial color="white"/>*/}
                {/*</mesh>*/}
                <EffectComposer multisampling={10}>
                    <N8AO fullRes color="black" aoRadius={2} intensity={1} aoSamples={32} denoiseSamples={32}/>
                    <SMAA/>
                    <SSAO/>
                    <FXAA/>
                </EffectComposer>
                <OrbitControls autoRotate autoRotateSpeed={rotateSpeed} makeDefault/>
            </Suspense>
        </Canvas>
    );
}
