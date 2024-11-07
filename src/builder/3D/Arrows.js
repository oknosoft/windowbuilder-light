import React from 'react';
import {Line, Cone, BBAnchor, Html}  from '@react-three/drei';

const style={fontSize: '16px', opacity: 0.7};

export default function Arrows() {

  return <>
    <group>
      <Line points={[[0,0, -400], [0,0, 400]]} lineWidth={2} color="#ccc" transparent opacity={0.6} />
      <BBAnchor anchor={[0, 0, 1.4]}>
        <Html center position={[100, 0, 0]} style={style}>
          <span>изнутри</span>
        </Html>
      </BBAnchor>
      <BBAnchor anchor={[0, 0, -1.4]}>
        <Html center position={[0, 100, 0]} style={style}>
          <span>снаружи</span>
        </Html>
      </BBAnchor>
    </group>
    <Line points={[[-1000, 0, 0], [3000, 0, 0]]} lineWidth={2} color="#ccc" transparent opacity={0.6} />
    <Line points={[[0, -400, 0], [0, 3000, 0]]} lineWidth={2} color="#ccc" transparent opacity={0.6} />
  </>;


}
