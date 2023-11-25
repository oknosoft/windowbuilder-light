import React from 'react';
import DataGrid from 'react-data-grid';
import {SelectedContext} from './selectedContext';
import {PresentationFormatter} from '../../../../packages/ui/DataField/RefField';

import {rowKeyGetter} from './data';
let selectedContext = {};

const columns = [
  {key: "inset", name: "Вставка", width: '*', renderCell: PresentationFormatter},
];

export default function CompositeGrid({elm}) {

  const {ox} = elm;
  const rows = [];
  ox.glass_specification.find_rows({elm: elm.elm}, (row) => {
    rows.push(row);
  });

  return <DataGrid
    rowKeyGetter={rowKeyGetter}
    columns={columns}
    rows={rows}
    className="fill-grid"
  />;
}
