import React from 'react';
import DataGrid from 'react-data-grid';
import {Content} from '../App/styled';
import Loading from '../App/Loading';
import {useLoadingContext} from '../Metadata';
import Toolbar from './RemaindersToolbar';

import {schemas, initScheme, dp} from './data';

export default function RMDRemainders() {

  const {handleIfaceState, ifaceState: {rmd}} = useLoadingContext();
  const [columns, setColumns] = React.useState([]);
  const scheme = rmd?.scheme || schemas.find(({ref}) => ref === initScheme);

  React.useEffect(() => {
    const {fields} = dp._metadata('data');
    const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: dp._manager});
    setColumns(columns);
    //handleIfaceState({rmd: Object.assign({}, rmd, {columns})});

  }, [rmd]);

  if(!columns.length) {
    return <Loading />;
  }
  const rows = rmd?.rows || [];
  function rowKeyGetter (row) {
    return rows.indexOf(row);
  }
  return <Content>
    <Toolbar scheme={scheme}/>
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
