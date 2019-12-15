/**
 * Выбор инструмента в панели инструментов
 *
 * @module SelectTool
 *
 * Created by Evgeniy Malyarov on 13.12.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tip from './Tip';

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

export const IBtn = ({children, css}) => {
  return css ?
    <ListItemIcon><i className={css}/></ListItemIcon> :
    <ListItemIcon>{children}</ListItemIcon>;
};

IBtn.propTypes = {
  css: PropTypes.string,
  children: PropTypes.node,
};

export const select_tool = (editor, id) => {
  switch (id) {
  case 'm1':
    editor.project.magnetism.m1();
    break;

  default:
    editor.tools.some((tool) => {
      if(tool.options.name == id){
        tool.activate();
        return true;
      }
    });
  }
};

const actions = [
  {icon: <IBtn css="tb_icon-arrow-white"/>, name: 'Элемент и узел', id: 'select_node'},
  {icon: <IBtn css="tb_icon-hand"/>, name: 'Панорама', id: 'pan'},
  {icon: <IBtn css="tb_cursor-zoom"/>, name: 'Вписать в окно', id: 'zoom'},
  {icon: <IBtn css="tb_cursor-pen-freehand"/>, name: 'Добавить профиль'},
  {icon: <IBtn css="tb_cursor-lay-impost"/>, name: 'Раскладка'},
  {icon: <IBtn css="tb_cursor-arc-r"/>, name: 'Арка'},
  {icon: <IBtn><small><i className="fa fa-magnet"></i><sub>1</sub></small></IBtn>, name: 'Импост по 0-штапику'},
  {icon: <IBtn><small><i className="fa fa-magnet"></i><sub>2</sub></small></IBtn>, name: 'T в угол'},
  {icon: <IBtn css="tb_cursor-cut"/>, name: 'Тип соединения'},
  {icon: <IBtn css="tb_ruler_ui"/>, name: 'Позиция и сдвиг'},
  {icon: <IBtn css="tb_grid"/>, name: 'Координаты'},
  {icon: <IBtn css="tb_text"/>, name: 'Текст'},
];

export default function SelectTool({editor}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tip title="Выбор инструмента">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <i className="fa fa-cogs fa-fw" />
        </IconButton>
      </Tip>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={`act-${index}`}
            selected={action.id === 'pan'}
            onClick={() => {
              if(action.id === 'zoom') {
                editor.project.zoom_fit && editor.project.zoom_fit();
              }
              else {
                select_tool(editor, action.id);
              }
              handleClose();
            }}>
            {action.icon}
            {action.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

}

