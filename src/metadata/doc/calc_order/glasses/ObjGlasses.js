import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../../components/Metadata';
import {disablePermanent, drawerWidth} from '../../../../styles/muiTheme';
import Toolbar from '../ObjProductionToolbar';

import {useStyles, createGlasses, rowKeyGetter, handleAdd} from './data';

const onCellKeyDown = (_, event) => {
  if (event.isDefaultPrevented()) {
    // skip parent grid keyboard navigation if nested grid handled it
    event.preventGridDefault();
  }
};

export default function ObjGlasses({tabRef, obj}) {
  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 420, width: window.innerWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }

  const classes = useStyles();

  const [columns, glasses] = React.useMemo(
    () => createGlasses({obj, classes}), []);
  const [rows, setRows] = React.useState(glasses);
  //const [cx, setCx] = React.useState(null);

  function onRowsChange(rows, { indexes }) {
    const row = rows[indexes[0]];
    if (row.type === 'MASTER') {
      if (!row.expanded) {
        rows.splice(indexes[0] + 1, 1);
      }
      else {
        rows.splice(indexes[0] + 1, 0, {
          type: 'DETAIL',
          key: row.key + 1000,
          row: row.row,
        });
        // сворачиваем другие открытые
        const rm = [];
        for(const tmp of rows) {
          if(tmp.expanded && tmp !== row) {
            tmp.expanded = false;
          }
          else if(tmp.type === 'DETAIL' && tmp.row !== row.row) {
            rm.push(tmp);
          }
        }
        for(const tmp of rm) {
          rows.splice(rows.indexOf(tmp), 1);
        }
      }
      setRows(rows);
    }
  }

  function onSelectedRowsChange(selectedRows) {

  }

  return <div style={style}>
    <Toolbar obj={obj} handleAdd={handleAdd} setRows={setRows}/>
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      onRowsChange={onRowsChange}
      headerRowHeight={33}
      rowHeight={({row, type}) => {
        if(type === 'ROW' && row.type === 'DETAIL') {
          let {length} = row.row.inset.used_params();
          if(length < 4) {
            length = 4;
          }
          return length * 33 + 16;
        }
        return 33;
      }}
      className="fill-grid"
      enableVirtualization={false}
      onCellKeyDown={onCellKeyDown}
    />
  </div>;
}
