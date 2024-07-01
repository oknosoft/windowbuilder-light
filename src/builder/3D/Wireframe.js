import React from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';

export default function Wireframe({layer, bounds, position, rotation, quaternion}) {

  const pos = [
    bounds.x - position.x,
    position.y + bounds.y + bounds.height,
    position.z + (layer.layer ? 20 : 0),
  ];
  const res = [];
  for(const {b, e, inset} of layer.profiles) {
    let pb = b.point;
    let pe = e.point;
    const v1 = new THREE.Vector3(pb.x - pos[0], pos[1] - pb.y, pos[2]);
    const v2 = new THREE.Vector3(pe.x - pos[0], pos[1] - pe.y, pos[2]);
    res.push(<Line
      points={[v1, v2]}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
      color={inset.empty() ? '#a00' : '#00a'}                   // Default
      lineWidth={2}                   // In pixels (default)
      //segments                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
      //dashed={false}                  // Default
      //vertexColors={[[0, 0, 0], ...]} // Optional array of RGB values for each point
      //{...lineProps}                  // All THREE.Line2 props are valid
      //{...materialProps}              // All THREE.LineMaterial props are valid
    />);
  }
  for(const contour of layer.contours) {
    res.push(<Wireframe key={`c-${contour.id}`} layer={contour} bounds={bounds} position={position} rotation={[0,0,0]} quaternion={[0, 0, 0, 1]}/>);
  }
  return <group rotation={rotation}>{res}</group>;


}
