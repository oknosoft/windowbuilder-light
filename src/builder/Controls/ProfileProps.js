import React from 'react';
import FieldInsetProfile from '../DataField/InsetProfile';
import FieldEndConnection from '../DataField/EndConnection';
import FieldCnnType from '../DataField/CnnType';

const {fields} =  $p.dp.builderPen.metadata();

export default function ProfileProps({project, layer, elm, node}) {
  const {b, e} = elm;
  const {carcass} = project.props;
  return <>
    {`Слой ${layer.index}, Профиль ${elm._index+1}, Узлы ${b.vertex.key}-${e.vertex.key}`}
    <FieldInsetProfile obj={elm} fld="inset" meta={fields.inset}/>
    <FieldCnnType />
    {carcass !== 'carcass' && <>
      <FieldEndConnection obj={b} fld="cnn"/>
      <FieldEndConnection obj={b} fld="cnnOuter"/>
      <FieldEndConnection obj={e} fld="cnn"/>
      <FieldEndConnection obj={e} fld="cnnOuter"/>
    </>}
  </>;
}
