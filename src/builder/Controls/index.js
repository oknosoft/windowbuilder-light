import React from 'react';
import controlsToolbar from './Toolbar';
import ProfileProps from './ProfileProps';
import LayerProps from './LayerProps';
import ProductProps from './ProductProps';
import {PaddingLeft} from '../../aggregate/App/styled';

import {useBuilderContext} from '../Context';

export default function Controls() {
  const {editor, tool, type, project, layer, elm, node, setContext} = useBuilderContext();
  const props = {editor, tool, type, project, layer, elm, node}
  let ToolWnd = tool?.constructor?.ToolWnd;
  const Toolbar = controlsToolbar({tool, type});
  if(!ToolWnd) {
    if(type === 'layer' && layer) {
      ToolWnd = LayerProps;
    }
    else if((type === 'elm' || type === 'node') && elm) {
      ToolWnd = ProfileProps;
    }
    else if((type === 'root') && project) {
      ToolWnd = ProductProps;
    }
  }

  return <>
    <Toolbar {...props}/>
    <PaddingLeft>
      {ToolWnd ? <ToolWnd {...props}/> : null}
    </PaddingLeft>
  </>;
}
