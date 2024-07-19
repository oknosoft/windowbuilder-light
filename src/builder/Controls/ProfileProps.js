import React from 'react';
import FieldInsetProfile from '../DataField/InsetProfile';
import FieldEndConnection from '../DataField/EndConnection';

const {fields} =  $p.dp.builderPen.metadata();

export default function ProfileProps({layer, elm, node}) {
  const {b, e} = elm;
  return <>
    {`Слой ${layer.index}, Профиль ${elm._index+1}, Узлы ${b.vertex.key}-${e.vertex.key}`}
    <FieldInsetProfile obj={elm} fld="inset" meta={fields.inset}/>
    <FieldEndConnection obj={b} fld="cnn"/>
    <FieldEndConnection obj={b} fld="cnnOuter"/>
    <FieldEndConnection obj={e} fld="cnn"/>
    <FieldEndConnection obj={e} fld="cnnOuter"/>
  </>;
}
