import React from 'react';
import FieldSys from '../DataField/Sys';
import Props3D from './Props3D';

export default function LayerProps({project, layer}) {
  return <>
    {layer.presentation}
    <FieldSys obj={layer} fld="sys" />
    <Props3D project={project} three={layer.three} />
  </>;
}
