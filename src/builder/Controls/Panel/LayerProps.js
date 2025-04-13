import React from 'react';
import FieldSys from '../../DataField/Sys';
import LayerProps3D from './LayerProps3D';
import LayerPropsFurn from './LayerPropsFurn';
import CurrentParams from './CurrentParams';

export default function LayerProps({editor, tool, project, layer, setContext}) {
  return <>
    {layer.presentation}
    <FieldSys disabled={layer===project.rootLayer} obj={layer} fld="sys" />
    {layer===project.rootLayer ? null :
      <LayerProps3D key={layer.index} editor={editor} tool={tool} project={project} layer={layer} setContext={setContext}/>}
      <LayerPropsFurn layer={layer}/>
      <CurrentParams params={layer.params} />
  </>;
}
