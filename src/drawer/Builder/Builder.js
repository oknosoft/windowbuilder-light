import React from 'react';
import {styled} from '@mui/material/styles';
import {useParams} from 'react-router';
import SelectTool from './SelectTool';
export const Row = styled('div')(() => ({height: '100%'}));
const Canvas = styled('canvas')(() => ({width: '100%', height: '100%'}));

function reset(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
}

export default function Builder({context, obj}) {

  let {editor, setContext} = context;
  const params = useParams();

  const createEditor = (el) => {
    if(el) {
      if(!editor) {
        editor = new $p.Editor(el);
      }
      if(window.paper !== editor) {
        window.paper = editor;
        const orderRow = obj.production.find({characteristic: params.ref});
        if(orderRow) {
          if(context.orderRow !== orderRow) {
            editor.project.load(orderRow.characteristic, false, obj);
            setContext({
              editor,
              project: editor.project,
              tool: editor.tool,
              calcOrder: obj,
              orderRow,
            });
          }
        }
        else {
          setContext({editor, calcOrder: obj, orderRow: null});
        }

      }
    }
    else {
      console.log(el);
    }
  };

  React.useEffect(() => {
    return () => {
      editor?.onload?.();
    };
  }, [editor]);

  return <Row>
    <SelectTool />
    <Canvas ref={createEditor} onContextMenu={reset} />
  </Row>;
}

