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
    // camera.matrix.fromArray([
    //   3.981561494649535,
    //   0,
    //   -0.38362490055282356,
    //   0,
    //   -0.07363251594862906,
    //   3.9256275608563165,
    //   -0.7642162691544592,
    //   0,
    //   0.3764921206602319,
    //   0.7677553343645915,
    //   3.907531884660121,
    //   0,
    //   1577.8100110104212,
    //   1315.1773142198153,
    //   4757.031889676556,
    //   1
    // ]);
    // camera.quaternion.fromArray([-0.09630746632955606, 0.047784792001915495, 0.004628911550445007, 0.9941931697413603]);

    camera.lookAt(new THREE.Vector3(1000, 800, 0));
  }}>
    <OrthographicCamera
      makeDefault
      scale={[4, 4, 4]}
      up={[0, 1, 0]}
      position={[1000, 600, 5000]}
      onUpdate={camera => {
        //camera.matrixAutoUpdate = false;
        //camera.lookAt(2000, 1000, 0);
        //camera.updateProjectionMatrix();
        //camera.updateMatrix();
      }}
      //rotation={[-.12, 0.21, 0.27]}
    />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[3000, 3000, 3000]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI / 3} />
    <pointLight position={[-2000, 3000, -4000]} decay={0} intensity={Math.PI / 2} />
    <Product />
    <gridHelper args={[4000, 40, '#ccc', '#eee']} position={[100, 0, 0]} rotation={[0, 0, 0]} />
    <CameraControls
      ref={target => {
        target?.setLookAt(1000, 800, 5000, 1200, 400, 0);
      }}
      makeDefault
    />
  </Canvas>;
}

