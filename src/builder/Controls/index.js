import React from 'react';
import controlsToolbar from './Toolbar';
import {useBuilderContext} from '../Context';

export default function Controls() {
  const Toolbar = controlsToolbar();
  const {editor, tool, layer} = useBuilderContext();
  const ToolWnd = tool?.constructor?.ToolWnd;
  return <>
    <Toolbar>Controls</Toolbar>
    {ToolWnd ? <ToolWnd editor={editor} tool={tool} layer={layer}/> : null}
  </>;
}
