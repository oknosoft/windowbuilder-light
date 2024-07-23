import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import Checkbox from '@oknosoft/ui/DataField/Checkbox';
import UseSnap from '../DataField/UseSnap';

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
    <UseSnap obj={props} fld="snap" meta={meta} onChange={onChange} label="Привязка к" />
    <Checkbox obj={props} fld="showGrid" meta={meta} onChange={onChange} label="Показывать сетку"/>
    <NumberField obj={props} fld="snapAngle" meta={meta} onChange={onChange} label="Угол привязки"/>
    <NumberField obj={props} fld="gridStep" meta={meta} onChange={onChange} label="Шаг сетки"/>
  </>;
}
