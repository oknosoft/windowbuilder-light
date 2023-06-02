import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../../components/Metadata';
import {disablePermanent, drawerWidth} from '../../../../styles/muiTheme';
import Toolbar from '../ObjProductionToolbar';
import {preventDefault} from '../../../dataGrid';

import {useStyles, rowHeight, createGlasses, rowKeyGetter, handleAdd} from './data';


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
  const [selectedRows, setSelectedRows] = React.useState(new Set());

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

  async function selectedRowsChange(newRows) {
    let oldKey = selectedRows.size && Array.from(selectedRows)[0];
    if(oldKey > 1000) {
      oldKey -= 1000;
    }
    let newKey = Array.from(newRows)[0];
    if(newKey > 1000) {
      newKey -= 1000;
    }
    if(oldKey && oldKey !== newKey) {
      // ищем старую строку и пересчитываем изделие
      const row = rows.find(({key}) => key === oldKey);
      const {_editor: editor} = row;
      const {project} = editor;
      editor.unload();
      delete row._editor;
    }
    // создаём редактор для новой строки
    const row = rows.find(({key}) => key === newKey);
    const {characteristic} = row.row;
    const editor = new $p.EditorInvisible();
    const project = editor.create_scheme();
    await project.load(characteristic, true, characteristic.calc_order);
    row._editor = editor;

    setSelectedRows(newRows);
  }

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.key) {
      selectedRowsChange(new Set([row.key]));
    }
  };

  const onCellKeyDown = ({ mode, row, column, rowIdx, selectCell }, event) => {

    if (event.isDefaultPrevented() || row?.type === "DETAIL") {
      // skip parent grid keyboard navigation if nested grid handled it
      event.preventGridDefault();
    }

    if (mode === 'EDIT' || !rows.length || row?.type === "DETAIL"){
      return;
    }

    const { idx } = column;
    const { key, shiftKey } = event;
    if (key === 'ArrowDown') {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx});
        selectedRowsChange(new Set([rows[rowIdx + 1].key]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx: 0});
        selectedRowsChange(new Set([rows[rowIdx + 1].key]));
      }
      preventDefault(event);
    }
    else if (key === 'ArrowUp') {
      if(rowIdx > 0) {
        selectCell({rowIdx: rowIdx - 1, idx});
        selectedRowsChange(new Set([rows[rowIdx - 1].key]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
      if(rowIdx > 0) {
        selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
        selectedRowsChange(new Set([rows[rowIdx - 1].key]));
      }
      preventDefault(event);
    }

  };

  return <div style={style}>
    <Toolbar obj={obj} handleAdd={handleAdd} setRows={setRows}/>
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      onRowsChange={onRowsChange}
      headerRowHeight={33}
      rowHeight={rowHeight}
      className="fill-grid"
      enableVirtualization={false}
      onCellKeyDown={onCellKeyDown}
      onCellClick={onCellClick}
      selectedRows={selectedRows}
      onSelectedRowsChange={selectedRowsChange}
    />
  </div>;
}
