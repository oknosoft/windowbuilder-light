import React from 'react';
import {DataGrid} from 'react-data-grid';
import {Content} from '../App/styled';
import Loading from '../App/Loading';
import {useLoadingContext} from '../Metadata';
import Toolbar from './RemaindersToolbar';
import RemaindersQuickFilter from './RemaindersQuickFilter';
import SchemeSettingsTunes from '../../metadata/cat/scheme_settings/Tunes';
import {renderCheckbox} from './Formatters';
import {schemas, initScheme, dp, filter, summary, rowKeyGetter} from './data';
import {SelectColumn} from 'react-data-grid';
import Checkbox from '@mui/material/Checkbox';
import RemaindersGroupSelect from './RemaindersGroupSelect';

export default function RMDRemainders() {

  const {handleIfaceState, ifaceState: {rmd}} = useLoadingContext();
  const [columns, setColumns] = React.useState([]);
  const [tunes, rawSetTunes] = React.useState(false);
  const [groupSelectOpen, groupSelectSetOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const scheme = rmd?.scheme || schemas.find(({ref}) => ref === initScheme);

  const setTunes = (tunes) => {
    if(!tunes) {
      scheme.quickFilter = {};
      filter({rmd, scheme, handleIfaceState});
    }
    rawSetTunes(tunes);
  }
  const updateColumns = () => {
    const {fields} = dp._metadata('data');
    const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: dp._manager});
    const selectColumn = columns.find(({key}) => key === SelectColumn.key);
    if(selectColumn) {
      selectColumn.renderHeaderCell = function (arg) {
        return <Checkbox checked={false} onChange={() => groupSelectSetOpen(true)} />;
      }
    }
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

  const onCellKeyDown = ({ mode, row, column, rowIdx, selectCell }, event) => {

    if (event.isDefaultPrevented()) {
      // skip parent grid keyboard navigation
      event.preventGridDefault();
    }

    const {code, altKey, ctrlKey} = event;
    if (code === 'KeyF') {
      if(altKey || ctrlKey) {
        event.preventGridDefault();
        event.preventDefault();
      }
      if(ctrlKey) {
        setTunes(!tunes);
      }
      else if(altKey) {
        if(!scheme.quickFilter) {
          scheme.quickFilter = {};
        }
        if(scheme.quickFilter[column.key]) {
          delete scheme.quickFilter[column.key];
        }
        else {
          scheme.quickFilter[column.key] = row[column.key];
        }
        filter({rmd, scheme, handleIfaceState});
      }

    }
  };

  if(!columns.length) {
    return <Loading />;
  }
  const rows = rmd?.rows || [];
  const summaryRows = (tunes || dp.phase.is('plan')) ? null : summary(rows, selectedRows);
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
          topSummaryRows={summaryRows && [summaryRows.top]}
          bottomSummaryRows={summaryRows && [summaryRows.bottom]}
          rowKeyGetter={rowKeyGetter}
          //onRowsChange={setRows}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          //onCellClick={onCellClick}
          //onCellDoubleClick={open}
          onCellKeyDown={onCellKeyDown}
          className="fill-grid"
          rowHeight={33}
          renderers={{ renderCheckbox }}
        />
    }
    {groupSelectOpen ? <RemaindersGroupSelect
      groupSelectSetOpen={groupSelectSetOpen}
      setSelectedRows={setSelectedRows}
      rows={rows}
    /> : null}
  </Content>;
}
