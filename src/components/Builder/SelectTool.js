/**
 * Выбор инструмента в панели инструментов
 *
 * @module SelectTool
 *
 * Created by Evgeniy Malyarov on 13.12.2019.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    top: 2,
  },
  fab: {
    boxShadow: 'none',
    background: 'none',
  },
  staticTooltipLabel: {
    width: 160,
  }
}));

/*
    <Tip title="Вписать в окно">
      <IconButton onClick={() => editor.project.zoom_fit && editor.project.zoom_fit()}><i className="tb_cursor-zoom" /></IconButton>
    </Tip>
*/

const actions = [
  { icon: <IconButton><i className="tb_icon-arrow-white" /></IconButton>, name: 'Элемент и узел' },
  { icon: <IconButton><i className="tb_icon-hand" /></IconButton>, name: 'Панорама' },
  { icon: <IconButton><i className="tb_cursor-zoom" /></IconButton>, name: 'Вписать в окно' },
  { icon: <IconButton><i className="tb_cursor-pen-freehand" /></IconButton>, name: '+ Профиль' },
  { icon: <IconButton><i className="tb_cursor-lay-impost"/></IconButton>, name: 'Раскладка' },
  { icon: <IconButton><i className="tb_cursor-arc-r"/></IconButton>, name: 'Арка' },
];

export default function SelectTool() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tool select"
        direction="down"
        className={classes.speedDial}
        icon={<IconButton><i className="tb_icon-arrow-white" /></IconButton>}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{size: 'small', color: 'inherit', classes: {root: classes.fab}, disableRipple: true, disableFocusRipple: true}}
      >
        {actions.map((action, index) => (
          <SpeedDialAction
            key={`act-${index}`}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipPlacement="right"
            tooltipOpen
            onClick={handleClose}
            classes={{staticTooltipLabel: classes.staticTooltipLabel}}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

