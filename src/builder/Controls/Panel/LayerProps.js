import React from 'react';
import FieldSys from '../../DataField/Sys';
import LayerProps3D from './LayerProps3D';
import LayerPropsFurn from './LayerPropsFurn';
import CurrentParams from './CurrentParams';

export default function LayerProps({editor, tool, project, layer, setContext}) {
  const isRoot = layer===project.rootLayer;
  const justified3D = project.contours.length > 1;
  return <>
    {layer.presentation}
    {layer.level <= 0 && <FieldSys disabled={isRoot} obj={layer} fld="sys" />}
    {!isRoot && justified3D &&
      <LayerProps3D key={layer.index} editor={editor} tool={tool} project={project} layer={layer} setContext={setContext}/>}
    <LayerPropsFurn layer={layer}/>
    {!isRoot && layer.level <= 0 && <CurrentParams params={layer.params} />}
  </>;
}
