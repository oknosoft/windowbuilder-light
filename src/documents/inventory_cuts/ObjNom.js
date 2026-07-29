import React from 'react';
import ObjTabular from '../../aggregate/FrmObj/ObjTabular';
import {NumberCell, NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter} from 'metadata-ui/DataField/Text';
import RefCell from 'metadata-ui/DataField/RefCell';
import BtnFill from './BtnFill';

const columns = [
  {key: "nom", width: 320, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter, renderEditCell: RefCell},
  //{key: "characteristic", width: 240, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter},
  {key: "len", width: 100, name: "Длина", tooltip: "длина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "width", width: 100, name: "Высота", tooltip: "ширина в мм", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "qty", width: 100, name: "Кол-во шт", tooltip: "Количество штук", renderCell: NumberFormatter, renderEditCell: NumberCell},
  {key: "quantity", width: 100, name: "Колич", tooltip: "Количество в единицах хранения", renderCell: NumberFormatter},
  //{key: "cell", width: 100, name: "Ячейка", tooltip: "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)", renderCell: TextFormatter}
];

export default function ObjNom({tabRef, obj, setBackdrop}) {

  const buttons = <BtnFill obj={obj} setBackdrop={setBackdrop} />;

  return <ObjTabular tabRef={tabRef} tabular={obj.materials} columns={columns} buttons={buttons}/>;
}
