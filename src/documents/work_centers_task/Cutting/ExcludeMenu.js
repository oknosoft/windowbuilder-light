import React from 'react';
import FormatRemove from '../../../styles/icons/FormatRemove';
import {ToolbarMenu} from './Cut2DMenu';

export default function ExcludeMenu({exclude, mode}) {
  const items = [
    {text: 'Изделия текущей номенклатуры', action() {exclude('currentNom')}},
    {text: 'Изделия на текущем листе', action() {exclude('currentScrap')}},
  ];
  if(mode === 'cutting') {
    items.push({text: 'Текущее изделие', action() {exclude('currentProduct')}});
  }
  return ToolbarMenu({
    title: 'Исключить из задания',
    icon: <FormatRemove/>,
    items,
  })
}
