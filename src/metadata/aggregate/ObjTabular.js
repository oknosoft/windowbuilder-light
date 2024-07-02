import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../components/Metadata';
import ToolbarTabular from './ToolbarTabular';
import {cellKeyDown, tabularCreate, tabularStyle} from '../dataGrid';

export default function ObjTabular({tabRef, tabular, selection, columns, buttons, rootStyle, selectedRowsChange}) {

  if(!rootStyle) {
    rootStyle = tabularStyle(tabRef, useLoadingContext());
  }

  const find_rows = selection ? () => {
    const res = [];
    tabular.find_rows(selection, (row) => {
      res.push(row);
    });
    return res;
  } : () => Array.from(tabular);

  const [rows, setRows] = React.useState(find_rows());
  const [selectedRows, rawSetSelectedRows] = React.useState(new Set());
  const setSelectedRows = (selectedRows) => {
    rawSetSelectedRows(selectedRows);
    selectedRowsChange?.(selectedRows);
  };

  React.useEffect(() => {
    const update = () => {
      setRows(find_rows());
      setSelectedRows(new Set());
    };
    tabular._owner._manager.on('rows', update);
    return () => tabular._owner._manager.off('rows', update);
  }, [tabular]);

  const {getRow, create, clone, remove, clear} = tabularCreate({tabular, selection, find_rows, setRows, selectedRows, setSelectedRows});

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.row) {
      setSelectedRows(new Set([row.row]));
    }
  };

  const onCellKeyDown = cellKeyDown({rows, columns, create, clone, remove, setSelectedRows, keyField: 'row'});

  return <div style={rootStyle}>
    <ToolbarTabular clear={clear} create={create} clone={clone} remove={remove} buttons={buttons}/>
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
