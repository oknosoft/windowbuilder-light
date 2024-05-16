import React from 'react';
import { Canvas } from '@react-three/fiber';
import {PivotControls, OrbitControls, CameraControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import Box from './Box';
import Product from './Product';

// <Box args={[4, 2, 0.1]} position={[1.8, 0, -0.98]} rotation={[0, 0.5, 0]} offset={[-1.8, 1, 0.98]}/>

export default function Canvas3D() {
  return <Canvas shadows="basic" >
    <OrthographicCamera makeDefault position={[100, 300, 1500]} scale={[4, 4, 4]} rotation={[20, 0, 1]} />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[3000, 3000, 3000]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-2000, -2000, -2000]} decay={0} intensity={Math.PI} />
    <Product />
    <gridHelper args={[4000, 40, '#ccc', '#eee']} position={[100, 0, 0]} rotation={[0, 0, 0]} />
    <CameraControls makeDefault />
  </Canvas>;
}
