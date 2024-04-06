import React from 'react'
import { Canvas } from '@react-three/fiber'
import {PivotControls, OrbitControls, PresentationControls } from '@react-three/drei'
import Box from './Box';

export default function Canvas3D() {
  return <Canvas>
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <PresentationControls global scale={1} rotation={[1.4, 0, 0]}>
      <Box position={[-3, 0, 0]} />
      <Box position={[3, 0, -1]} rotation={[0, 0.3, 0]} />
    </PresentationControls>
  </Canvas>;
}
