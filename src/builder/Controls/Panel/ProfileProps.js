import React from 'react';
import Typography from '@mui/material/Typography';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import FieldInsetProfile from '../../DataField/InsetProfile';
import FieldEndConnection from '../../DataField/EndConnection';
import FieldCnnType from '../../DataField/CnnType';
import FieldCnnII from '../../DataField/CnnII';

const {dp, utils} = $p;
export const {fields} =  dp.builderPen.metadata();
const meta = {};

export default function ProfileProps({editor, project, layer, elm, node}) {
  const {b, e, imitationOf} = elm;
  const {carcass} = project.props;
  const selectB = utils.debounce(() => {
    const {selected} = b;
    editor.cmd('deselect', [{item: elm, node: 'e'}]);
    if(selected) {
      editor.cmd('deselect', [{item: elm, node: 'b'}]);
      editor.cmd('select', [{item: elm}]);
    }
    else {
      editor.cmd('select', [{item: elm, node: 'b'}]);
    }
  });
  const selectE = utils.debounce(() => {
    const {selected} = e;
    editor.cmd('deselect', [{item: elm, node: 'b'}]);
    if(selected) {
      editor.cmd('deselect', [{item: elm, node: 'e'}]);
      editor.cmd('select', [{item: elm, node: null}]);
    }
    else{
      editor.cmd('select', [{item: elm, node: 'e'}]);
    }
  });
  return <>
    {`Слой ${layer.index}, Профиль ${elm._index+1}, Узлы ${b.vertex.key}-${e.vertex.key}`}
    <FieldInsetProfile obj={elm} fld="inset" meta={fields.inset}/>
    <FieldCnnType CnnPoint={b} onClick={selectB}/>
    <FieldCnnType CnnPoint={e} onClick={selectE}/>
    {carcass !== 'carcass' && <>
      <FieldEndConnection obj={b} fld="cnn" onClick={selectB}/>
      <FieldEndConnection obj={b} fld="cnnOuter" onClick={selectB}/>
      <FieldEndConnection obj={e} fld="cnn" onClick={selectE}/>
      <FieldEndConnection obj={e} fld="cnnOuter" onClick={selectE}/>
      <FieldCnnII obj={elm} />
    </>}
    {imitationOf && <Typography>{`Это колн профиля ${imitationOf.presentation}`}</Typography>}
  </>;
}
