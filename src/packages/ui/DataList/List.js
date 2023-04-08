import React from 'react';
import PropTypes from 'prop-types';
import DataGrid from 'react-data-grid';
import {useNavigate} from 'react-router-dom';
import {rowKeyGetter, cellClick, cellKeyDown} from '../../../metadata/dataGrid';
const minHeight = 220;

export default function List({rows, onDoubleClick, setCurrent, columns}) {

  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const navigate = useNavigate();

  const onCellClick = cellClick({selectedRows, setSelectedRows});
  const onCellKeyDown = cellKeyDown({rows, columns, onDoubleClick, setSelectedRows});

  return <DataGrid
    columns={columns}
    rows={rows}
    rowKeyGetter={rowKeyGetter}
    //onRowsChange={setRows}
    selectedRows={selectedRows}
    onSelectedRowsChange={setSelectedRows}
    onCellClick={onCellClick}
    onCellDoubleClick={onDoubleClick}
    onCellKeyDown={onCellKeyDown}
    className="fill-grid"
    rowHeight={33}
  />;
}
