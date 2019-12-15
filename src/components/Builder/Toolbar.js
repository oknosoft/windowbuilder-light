import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseBtn from './CloseBtn';
import Tip from './Tip';
import SelectTool from './SelectTool';
//import {path} from '../App/menu_items';

export default function BuilderToolbar({editor, handleClose, classes}) {

  return <Toolbar disableGutters variant="dense">
    <Tip title="Рассчитать, записать и закрыть редактор">
      <IconButton><i className="fa fa-floppy-o" /></IconButton>
    </Tip>
    <Tip title="Рассчитать и записать изделие">
      <IconButton><i className="fa fa-calculator" /></IconButton>
    </Tip>
    <Tip title="Загрузить из типового блока">
      <IconButton><i className="tb_stamp" /></IconButton>
    </Tip>
    <SelectTool editor={editor} />
    <div className={classes.title} />
    {handleClose && <CloseBtn handleClose={handleClose}/>}
  </Toolbar>;
}

BuilderToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
};
