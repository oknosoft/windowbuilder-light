import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import Divider from '@mui/material/Divider';

const meta = {};
export default function ProductProps({editor, project}) {
  const {position, degree} = project.props.three;
  const onChange = () => {
    project.props.registerChange();
    project.redraw();
  };
  return <>
    {`Изделие №${editor.projects.indexOf(project) + 1}`}
    <NumberField obj={position} fld="x" meta={meta} onChange={onChange} label="Смещение X" />
    <NumberField obj={position} fld="y" meta={meta} onChange={onChange} label="Смещение Y" />
    <NumberField obj={position} fld="z" meta={meta} onChange={onChange} label="Смещение Z" />
    <NumberField obj={degree} fld="x" meta={meta} onChange={onChange} label="Поворот X" />
    <NumberField obj={degree} fld="y" meta={meta} onChange={onChange} label="Поворот Y" />
    <NumberField obj={degree} fld="z" meta={meta} onChange={onChange} label="Поворот Z" />
  </>;
}
