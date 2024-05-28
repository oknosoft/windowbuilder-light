import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../components/Metadata';
import {disablePermanent, drawerWidth} from '../../../styles/muiTheme';
import RefCell from '../../../packages/ui/DataField/RefCell';
import {NumberCell, NumberFormatter} from '../../../packages/ui/DataField/Number';
import {TextCell} from 'metadata-ui/DataField/Text';
import ObjNomToolbar from './ObjNomToolbar';
import {SelectedContext} from './selectedContext';

const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}} = $p;
const scheme = scheme_settings
  .find_schemas('doc.calc_order.production', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = calc_order.metadata('production');
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: calc_order});
for(const column of columns) {
  switch (column.key) {
    case 'nom':
    case 'characteristic':
      column.renderEditCell = RefCell;
      break;
    case 'note':
      column.renderEditCell = TextCell;
      break;
    case 'quantity':
    case 'price_internal':
    case 'price':
    case 'discount_percent_internal':
    case 'discount_percent':
    case 'amount_internal':
    case 'amount':
      column.renderCell = NumberFormatter;
      column.renderEditCell = NumberCell;
      break;
  }
}
const getRows = (obj) => {
  const rows = [];
  for(const row of obj.production) {
    if(row.characteristic.empty() || row.characteristic.calc_order.empty()) {
      rows.push(row);
    }
  }
  return rows;
};
let selectedContext = {};

export default function ObjNom({tabRef, obj, setModified}) {
  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 420, width: window.innerWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }
  const rows = getRows(obj);

  const [selectedRows, rawSetSelectedRows] = React.useState(new Set());
  const glob = React.useMemo(() => ({skey: 0, rows}), [obj]);

  const setSelectedRows = (rows) => {
    const skey = rows.size && Array.from(rows)[0];
    if(!rows.size || glob.skey !== skey) {
      glob.skey = skey;
      selectedContext = {...glob};
      rawSetSelectedRows(rows);
    }
  };

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.row) {
      setSelectedRows(new Set([row.row]));
    }
  };

  const onCellKeyDown = ({ mode, row, column, rowIdx, selectCell }, event) => {

    if (event.isDefaultPrevented() || row?.type === "DETAIL") {
      // skip parent grid keyboard navigation if nested grid handled it
      event.preventGridDefault();
    }

    const { key, shiftKey } = event;
    if (key === 'Insert' || key === 'F9') {
      const row = key === 'F9' && getRow();
      const {add} = handlers({
        obj,
        rows,
        setRows,
        getRow,
        setBackdrop,
        setModified,
        selectedRowsChange});
      preventDefault(event);
      return add(row?.row?.characteristic);
    }

    if (mode === 'EDIT' || !rows.length || row?.type === "DETAIL"){
      return;
    }

    const { idx } = column;
    if (key === 'ArrowDown') {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx});
        selectedRowsChange(new Set([rows[rowIdx + 1].row]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx: 0});
        selectedRowsChange(new Set([rows[rowIdx + 1].row]));
      }
      preventDefault(event);
    }
    else if (key === 'ArrowUp') {
      if(rowIdx > 0) {
        selectCell({rowIdx: rowIdx - 1, idx});
        selectedRowsChange(new Set([rows[rowIdx - 1].row]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
      if(rowIdx > 0) {
        selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
        selectedRowsChange(new Set([rows[rowIdx - 1].row]));
      }
      preventDefault(event);
    }
    else if (key === 'Delete') {
      preventDefault(event);
      const {del} = handlers({
        obj,
        rows,
        setRows,
        getRow,
        setBackdrop,
        setModified,
        selectedRowsChange});
      return del();
    }

  };

  const getRow = () => {
    const selectedKey = selectedRows.size && Array.from(selectedRows)[0];
    if(selectedKey) {
      return rows.find(({row}) => row === selectedKey);
    }
  };

  return <div style={style}>
    <ObjNomToolbar obj={obj} rows={rows} setModified={setModified} getRow={getRow} setSelectedRows={setSelectedRows}/>
    <SelectedContext.Provider value={selectedContext}>
      <DataGrid
        rowKeyGetter={row => row.row}
        columns={columns}
        rows={rows}
        className="fill-grid"
        rowHeight={33}
        onCellKeyDown={onCellKeyDown}
        onCellClick={onCellClick}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
    </SelectedContext.Provider>
  </div>;

  // <DataGrid onRowsChange={onRowsChange} />
}
