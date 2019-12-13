/**
 * Выбор инструмента в панели инструментов
 *
 * @module SelectTool
 *
 * Created by Evgeniy Malyarov on 13.12.2019.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import PropTypes from 'prop-types';

export const useStyles = makeStyles(() => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    top: 2,
  },
  left: {
    left: 188,
  },
  fab: {
    boxShadow: 'none',
    backgroundColor: 'transparent'
  },
  staticTooltipLabel: {
    width: 160,
  },
  ibtn: {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    webkitAppearance: 'none',
    webkitTaphighlightColor: 'transparent',
  }
}));

/*
    <Tip title="Вписать в окно">
      <IconButton onClick={() => editor.project.zoom_fit && editor.project.zoom_fit()}><i className="tb_cursor-zoom" /></IconButton>
    </Tip>
*/

export const IBtn = ({children, css}) => {
  const classes = useStyles();
  return css ?
    <div className={classes.ibtn}><i className={css}/></div> :
    <div className={classes.ibtn}>{children}</div>;
};

IBtn.propTypes = {
  css: PropTypes.string,
  children: PropTypes.node,
};

const actions = [
  { icon: <IBtn css="tb_icon-arrow-white" />, name: 'Элемент и узел' },
  { icon: <IBtn css="tb_icon-hand" />, name: 'Панорама' },
  { icon: <IBtn css="tb_cursor-zoom" />, name: 'Вписать в окно' },
  { icon: <IBtn css="tb_cursor-pen-freehand" />, name: '+ Профиль' },
  { icon: <IBtn css="tb_cursor-lay-impost" />, name: 'Раскладка' },
  { icon: <IBtn css="tb_cursor-arc-r" />, name: 'Арка' },
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
        icon={<IBtn css="tb_icon-arrow-white" />}
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

