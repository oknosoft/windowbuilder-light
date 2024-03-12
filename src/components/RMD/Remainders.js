import React from 'react';
import DataGrid from 'react-data-grid';
import {Content} from '../../../components/App/styled';
import {useBackdropContext} from '../App';
import Toolbar from './RemaindersToolbar';

export default function RMDRemainders() {
  return <Content>
    <Toolbar />
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      //onRowsChange={setRows}
      //selectedRows={selectedRows}
      //onSelectedRowsChange={setSelectedRows}
      //onCellClick={onCellClick}
      //onCellDoubleClick={open}
      //onCellKeyDown={onCellKeyDown}
      className="fill-grid"
      rowHeight={33}
    />
  </Content>;
}
