import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tip from 'wb-forms/dist/Common/Tip';
import {useStyles} from '../../Toolbar'

function addFlap(editor, furn) {
  const fillings = editor.project.getItems({class: $p.EditorInvisible.Filling, selected: true});
  if(fillings.length){
    fillings[0].create_leaf(furn);
  }
  else{
    $p.ui.dialogs.alert({text: 'Перед добавлением створки, укажите заполнение, в которое поместить створку', title: 'Добавить створку'});
  }
}

function GlassToolbar({editor, current, classes}) {
  const {msg} = $p;
  return <Toolbar disableGutters variant="dense">
    <Tip title={msg.bld_new_stv}>
      <IconButton onClick={() => addFlap(editor)}><i className="fa fa-file-code-o" /></IconButton>
    </Tip>
    <Tip title={msg.bld_new_nested}>
      <IconButton onClick={() => addFlap(editor, 'nested')}><i className="fa fa-file-image-o" /></IconButton>
    </Tip>
    <Tip title={msg.bld_new_virtual}>
      <IconButton onClick={() => addFlap(editor, 'virtual')}><i className="fa fa-file-excel-o" /></IconButton>
    </Tip>
  </Toolbar>;
}

export default useStyles(GlassToolbar);
