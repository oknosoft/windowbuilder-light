import React from 'react';
import FieldSys from '../DataField/Sys';
import LayerProps3D from './LayerProps3D';
import LayerPropsFurn from './LayerPropsFurn';

export default function LayerProps({editor, tool, project, layer, setContext}) {
  return <>
    {layer.presentation}
    <FieldSys obj={layer} fld="sys" />
    <LayerProps3D key={layer.index} editor={editor} tool={tool} project={project} layer={layer} setContext={setContext}/>
    <LayerPropsFurn layer={layer}/>
  </>;
}
