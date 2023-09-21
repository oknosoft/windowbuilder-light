import React from 'react';
import ObjTabular from './ObjTabular';
import {NumberCell, NumberFormatter} from '../../../packages/ui/DataField/Number';
import {PresentationFormatter} from '../../../packages/ui/DataField/RefField';
import {TextFormatter} from '../../../packages/ui/DataField/Text';

export const columns = [
  {key: "stick", width: 80, name: "№ загот", tooltip: "№ листа (хлыста, заготовки)", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "pair", width: 80, name: "№ пары", tooltip: "№ парной заготовки", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "nom", width: 240, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter},
  {key: "characteristic", width: 240, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter},
  {key: "len", width: 90, name: "Длина", tooltip: "длина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "width", width: 90, name: "Высота", tooltip: "ширина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "x", width: 90, name: "X", tooltip: "", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "y", width: 90, name: "Y", tooltip: "", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "quantity", width: 100, name: "Количество", tooltip: "Количество в единицах хранения", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "cell", width: 100, name: "Ячейка", tooltip: "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)", renderCell: TextFormatter}
];

export default function ObjCutsIn({tabRef, obj}) {
  return <ObjTabular tabRef={tabRef} tabular={obj.cuts} columns={columns}/>;
}
