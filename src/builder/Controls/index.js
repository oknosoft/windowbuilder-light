import React from 'react';
import ControlsToolbar from './Toolbar';
import ProfileProps from './ProfileProps';
import PairProps from './PairProps';
import LayerProps from './LayerProps';
import ProductProps from './ProductProps';
import FillingProps from './FillingProps';
import Settings from './Settings';
import {PaddingLeft} from '../../aggregate/App/styled';

import {useBuilderContext} from '../Context';

export default function Controls() {
  const {editor, tool, type, project, layer, elm, node, setContext} = useBuilderContext();
  const props = {editor, tool, type, project, layer, elm, node};
  let ToolWnd = tool?.constructor?.ToolWnd;
  if(!ToolWnd) {
    if(type === 'layer' && layer) {
      ToolWnd = LayerProps;
    }
    else if((type === 'elm' || type === 'node') && elm) {
      ToolWnd = elm instanceof editor.Filling ? FillingProps : ProfileProps;
    }
    else if((type === 'product') && project) {
      ToolWnd = ProductProps;
    }
    else if(type === 'root') {
      ToolWnd = Settings;
    }
  }

  return <>
    {ControlsToolbar(props)}
    <PaddingLeft>
      {ToolWnd ? <ToolWnd {...props}/> : null}
    </PaddingLeft>
  </>;
}
