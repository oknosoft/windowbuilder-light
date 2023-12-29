import React from 'react';
import DataGrid from 'react-data-grid';
import {SelectedContext} from './selectedContext';
import {PresentationFormatter} from '../../../../packages/ui/DataField/RefField';
import {cellKeyDown} from '../../../dataGrid';
import {rowKeyGetter} from './data';
let selectedContext = {};

const columns = [
  {key: "inset", name: "Вставка", width: '*', renderCell: PresentationFormatter},
];

const stub = () => null;

export default function CompositeGrid({elm, selectedRows, setSelectedRows}) {

  const {ox} = elm;
  const rows = [];
  ox.glass_specification.find_rows({elm: elm.elm}, (row) => {
    rows.push(row);
  });



  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.row) {
      setSelectedRows(new Set([row.row]));
    }
  };

  const onCellKeyDown = cellKeyDown({rows, columns, create: stub, clone: stub, remove: stub, setSelectedRows, keyField: 'row'});


  return <DataGrid
    rowKeyGetter={rowKeyGetter}
    columns={columns}
    rows={rows}
    selectedRows={selectedRows}
    onSelectedRowsChange={setSelectedRows}
    onCellClick={onCellClick}
    onCellKeyDown={onCellKeyDown}
    className="fill-grid"
  />;
}
