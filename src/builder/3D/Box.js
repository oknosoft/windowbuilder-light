import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {PivotControls, Edges} from '@react-three/drei'

export default function Box({args, offset, ...props}) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  const mesh = <mesh
    {...props}
    ref={meshRef}
    //scale={active ? 1.2 : 1}
    onDoubleClick={(event) => setActive(!active)}
    onPointerOver={(event) => setHover(true)}
    onPointerOut={(event) => setHover(false)}>
    <boxGeometry args={args}/>
    <meshStandardMaterial color={hovered ? '#bbb' : '#eee'} />
    <Edges color="black" />
  </mesh>;
  return active ?
    <PivotControls offset={offset} anchor={[0, -2, 0]}  rotation={props.rotation} scale={0.75} lineWidth={2}>
      {mesh}
    </PivotControls> : mesh;
}
