import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import CloseBtn from 'metadata-react/App/CloseButton';
import Tip from 'metadata-react/App/Tip';
import SelectTool from './SelectTool';
import NotiButton from '../../Notifications/Button';

export default function BuilderToolbar({editor, handleClose, noti, openTemplate, classes}) {

  return <Toolbar disableGutters variant="dense" className={classes.toolbar}>
    <Tip title="Сохранить изделие и заказ">
      <IconButton
        id="SaveRequestBtn"
        onClick={() => editor.project && editor.project.save_coordinates({save: true, _from_service: true})
          .then(() => null)
        }
      ><i className="fa fa-floppy-o" /></IconButton>
    </Tip>
    <Tip title="Рассчитать и записать изделие">
      <IconButton
        onClick={() => editor.project && editor.project.save_coordinates({save: true, _from_service: true})}
      ><i className="fa fa-calculator" /></IconButton>
    </Tip>
    <Tip title="Загрузить из типового блока">
      <IconButton onClick={openTemplate}><i className="tb_stamp" /></IconButton>
    </Tip>
    <Tip title="Вписать в окно">
      <IconButton onClick={() => editor.project.zoom_fit && editor.project.zoom_fit()}><i className="tb_cursor-zoom" /></IconButton>
    </Tip>
    <Tip title="Шаг назад">
      <IconButton disabled onClick={() => editor._undo && editor._undo.back()}><i className="tb_undo" /></IconButton>
    </Tip>
    <Tip title="Шаг вперед">
      <IconButton disabled onClick={() => editor._undo && editor._undo.rewind()}><i className="tb_redo" /></IconButton>
    </Tip>
    <SelectTool editor={editor} />

    <div className={classes.title} />
    <NotiButton {...noti} />
    <span id="closeBtnWindow">
    <CloseBtn handleClose={handleClose}/>
    </span>
  </Toolbar>;
}

BuilderToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  noti: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  openTemplate: PropTypes.func,
  classes: PropTypes.object.isRequired,
};
