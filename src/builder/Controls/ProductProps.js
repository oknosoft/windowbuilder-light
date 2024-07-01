import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import Divider from '@mui/material/Divider';

const meta = {};
export default function ProductProps({editor, project}) {
  const {position, rotation, quaternion} = project.props.three;
  const onChange = () => {
    project.props.registerChange();
    project.redraw();
  };
  return <>
    {`Изделие №${editor.projects.indexOf(project) + 1}`}
    <NumberField obj={position} fld="x" meta={meta} onChange={onChange} label="X" />
    <NumberField obj={position} fld="y" meta={meta} onChange={onChange} label="Y" />
    <NumberField obj={position} fld="z" meta={meta} onChange={onChange} label="Z" />
    <Divider />
    <NumberField obj={rotation} fld="x" meta={meta} onChange={onChange} label="QX" />
    <NumberField obj={rotation} fld="y" meta={meta} onChange={onChange} label="QY" />
    <NumberField obj={rotation} fld="z" meta={meta} onChange={onChange} label="QZ" />
    <NumberField obj={quaternion} fld="w" meta={meta} onChange={onChange} label="QW" />
  </>;
}
