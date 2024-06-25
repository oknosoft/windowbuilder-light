import React from 'react';
import FieldSys from '../DataField/FieldSys';

export default function LayerProps({layer}) {
  return <>
    {`Слой ${layer.index}`}
    <FieldSys obj={layer} fld="sys" />
  </>;
}
