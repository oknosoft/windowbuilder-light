import React from 'react';
import DataGrid from 'react-data-grid';
import {Content} from '../App/styled';
import Loading from '../App/Loading';
import {useLoadingContext} from '../Metadata';
import Toolbar from './RemaindersToolbar';
import RemaindersQuickFilter from './RemaindersQuickFilter';
import SchemeSettingsTunes from '../../metadata/cat/scheme_settings/Tunes';
import {renderCheckbox} from './Formatters';
import {schemas, initScheme, dp} from './data';

export default function RMDRemainders() {

  const {handleIfaceState, ifaceState: {rmd}} = useLoadingContext();
  const [columns, setColumns] = React.useState([]);
  const [tunes, setTunes] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const scheme = rmd?.scheme || schemas.find(({ref}) => ref === initScheme);

  const updateColumns = () => {
    const {fields} = dp._metadata('data');
    const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: dp._manager});
    setColumns(columns);
  };

  React.useEffect(updateColumns, [rmd]);

  React.useEffect(() => {
    if(scheme) {
      const update = $p.utils.debounce((obj, flds) => {
        if(obj._owner?._owner === scheme && 'use' in flds) {
          updateColumns();
        }
      });
      scheme._manager.on({update});
      return () => scheme._manager.off({update});
    }
  }, [scheme]);

  if(!columns.length) {
    return <Loading />;
  }
  const rows = rmd?.rows || [];
  function rowKeyGetter (row) {
    return rows.indexOf(row);
  }
  return <Content>
    <Toolbar
      rmd={rmd}
      scheme={scheme}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      handleIfaceState={handleIfaceState}
      tunes={tunes}
      setTunes={setTunes}
    />
    {
      tunes ?
        <SchemeSettingsTunes
          obj={scheme}
          tabs={{params: RemaindersQuickFilter}}
        />
        :
        <DataGrid
          columns={columns}
          rows={rows}
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
        />
    }
  </Content>;
}
