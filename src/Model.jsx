import React from 'react'
import {useGLTF, useTexture} from '@react-three/drei'
import {map} from "maath/buffer";
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";

export function Model(props) {
    const {nodes, materials} = useGLTF('/objects/window.glb')
    const texture = useLoader(TextureLoader, '/objects/map.png')
    texture.flipY = false;

    function selectMesh() {
        let selectedMesh = nodes.Window_0.geometry;

        if (props.name === 'Corner') {
            selectedMesh = nodes.Corner.geometry;
        } else if (props.name === 'null') {
            selectedMesh = nodes.Null.geometry;
        } else if (props.name === 'Ceiling') {
            selectedMesh = nodes.Ceiling.geometry;
        } else if (props.name === 'Ceiling_corner') {
            selectedMesh = nodes.Ceiling_corner.geometry;
        } else if (props.name === 'Ceiling_cap') {
            selectedMesh = nodes.Ceiling_cap.geometry;
        } else {
            if (props.name === 'Window_0') {
                selectedMesh = nodes.Window_0.geometry;
            } else if (props.name === 'Window_1') {
                selectedMesh = nodes.Window_1.geometry;
            } else if (props.name === 'Window_2') {
                selectedMesh = nodes.Window_2.geometry;
            }
        }

        return (selectedMesh)
    }

    return (
        <group {...props}   >
            <mesh receiveShadow castShadow
                  geometry={selectMesh()}>
                <meshLambertMaterial map={texture}/>
            </mesh>
        </group>
    )
}

useGLTF.preload('/objects/window.glb')
