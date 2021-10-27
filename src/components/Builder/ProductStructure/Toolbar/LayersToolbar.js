import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tip from 'wb-forms/dist/Common/Tip';
import {useStyles} from '../../Toolbar'

// создаёт слой и оповещает мир о новых слоях
function addLayer(/*editor*/) {
  const l = new $p.EditorInvisible.Contour({parent: undefined});
  l.activate();
  //editor.eve.emit_async('rows', editor.project.ox, {constructions: true});
}

function dropLayer(editor) {
  const {project, eve} = editor;
  const l = project.activeLayer;
  if(l) {
    l.remove();
    project.zoom_fit();
    const {contours} = project;
    if(contours.length) {
      contours[0].activate();
    }
  }
}

function LayersToolbar({editor, classes}) {
  const {msg} = $p;
  return <Toolbar disableGutters variant="dense">

    <div className={classes.title} />
    <Tip title={msg.del_layer}>
      <IconButton onClick={() => dropLayer(editor)}><i className="fa fa-trash-o" /></IconButton>
    </Tip>
  </Toolbar>;
}



export default useStyles(LayersToolbar);
