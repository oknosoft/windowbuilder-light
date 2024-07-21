import React from 'react';
import Contour from './Contour';
import Wireframe from './Wireframe';
import {BBAnchor, Html} from '@react-three/drei'

export default function Product({editor, project}) {
  if(!project) {
    return null;
  }
  const {bounds, props: {three, carcass}, contours} = project;
  const Layer = carcass === "carcass" ? Wireframe : Contour;
  return <>
    {contours.map((layer) =>
      <Layer
        key={`c-${layer.id}`}
        layer={layer}
        bounds={bounds}
        position={three.position}
        rotation={three.rotation.toArray()}
        quaternion={three.quaternion}
      />)}
    <BBAnchor anchor={[1, 1, 1]} position={[
      three.position.x + 60,
      three.position.y + (bounds?.height || 0) + 90, three.position.z + 40]}>
      <Html center>
        <span>{`Изд${editor.projects.indexOf(project) + 1}`}</span>
      </Html>
    </BBAnchor>
  </>;
}
