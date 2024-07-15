import React from 'react';
import Box from '@mui/material/Box';
import {HtmlTooltip} from '../../../aggregate/App/styled';

export default function Indicator({type, editor, elm}) {
  let icon, title;
  switch (type) {
    case 'elm':
      if(elm instanceof editor.Filling) {
        icon = 'icon_glass';
        title = 'заполнения';
      }
      else {
        icon = 'icon_profile';
        title = 'профиля';
      }
      break;
    case 'layer':
      icon = 'icon_layer';
      title = 'слоя';
      break;
    case 'product':
      icon = 'icon_root';
      title = 'изделия';
      break;
    case 'settings':
      icon = 'icon_gear';
      title = 'настроек';
      break;
    default:
      icon = 'icon_root';
      title = 'изделия';
  }
  return <HtmlTooltip title={`Команды ${title}`}>
    <Box sx={{mx: 1}} disabled className={`gl disabled dsn-treeview-icon ${icon}`}/>
  </HtmlTooltip>;
}
