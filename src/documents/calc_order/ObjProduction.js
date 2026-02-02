import React from 'react';
import {DataGrid} from 'react-data-grid';
import {useLoadingContext} from '../../aggregate/Metadata';
import {disablePermanent, drawerWidth} from '../../styles/muiTheme';
import ObjProductionToolbar from './ObjProductionToolbar';
import {SelectedContext} from './selectedContext';
let selectedContext = {};

const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}, job_prm: {builder: {glasses_template}}} = $p;
const scheme = scheme_settings
  .find_schemas('doc.calc_order.production', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = calc_order.metadata('production');
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: calc_order});

function rowKeyGetter(row) {
  return row.row;
}

export default function ObjProduction({tabRef, obj, setModified, variant}) {
  const {ifaceState: {menu_open, innerWidth}} = useLoadingContext();
  const style = {minHeight: 420, width: innerWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }
  const rows = React.useMemo(() => {
    const rows = [];
    for(const row of obj.production) {
      if(variant === 'all' || (row.characteristic.calc_order === obj && row.characteristic.base_block !== glasses_template)) {
        rows.push(row);
      }
    }
    selectedContext.rows = rows;
    selectedContext.skey = null;
    return rows;
  }, [variant]);
  const [selectedRows, rawSetSelectedRows] = React.useState(new Set());

  const setSelectedRows = (srows) => {
    const skey = srows.size && Array.from(srows)[0];
    if(selectedContext.skey !== skey) {
      selectedContext = {rows, skey, setModified};
      rawSetSelectedRows(srows);
    }
  };

  const getRow = () => {
    const selectedKey = selectedRows.size && Array.from(selectedRows)[0];
    if(selectedKey) {
      const row = rows.find(({row}) => row === selectedKey);
      return row ? {row} : null;
    }
  };

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.row) {
      setSelectedRows(new Set([row.row]));
    }
  };

  return <div style={style}>
    <ObjProductionToolbar obj={obj} variant={variant} getRow={getRow}/>
    <SelectedContext.Provider value={selectedContext}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowKeyGetter={rowKeyGetter}
        className="fill-grid"
        rowHeight={33}
        onCellClick={onCellClick}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
    </SelectedContext.Provider>
  </div>;
}
