import React from 'react';
import FieldInsetProfile from '../DataField/FieldInsetProfile';

const {fields} =  $p.dp.builderPen.metadata();

export default function ProfileProps({layer, elm, node}) {
  const {b, e} = elm;
  return <>
    {`Слой ${layer.index}, Профиль ${elm._index+1}, Узлы ${b.vertex.key}-${e.vertex.key}`}
    <FieldInsetProfile obj={elm} fld="inset" meta={fields.inset}/>
  </>;
}
