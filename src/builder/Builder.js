import React from 'react';
import {styled} from '@mui/material/styles';
import SelectTool from './Toolbar/SelectTool';
import {Resize, ResizeVertical} from '@oknosoft/ui/Resize';
import geometry from '@oknosoft/wb/core/src/geometry';
const {EditorInvisible} = geometry;

export const Row = styled('div')(() => ({height: '100%'}));

export default function Builder({context, width, handleColor, resizeStop}) {

  let {editor, setContext} = context;
  const [show3d, setShow3d] = React.useState(true);
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
    <ResizeVertical height={show3d ? "70%" : "95%"} minHeight="400px">
      <Row>
        <SelectTool show3d={show3d} toggle3D={toggle3D} />
        <canvas key="builder-canvas" ref={createEditor} style={{left: 51, width: '100%', height: '100%'}}/>
      </Row>
    </ResizeVertical>
    <ResizeVertical minHeight={show3d ? "30%" : "5%"} show={show3d}>
      Вид сверху
    </ResizeVertical>
  </Resize>;
}

