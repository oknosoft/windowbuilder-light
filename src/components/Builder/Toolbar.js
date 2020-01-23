import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseBtn from './CloseBtn';
import Tip from './Tip';
import SelectTool from './SelectTool';
//import {path} from '../App/menu_items';

export default function BuilderToolbar({editor, handleClose, openTemplate, classes}) {

  return <Toolbar disableGutters variant="dense">
    <Tip title="Рассчитать, записать и закрыть редактор">
      <IconButton onClick={() => {
        editor.project && editor.project.save_coordinates({save: true, _from_service: true})
          .then(handleClose)
          .catch(console.log);
      }}><i className="fa fa-floppy-o" /></IconButton>
    </Tip>
    <Tip title="Рассчитать и записать изделие">
      <IconButton onClick={() => {
        editor.project && editor.project.save_coordinates({save: true, _from_service: true}).catch(console.log);
      }}><i className="fa fa-calculator" /></IconButton>
    </Tip>
    <Tip title="Загрузить из типового блока">
      <IconButton onClick={openTemplate}><i className="tb_stamp" /></IconButton>
    </Tip>
    <Tip title="Вписать в окно">
      <IconButton onClick={() => editor.project.zoom_fit && editor.project.zoom_fit()}><i className="tb_cursor-zoom" /></IconButton>
    </Tip>
    <SelectTool editor={editor} />
    <div className={classes.title} />
    {handleClose && <CloseBtn handleClose={handleClose}/>}
  </Toolbar>;
}

BuilderToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  openTemplate: PropTypes.func,
  classes: PropTypes.object.isRequired,
};
