import React from 'react';
import Contour from './Contour';
import Wireframe from './Wireframe';

export default function Product({project}) {
  if(!project) {
    return null;
  }
  const {bounds, props: {three, carcass}, contours} = project;
  const Layer = carcass === "carcass" ? Wireframe : Contour;
  return contours.map((layer) =>
    <Layer
      key={`c-${layer.id}`}
      layer={layer}
      bounds={bounds}
      position={three.position}
      rotation={three.rotation.toArray()}
      quaternion={three.quaternion}
    />);
}
