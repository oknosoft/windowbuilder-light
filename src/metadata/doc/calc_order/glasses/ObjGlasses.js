import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../../components/Metadata';
import {disablePermanent, drawerWidth} from '../../../../styles/muiTheme';
import ObjProductionToolbar from '../ObjProductionToolbar';

import {useStyles, createGlasses, rowKeyGetter, handleAdd} from './data';


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
          parentId: row.key
        });
        // сворачиваем другие открытые
        const rm = [];
        for(const tmp of rows) {
          if(tmp.expanded && tmp !== row) {
            tmp.expanded = false;
          }
          else if(tmp.type === 'DETAIL' && tmp.parentId !== row.key) {
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

  return <div style={style}>
    <ObjProductionToolbar obj={obj} handleAdd={handleAdd} setRows={setRows}/>
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      onRowsChange={onRowsChange}
      headerRowHeight={33}
      rowHeight={(args) => (args.type === 'ROW' && args.row.type === 'DETAIL' ? 200 : 33)}
      className="fill-grid"
      enableVirtualization={false}
      onCellKeyDown={(_, event) => {
        if (event.isDefaultPrevented()) {
          // skip parent grid keyboard navigation if nested grid handled it
          event.preventGridDefault();
        }
      }}
    />
  </div>;
}
