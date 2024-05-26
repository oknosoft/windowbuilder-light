import React from 'react';
import * as THREE from 'three';
import {Canvas} from '@react-three/fiber';
import {PivotControls, OrbitControls, CameraControls, PerspectiveCamera, OrthographicCamera} from '@react-three/drei';
import Box from './Box';
import Product from './Product';

// <Box args={[4, 2, 0.1]} position={[1.8, 0, -0.98]} rotation={[0, 0.5, 0]} offset={[-1.8, 1, 0.98]}/>

export default function Canvas3D() {
  return <Canvas shadows="basic" onCreated={(state) => {
    const {camera} = state;
    //camera.rotation.set(0, THREE.MathUtils.degToRad(Math.random() * 60 - 30), 0);
    //camera.matrix.makeRotationX(-0.5);
    // camera.matrix.elements = [
    //   3.976202115312729,
    //   -3.469446951953614e-18,
    //   -0.4356796279177863,
    //   0,
    //   -0.04551477008888723,
    //   3.978112809891009,
    //   -0.4153876231724023,
    //   0,
    //   0.43329567720707357,
    //   0.4178737510074807,
    //   3.9544451424103233,
    //   0,
    //   1466.0330759517567,
    //   980.2315075277418,
    //   4534.64812522537,
    //   1
    // ];
    camera.lookAt(new THREE.Vector3(2000, 1000, 0));
  }}>
    <OrthographicCamera
      makeDefault
      scale={[4, 4, 4]}
      up={[0, 1, 0]}
      position={[2000, 400, 4600]}
      //rotation={[-.12, 0.21, 0.27]}
    />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[3000, 3000, 3000]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI / 3} />
    <pointLight position={[-2000, 3000, -4000]} decay={0} intensity={Math.PI / 2} />
    <Product />
    <gridHelper args={[4000, 40, '#ccc', '#eee']} position={[100, 0, 0]} rotation={[0, 0, 0]} />
    <CameraControls makeDefault onChange={({type, target}) => {
      const {camera} = target;
      if(type === 'transitionstart') {
        console.log(camera.toJSON().object.matrix);
      }
    }}/>
  </Canvas>;
}

