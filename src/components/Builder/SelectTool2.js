/**
 * Выбор инструмента в панели инструментов
 *
 * @module SelectTool2
 *
 * Created by Evgeniy Malyarov on 13.12.2019.
 */

import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import cn from 'classnames';
import {useStyles, IBtn} from './SelectTool';

const actions = [
  { icon: <IBtn><small><i className="fa fa-magnet"></i><sub>1</sub></small></IBtn>, name: 'Импост по 0-штапику' },
  { icon: <IBtn><small><i className="fa fa-magnet"></i><sub>2</sub></small></IBtn>, name: 'T в угол' },
  { icon: <IBtn css="tb_cursor-cut" />, name: 'Тип соединения' },
  { icon: <IBtn css="tb_ruler_ui" />, name: 'Позиция и сдвиг' },
  { icon: <IBtn css="tb_grid" />, name: 'Координаты' },
  { icon: <IBtn css="tb_text" />, name: 'Текст' },
];

export default function SelectTool2() {
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
        className={cn(classes.speedDial, classes.left)}
        icon={<IBtn css="fa fa-magic" />}
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
            //tooltipPlacement="right"
            tooltipOpen
            onClick={handleClose}
            classes={{staticTooltipLabel: classes.staticTooltipLabel}}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

