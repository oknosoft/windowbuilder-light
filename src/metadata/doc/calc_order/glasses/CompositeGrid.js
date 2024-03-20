import React from 'react';
import DataGrid from 'react-data-grid';
import RegionInset from './RegionInset';
import Toolbar from './CompositeToolbar';
import {PresentationFormatter} from '../../../../packages/ui/DataField/RefField';
import {cellKeyDown} from '../../../dataGrid';

function rowKeyGetter(row) {
  return row.row;
}

const columns = [
  {
    key: "inset",
    name: "Вставка",
    //width: '*',
    renderCell: PresentationFormatter,
    renderEditCell: RegionInset,
  },
];

const stub = () => null;

export default function CompositeGrid({elm, rows, glRow, elmRow, selectedRows, setSelectedRows}) {



  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.row) {
      setSelectedRows(new Set([row.row]));
    }
  };

  const onCellKeyDown = cellKeyDown({rows, columns, create: stub, clone: stub, remove: stub, setSelectedRows, keyField: 'row'});


  return <>
    <Toolbar elm={elm} glRow={glRow} elmRow={elmRow} setSelectedRows={setSelectedRows} />
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onCellClick={onCellClick}
      onCellKeyDown={onCellKeyDown}
      className="fill-grid"
      headerRowHeight={0}
    />
  </>;
}
