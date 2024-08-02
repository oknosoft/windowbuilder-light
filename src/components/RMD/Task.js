import React from 'react';
import DataGrid from 'react-data-grid';
import {Content} from '../App/styled';
import Loading from '../App/Loading';
import {useLoadingContext} from '../Metadata';
import Toolbar from './TaskToolbar';
import {renderCheckbox} from './Formatters';
import {schemas, initScheme, summary, rowKeyGetter} from './data';

export default function RMDTask() {

  const {handleIfaceState, ifaceState: {rmd}} = useLoadingContext();
  const [sortColumns, setSortColumns] = React.useState([]);
  const [ext, setExt] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const scheme = rmd?.scheme || schemas.find(({ref}) => ref === initScheme);

  const columns = React.useMemo(() => {
    const {tgt} = rmd;
    const {fields} = tgt._metadata('set');
    return scheme.rx_columns({mode: 'ts', fields, _mgr: tgt._manager, target: 'task'});
  }, []);

  if(!columns.length) {
    return <Loading />;
  }
  const rows = rmd?.tgtrows || [];
  const summaryRows = summary(rows, selectedRows);

  return <Content>
    <Toolbar rmd={rmd} scheme={scheme} selectedRows={selectedRows} setSelectedRows={setSelectedRows} handleIfaceState={handleIfaceState} ext={ext} setExt={setExt}/>
    {ext ? ext : <DataGrid
      columns={columns}
      rows={rows}
      topSummaryRows={[summaryRows.top]}
      bottomSummaryRows={[summaryRows.bottom]}
      rowKeyGetter={rowKeyGetter}
      //onRowsChange={setRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      //onCellClick={onCellClick}
      //onCellDoubleClick={open}
      //onCellKeyDown={onCellKeyDown}
      className="fill-grid"
      rowHeight={33}
      renderers={{ renderCheckbox }}
    />}
  </Content>;
}
