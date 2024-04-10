import React from 'react';
import { Canvas } from '@react-three/fiber';
import {PivotControls, OrbitControls, CameraControls, PresentationControls } from '@react-three/drei';
import Box from './Box';

export default function Canvas3D() {
  return <Canvas camera={{ position: [0.8, 2.6, 3] }}>
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Box args={[4, 2, 0.12]} position={[-2, 0, 0]} offset={[-2, 1, 0]} />
    <Box args={[4, 2, 0.12]} position={[1.8, 0, -0.98]} rotation={[0, 0.5, 0]} offset={[-1.8, 1, 0.98]}/>
    <gridHelper args={[20, 80, '#ccc', '#eee']} position={[-1, -1, 0]} rotation={[0, 0, 0]} />
    <CameraControls makeDefault />
  </Canvas>;
}
