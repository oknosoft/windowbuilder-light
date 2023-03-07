import React from 'react';
import DataGrid from 'react-data-grid';
import {Content} from '../../../components/App/styled';
import ListToolbar from './ListToolbar';

const columns = [
  { key: 'id', name: 'ID', resizable: true },
  { key: 'title', name: 'Title', width: '*', resizable: true }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' },
  { id: 2, title: 'Demo' },
  { id: 3, title: 'Demo' },
  { id: 4, title: 'Demo' },
  { id: 5, title: 'Demo' },
  { id: 6, title: 'Demo' },
  { id: 7, title: 'Demo' },
  { id: 8, title: 'Demo' },
];

export default function CalcOrderList() {
  return <Content>
    <ListToolbar/>
    <DataGrid  columns={columns} rows={rows} className="fill-grid" rowHeight={34}/>
  </Content>;
}
