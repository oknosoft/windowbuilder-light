import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import Divider from '@mui/material/Divider';

const meta = {};
export default function Settings({editor, project}) {
  if(!project) {
    return null;
  }

  const {props} = project;
  const onChange = () => {
    for(const project of editor.projects) {
      project.redraw();
    }
  };
  return <>
    <NumberField obj={props} fld="gridStep" meta={meta} onChange={onChange} label="Шаг сетки"/>
  </>;
}
