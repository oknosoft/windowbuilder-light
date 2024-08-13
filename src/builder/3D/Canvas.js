import React from 'react';
import {Canvas} from '@react-three/fiber';
import {PivotControls, OrbitControls, CameraControls, PerspectiveCamera, OrthographicCamera} from '@react-three/drei';
import Box from './Box';
import Planes from './Planes';

// <Box args={[4, 2, 0.1]} position={[1.8, 0, -0.98]} rotation={[0, 0.5, 0]} offset={[-1.8, 1, 0.98]}/>

export default function Canvas3D() {
  const [start, setStart] = React.useState(true);
  return <Canvas shadows="basic">
    <OrthographicCamera
      makeDefault
      scale={[5, 5, 5]}
      up={[0, 1, 0]}
      position={[1000, 800, 5000]}
    />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[3000, 3000, 3000]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI / 3} />
    <pointLight position={[-2000, 3000, -4000]} decay={0} intensity={Math.PI / 3} />
    <Planes />
    <gridHelper args={[4000, 40, '#ccc', '#eee']} position={[0, 0, 0]} rotation={[0, 0, 0]} />
    <CameraControls
      ref={target => {
        if(target && start) {
          target.setLookAt(1000, 1000, 5000, 1200, 500, 0);
          setStart(false);
        }
      }}
      makeDefault
    />
  </Canvas>;
}

