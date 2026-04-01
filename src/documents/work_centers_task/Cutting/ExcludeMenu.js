import React from 'react';
import FormatRemove from '../../../styles/icons/FormatRemove';
import {ToolbarMenu} from './Cut2DMenu';

export default function ExcludeMenu({exclude}) {
  return ToolbarMenu({
    title: 'Исключить из задания',
    icon: <FormatRemove/>,
    items: [
      {text: 'Изделия текущей номенклатуры', action() {exclude('currentNom')}},
      {text: 'Изделия на текущем листе', action() {exclude('currentScrap')}},
    ]
  })
}
