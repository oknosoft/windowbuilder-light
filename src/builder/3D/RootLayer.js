import React from 'react';
import Contour from './Contour';
import Wireframe from './Wireframe';
import {BBAnchor, Html} from '@react-three/drei'

export default function RootLayer({editor, project, layer}) {

  const {props: {carcass}, contours} = project;
  const {bounds, three} = layer;
  const Layer = carcass === "carcass" ? Wireframe : Contour;
  return <>
    <Layer
      layer={layer}
      bounds={bounds}
      position={three.position}
      rotation={three.rotation.toArray()}
      quaternion={three.quaternion}
    />
    <BBAnchor anchor={[1, 1, 1]} position={[
      three.position.x + 60,
      three.position.y + (bounds?.height || 0) + 90, three.position.z + 40]}>
      <Html center>
        <span>{`L${contours.indexOf(layer) + 1}`}</span>
      </Html>
    </BBAnchor>
  </>;
}
