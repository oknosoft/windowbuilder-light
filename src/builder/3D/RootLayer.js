import React from 'react';
import Contour from './Contour';
import Wireframe from './Wireframe';


export default function RootLayer({editor, project, layer}) {

  const {props: {carcass}, contours} = project;
  const {bounds, three} = layer;
  const Layer = carcass === "carcass" ? Wireframe : Contour;
  return <Layer layer={layer} />;
}
