import React from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';

export default function Wireframe({layer, bounds, position, rotation, quaternion}) {

  const pos = [
    bounds.x,
    bounds.y + bounds.height,
  ];
  const res = [];
  for(const {b, e, inset} of layer.profiles) {
    let pb = b.point;
    let pe = e.point;
    const v1 = new THREE.Vector3(pb.x - pos[0], pos[1] - pb.y, 0);
    const v2 = new THREE.Vector3(pe.x - pos[0], pos[1] - pe.y, 0);
    res.push(<Line
      points={[v1, v2]}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
      color={inset.empty() ? '#a00' : '#00a'}                   // Default
      lineWidth={2}                   // In pixels (default)
    />);
  }
  for(const contour of layer.contours) {
    res.push(<Wireframe key={`c-${contour.id}`} layer={contour} bounds={bounds} position={new THREE.Vector3()}/>);
  }
  return <group position={[position.x, position.y, position.z + (layer.layer ? 14 : 0)]} rotation={rotation}>{res}</group>;


}
