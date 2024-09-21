import React from 'react';
import Typography from '@mui/material/Typography';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import FieldInsetProfile from '../DataField/InsetProfile';
import FieldEndConnection from '../DataField/EndConnection';
import FieldCnnType from '../DataField/CnnType';
import FieldCnnII from '../DataField/CnnII';

const {fields} =  $p.dp.builderPen.metadata();
const meta = {};

export default function ProfileProps({project, layer, elm, node}) {
  const {b, e, imitationOf} = elm;
  const {carcass} = project.props;
  return <>
    {`Слой ${layer.index}, Профиль ${elm._index+1}, Узлы ${b.vertex.key}-${e.vertex.key}`}
    <FieldInsetProfile obj={elm} fld="inset" meta={fields.inset}/>
    <FieldCnnType CnnPoint={b} />
    <FieldCnnType CnnPoint={e} />
    {carcass !== 'carcass' && <>
      <FieldEndConnection obj={b} fld="cnn"/>
      <FieldEndConnection obj={b} fld="cnnOuter"/>
      <FieldEndConnection obj={e} fld="cnn"/>
      <FieldEndConnection obj={e} fld="cnnOuter"/>
      <FieldCnnII obj={elm} />
    </>}
    {imitationOf && <Typography>{`Это колн профиля ${imitationOf.presentation}`}</Typography>}
  </>;
}
