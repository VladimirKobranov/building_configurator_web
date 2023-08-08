import React from 'react'
import {useGLTF} from '@react-three/drei'

export function Model(props) {
    const {nodes, materials} = useGLTF('/objects/Window.glb')

    function selectMesh(){
        let selectedMesh = nodes.Window.geometry;

        if(props.name === 'Corner'){
        selectedMesh =  nodes.Corner.geometry;
            console.log('corner selected')
        }else if( props.name === 'null'){
            console.log('null selected')
            selectedMesh = nodes.Null.geometry;
        }else{
            selectedMesh = nodes.Window.geometry;
            console.log('window selected')
        }
        return(selectedMesh)
    }

    return (
        <group {...props} dispose={null}>
            <mesh geometry={selectMesh()} material={nodes.Window.material}/>
            {/*<mesh geometry={meshCorner} material={nodes.Corner.material}/>*/}
        </group>
    )
}

useGLTF.preload('/objects/Window.glb')
