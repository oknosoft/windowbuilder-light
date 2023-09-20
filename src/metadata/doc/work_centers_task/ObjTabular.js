import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../components/Metadata';
import ToolbarTabular from './ToolbarTabular';
import {cellKeyDown, tabularCreate, tabularStyle} from '../../dataGrid';

export default function ObjPlan({tabRef, tabular, columns}) {

  const style = tabularStyle(tabRef, useLoadingContext());

  const [rows, setRows] = React.useState(Array.from(tabular));
  const [selectedRows, setSelectedRows] = React.useState(new Set());

  const {getRow, create, clone, remove} = tabularCreate({tabular, setRows, selectedRows, setSelectedRows});

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.row) {
      setSelectedRows(new Set([row.row]));
    }
  };

  const onCellKeyDown = cellKeyDown({rows, columns, create, clone, remove, setSelectedRows, keyField: 'row'});

  return <div style={style}>
    <ToolbarTabular create={create} clone={clone} remove={remove}/>
    <DataGrid
      rowKeyGetter={(row) => row.row}
      columns={columns}
      rows={rows}
      onRowsChange={setRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onCellClick={onCellClick}
      onCellKeyDown={onCellKeyDown}
      className="fill-grid"
      rowHeight={33}
    />
  </div>;
}
