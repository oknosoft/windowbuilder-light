import React from 'react';
import SelectTool from './Toolbar/SelectTool';
import geometry from '@oknosoft/wb/core/src/geometry';
const {EditorInvisible} = geometry;

export default function Builder({context}) {

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
    <SelectTool />
    <canvas key="builder-canvas" ref={createEditor} style={{width: '100%', height: '100%'}}/>
  </>;
}
