import React from 'react';
import Contour from './Contour';

export default function Product({project}) {
  if(!project) {
    return null;
  }
  const {bounds} = project;
  return project.contours.map((layer) => <Contour key={`c-${layer.id}`} layer={layer} bounds={bounds}/>);
}
