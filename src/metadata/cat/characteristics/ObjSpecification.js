import React from 'react';
import {NumberFormatter} from 'metadata-ui/DataField/Number';
import {PresentationFormatter} from 'metadata-ui/DataField/RefField';
import {TextFormatter} from 'metadata-ui/DataField/Text';
import ObjTabular from '../../aggregate/ObjTabular';

const columns = [
  {key: "nom", width: 240, name: "Номенклатура", tooltip: "", renderCell: PresentationFormatter},
  {key: "characteristic", width: 240, name: "Характеристика", tooltip: "", renderCell: PresentationFormatter},
  {key: "len", width: 90, name: "Длина", tooltip: "длина в м", renderCell: NumberFormatter},
  {key: "width", width: 90, name: "Высота", tooltip: "ширина в м", renderCell: NumberFormatter},
  {key: "qty", width: 90, name: "Штук", renderCell: NumberFormatter},
  {key: "totqty", width: 100, name: "Колич", renderCell: NumberFormatter},
  {key: "totqty1", width: 100, name: "Колич+%", renderCell: NumberFormatter},
  {key: "price", width: 100, name: "Цена себест", renderCell: NumberFormatter},
  {key: "amount", width: 100, name: "Сумма себест", renderCell: NumberFormatter},
];

export default function ObjSpecification({tabRef, obj}) {
  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.specification}
    columns={columns}
  />;
}
