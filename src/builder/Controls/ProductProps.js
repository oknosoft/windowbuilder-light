import React from 'react';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import FieldSys from '../DataField/Sys';
import Props3D from './Props3D';


export default function ProductProps({editor, project}) {
  return <>
    {`Изделие №${editor.projects.indexOf(project) + 1}`}
    <FieldSys obj={project.props} fld="sys" />
    <Props3D project={project} three={project.props.three} />
  </>;
}
