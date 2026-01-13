import React from 'react';
import {DataGrid} from 'react-data-grid';
import {Row as BaseRow, SelectColumn} from 'react-data-grid';
import {NumberFormatter} from 'metadata-ui/DataField/Number';

function RegisterFormatter({row, column}) {
  const register = row[column.key];
  const meta = register.type && $p.md.get(register.type);
  return `${meta ? (meta.obj_presentation || meta.synonym) + ' ' : ''}${register.number_doc || '-'} от ${register.date}`;
}

function rowKeyGetter(row) {
  return row.key;
}

const columns = [
  {key: "register", minWidth: 360, name: "Документ", tooltip: "", renderCell: RegisterFormatter},
  {key: "trans", width: 220, name: "Заказ", renderCell: RegisterFormatter},
  {key: "opening", width: 110, name: "Нач. остаток", renderCell: NumberFormatter},
  {key: "shipped", width: 100, name: "Отгружено", renderCell: NumberFormatter},
  {key: "paid", width: 100, name: "Оплачено", renderCell: NumberFormatter},
  {key: "final", width: 110, name: "Кон. остаток", renderCell: NumberFormatter},
];


export default function SettlementsGrid({rows}) {
  return <DataGrid
    columns={columns}
    rows={rows}
    rowKeyGetter={rowKeyGetter}
  />
}
