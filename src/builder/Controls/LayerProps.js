import React from 'react';
import FieldSys from '../DataField/Sys';

export default function LayerProps({layer}) {
  return <>
    {layer.presentation}
    <FieldSys obj={layer} fld="sys" />
  </>;
}
