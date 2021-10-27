import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import CloseBtn from 'wb-forms/dist/Common/CloseBtn';
import Tip from 'wb-forms/dist/Common/Tip';
import SelectTool from './SelectTool';
import Notifications from '../../App/Notifications';

export const useStyles = withStyles({
  title: {
    flexGrow: 1,
  },
  sp: {
    paddingLeft: 8,
  },
});

export default function BuilderToolbar({editor, handleClose, openTemplate, open_ox, classes}) {

  return <AppBar position="static" color="default">
    <Toolbar disableGutters variant="dense">
      <Tip title="Рассчитать, записать и закрыть редактор">
        <IconButton
          onClick={() => editor.project && editor.project.save_coordinates({save: true, _from_service: true})
            .then(() => null)
          }
        ><i className="fa fa-floppy-o" /></IconButton>
      </Tip>
      <Tip title="Рассчитать и записать иизделие">
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
      <SelectTool editor={editor} />

      <div className={classes.title} />
      <Tip title="История редактирования">
        <IconButton disabled onClick={() => null}><i className="fa fa-history" /></IconButton>
      </Tip>
      <Tip title="Открыть спецификацию изделия">
        <IconButton onClick={open_ox}><i className="fa fa-table fa-fw" /></IconButton>
      </Tip>
      <Notifications />
      {handleClose && <CloseBtn handleClose={handleClose}/>}
    </Toolbar>
  </AppBar>;
}

BuilderToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  openTemplate: PropTypes.func,
  open_ox: PropTypes.func,
  classes: PropTypes.object.isRequired,
};
