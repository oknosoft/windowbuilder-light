import React from 'react';
import FieldSys from '../DataField/Sys';
import Props3D from './Props3D';

export default function LayerProps({editor, tool, project, layer, setContext}) {
  return <>
    {layer.presentation}
    <FieldSys obj={layer} fld="sys" />
    <Props3D editor={editor} tool={tool} project={project} layer={layer} setContext={setContext}/>
  </>;
}
