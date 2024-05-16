import React from 'react';
import {styled} from '@mui/material/styles';
import {Resize, ResizeVertical} from '@oknosoft/ui/Resize';
import geometry from '@oknosoft/wb/core/src/geometry';
import SelectTool from './Toolbar/SelectTool';
import Canvas3D from './3D'
import {Wraper} from '../aggregate/App/Wraper';

const {EditorInvisible} = geometry;

export const Row = styled('div')(() => ({height: '100%'}));

function resetContex(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
}

export default function Builder({context, width, handleColor, resizeStop}) {

  let {editor, setContext} = context;
  const [show3d, setShow3d] = React.useState(false);
  const toggle3D = () => {
    setShow3d(!show3d);
    Promise.resolve().then(() => {
      resizeStop();
      editor.project.zoomFit();
    });
  }

  React.useEffect(() => {
    const {md, utils} = $p;
    const onRedraw = utils.debounce(function onRedraw(project) {
      if(editor?.project === project) {
        setContext({stamp: project.props.stamp})
      }
    });
    md.on('redraw', onRedraw);
    return () => md.off('redraw', onRedraw);
  }, [editor]);

  const createEditor = (el) => {
    if(el) {
      if(!editor) {
        editor = new EditorInvisible();
      }
      if(editor.view?.element !== el) {
        window.paper = editor;
        editor.createScheme(el, $p);
        setContext({editor});
      }
    }
    else {
      console.log(el);
    }
  };

  return <Resize handleWidth="6px" handleColor={handleColor} onResizeStop={resizeStop}>
    <ResizeVertical height={show3d ? "50%" : "95%"} minHeight="400px">
      <Row>
        <SelectTool show3d={show3d} toggle3D={toggle3D} />
        <canvas
          key="builder-canvas"
          ref={createEditor}
          style={{left: 51, width: '100%', height: '100%'}}
          onContextMenu={resetContex}
        />
      </Row>
    </ResizeVertical>
    <ResizeVertical minHeight={show3d ? "50%" : "5%"} show={show3d}>
      {show3d ? Wraper(Canvas3D) : null}
    </ResizeVertical>
  </Resize>;
}

