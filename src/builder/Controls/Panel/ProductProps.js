import React from 'react';
import FieldSys from '../../DataField/Sys';
import CurrentParams from './CurrentParams';


export default function ProductProps({editor, project}) {
  return <>
    {`Изделие ${editor.projects.indexOf(project) + 1}`}
    <FieldSys obj={project.props} fld="sys" />
    <CurrentParams params={project.props} />
  </>;
}
