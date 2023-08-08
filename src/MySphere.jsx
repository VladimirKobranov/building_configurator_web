import React, {useState} from 'react';
import {Sphere} from '@react-three/drei';

function MySphere(props) {
    const [sphereColor, setSphereColor] = useState('red');

    function onClick() {
        setSphereColor('blue');
        console.log('clicked');
        setTimeout(() => {
            setSphereColor('red');
        }, 1000); // 1 second
    }

    return (
        <Sphere position={props.position} onClick={onClick}>
            <meshStandardMaterial color={sphereColor}/>
        </Sphere>
    );
}

export default MySphere;
