import React from 'react';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import {ToolbarMenu} from './Cut2DMenu';


export default function ResetSticksMenu({reset_sticks}) {
  return ToolbarMenu({
    title: 'Удалить данные оптимизации',
    icon: <PlaylistRemoveIcon/>,
    items: [
      {text: 'Полностью', action() {reset_sticks('all')}},
      {text: 'Текущей номенклатуры', action() {reset_sticks('currentNom')}},
      {text: 'Только на текущем листе', action() {reset_sticks('currentScrap')}},
      {divider: true},
      {text: 'Перезаполнить по плану', action() {reset_sticks('refill')}},
    ]
  })
}
