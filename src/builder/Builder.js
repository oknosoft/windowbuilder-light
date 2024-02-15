import React from 'react';
import SelectTool from './Toolbar/SelectTool';
import {Resize, ResizeHorizon, ResizeVertical} from '@oknosoft/ui/Resize';
import geometry from '@oknosoft/wb/core/src/geometry';
const {EditorInvisible} = geometry;

export default function Builder({context, width, handleColor, resizeStop}) {

  let {editor, setContext} = context;

  const createEditor = (el) => {
    if(el) {
      if(!editor) {
        editor = new EditorInvisible();
      }
      if(editor.view?.element !== el) {
        editor.createScheme(el, $p);
        setContext({editor});
        window.paper = editor;
      }
    }
    else {
      console.log(el);
    }
  };

  return <>
    <Resize handleWidth="6px" handleColor={handleColor} onResizeStop={resizeStop} >
      <ResizeVertical height="80%" minHeight="400px">
        <Resize handleWidth="6px" handleColor={handleColor}>
          <ResizeHorizon width={`${(width - 100).toFixed()}px`} minWidth="400px">
            <SelectTool />
            <canvas key="builder-canvas" ref={createEditor} style={{width: '100%', height: '100%'}}/>
          </ResizeHorizon>
          <ResizeHorizon width="100px" minWidth="100px" show={false}>
            Right
          </ResizeHorizon>
        </Resize>
      </ResizeVertical>
      <ResizeVertical minHeight="140px">
        Вид сверху
      </ResizeVertical>
    </Resize>
  </>;
}

