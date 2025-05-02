import React from 'react';
import {DataGrid} from 'react-data-grid';
import {useLoadingContext} from '../Metadata';
import {useBackdropContext} from '../App/backdropContext';
import {SelectedContext, useSelectedContext} from './selectedContext';
import {handlers} from './handlers';
import Toolbar from './Toolbar';

function rowKeyGetter(row) {
  return row.uid;
}

export function preventDefault(event) {
  event.preventGridDefault?.();
  event.preventDefault();
}


export default function TabularSection({tabRef, obj, ts, scheme, selection, columns}) {

  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 320, width: '100%'};
  if(tabRef?.current) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }
  if(!columns) {
    columns = scheme ? React.useMemo(() => scheme.columns, [scheme]) : null;
  }
  const ref = React.useRef(null);
  const {setBackdrop, setSnack} = useBackdropContext();
  const glob = useSelectedContext();
  const [rows, rawSetRows] = React.useState([]);
  const [selectedRows, rawSetSelectedRows] = React.useState(new Set());

  const setRows = (rows) => {
    if(glob.rows !== rows) {
      glob.rows = rows;
      rawSetRows(rows);
    }
  };

  const setSelectedRows = (rows) => {
    const skey = rows.size && Array.from(rows)[0];
    if(glob.skey !== skey) {
      glob.skey = skey;
      rawSetSelectedRows(rows);
    }
  };

  const getRow = () => {
    const key = Array.from(selectedRows)[0];
    return rows.find((row) => row.uid === key);
  }

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.uid) {
      setSelectedRows(new Set([row.uid]));
    }
  };

  const onCellKeyDown = ({ mode, row, column, rowIdx, selectCell }, event) => {

    if (event.isDefaultPrevented() || row?.type === "DETAIL") {
      // skip parent grid keyboard navigation if nested grid handled it
      event.preventGridDefault();
    }

    const { key, shiftKey } = event;
    if (key === 'Insert' || key === 'F9') {
      preventDefault(event);
      const proto = (key === 'F9' && getRow())?.toJSON?.();
      const {add} = handlers({tabular: obj[ts], selection, rows, setRows, setSelectedRows, gridRef: ref});
      return add(event, proto);
    }

    if (mode === 'EDIT' || !rows.length || row?.type === "DETAIL"){
      return;
    }

    const { idx } = column;
    if (key === 'ArrowDown') {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx});
        setSelectedRows(new Set([rows[rowIdx + 1].uid]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx: 0});
        setSelectedRows(new Set([rows[rowIdx + 1].uid]));
      }
      preventDefault(event);
    }
    else if (key === 'ArrowUp') {
      if(rowIdx > 0) {
        selectCell({rowIdx: rowIdx - 1, idx});
        setSelectedRows(new Set([rows[rowIdx - 1].uid]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
      if(rowIdx > 0) {
        selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
        setSelectedRows(new Set([rows[rowIdx - 1].uid]));
      }
      preventDefault(event);
    }
    else if (key === 'Delete') {
      preventDefault(event);
      const {delRow} = handlers({tabular: obj[ts], selection, rows, setRows, setSelectedRows, gridRef: ref});
      return delRow(getRow());
    }

  };

  React.useEffect(() => {
    const rows = scheme ? scheme.filter(obj[ts], selection) : $p.utils.find.rows(obj[ts], selection);
    setRows(rows);
  }, [selection]);

  return obj ? <div style={style}>
    <Toolbar
      tabular={obj[ts]}
      selection={selection}
      gridRef={ref}
      rows={rows}
      getRow={getRow}
      setRows={setRows}
      setBackdrop={setBackdrop}
      //setModified={setModified}
      setSelectedRows={setSelectedRows}
    />
    <SelectedContext.Provider value={glob}>
      <DataGrid
        ref={ref}
        rowKeyGetter={rowKeyGetter}
        columns={columns}
        rows={rows}
        //onRowsChange={onRowsChange}
        //headerRowHeight={33}
        //rowHeight={rowHeight}
        className="fill-grid"
        enableVirtualization={false}
        onCellKeyDown={onCellKeyDown}
        onCellClick={onCellClick}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
    </SelectedContext.Provider>
  </div> : null;

}
