import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseBtn from './CloseBtn';
import Tip from './Tip';
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
    <Tip title="Элементы и узлы">
      <IconButton><i className="tb_icon-arrow-white" /></IconButton>
    </Tip>
    <Tip title="Вписать в окно">
      <IconButton onClick={() => editor.project.zoom_fit && editor.project.zoom_fit()}><i className="tb_cursor-zoom" /></IconButton>
    </Tip>
    <div className={classes.title} />
    {handleClose && <CloseBtn handleClose={handleClose}/>}
  </Toolbar>;
}

BuilderToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
};
