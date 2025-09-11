import React from 'react';
import {styled} from '@mui/material/styles';
import SelectTool from './SelectTool';
export const Row = styled('div')(() => ({height: '100%'}));

function reset(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
}

export default function Builder({context, width}) {

  let {editor, setContext} = context;

  const createEditor = (el) => {
    if(el) {
      if(!editor) {
        editor = new $p.Editor(el);
      }
      if(window.paper !== editor) {
        window.paper = editor;
        setContext({editor});
      }
    }
    else {
      console.log(el);
    }
  };

  return <Row>
    <SelectTool />
    <canvas
      key="builder-canvas"
      ref={createEditor}
      style={{left: 51, width: '100%', height: '100%'}}
      onContextMenu={reset}
    />
  </Row>;
}

