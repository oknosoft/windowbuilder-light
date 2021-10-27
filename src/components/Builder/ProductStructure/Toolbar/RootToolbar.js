
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tip from 'wb-forms/dist/Common/Tip';
import {useStyles} from '../../Toolbar'

function RootToolbar({editor, current, classes}) {
  const {msg} = $p;
  return <Toolbar disableGutters variant="dense">
    <Tip title={msg.bld_new_layer}>
      <IconButton onClick={() => addLayer(editor)}><i className="fa fa-file-o" /></IconButton>
    </Tip>
    <div className={classes.title} />
    <Tip title={msg.del_layer}>
      <IconButton onClick={() => dropLayer(editor)}><i className="fa fa-trash-o" /></IconButton>
    </Tip>
  </Toolbar>;
}

export default useStyles(RootToolbar);
