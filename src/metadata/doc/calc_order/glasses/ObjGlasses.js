import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../../components/Metadata';
import {useBackdropContext} from '../../../../components/App';
import {disablePermanent, drawerWidth} from '../../../../styles/muiTheme';
import Toolbar from '../ObjProductionToolbar';
import {SelectedContext} from './selectedContext';
import {preventDefault} from '../../../dataGrid';

import {rowHeight, createGlasses, rowKeyGetter, handleAdd, recalcRow} from './data';
let selectedContext = {};

export default function ObjGlasses({tabRef, obj, setModified}) {
  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 420, width: window.innerWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }
  const {setBackdrop, setSnack} = useBackdropContext();


  const [columns, glasses, glob] = React.useMemo(() => createGlasses({obj}), [obj]);
  const [rows, rawSetRows] = React.useState(glasses);
  const [selectedRows, rawSetSelectedRows] = React.useState(new Set());

  glob.rows = rows;
  const setRows = (rows) => {
    if(glob.rows !== rows) {
      glob.rows = rows;
      selectedContext = {...glob};
      rawSetRows(rows);
    }
  };

  const setSelectedRows = (rows) => {
    const skey = rows.size && Array.from(rows)[0];
    if(glob.skey !== skey) {
      glob.skey = skey;
      selectedContext = {...glob};
      rawSetSelectedRows(rows);
    }
  };

  React.useEffect(() => {

    async function before_save(curr) {
      if(curr === obj) {
        if(glob.skey) {
          const row = glob.rows.find(({key}) => key === glob.skey);
          const {characteristic} = row.row;
          if(characteristic._modified) {
            const {project} = row.row.editor;
            project.redraw();
            await project.save_coordinates();
          }
        }
      }
      return curr;
    }

    $p.doc.calc_order.on({before_save});
    return () => $p.doc.calc_order.off({before_save});
  }, [obj]);

  function onRowsChange(rows, {column, indexes }) {
    if(column.key === 'expanded') {
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
  }

  async function selectedRowsChange(newRows, noSave) {
    let oldKey = selectedRows.size && Array.from(selectedRows)[0];
    if(oldKey > 1000) {
      oldKey -= 1000;
    }
    let newKey = Array.from(newRows)[0];
    if(newKey > 1000) {
      newKey -= 1000;
    }
    if(oldKey && oldKey !== newKey) {
      // ищем старую строку
      const row = glob.rows.find(({key}) => key === oldKey);
      // пересчитываем изделие
      await recalcRow({row, setBackdrop, setModified, noSave});
      // TODO
      // выгружаем редактор
      row.row.unloadEditor();
    }
    // создаём редактор для новой строки
    const row = glob.rows.find(({key}) => key === newKey);
    if(!row.row.editor) {
      await row.row.createEditor();
    }

    setSelectedRows(newRows);
    !noSave && setBackdrop(false);
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

    const { key, shiftKey } = event;
    if (key === 'Insert' || key === 'F9') {
      const row = key === 'F9' && getRow();
      handleAdd({
        obj,
        proto: row?.row?.characteristic,
        rows,
        setRows,
        setBackdrop,
        setModified,
        selectedRowsChange});
      return preventDefault(event);
    }

    if (mode === 'EDIT' || !rows.length || row?.type === "DETAIL"){
      return;
    }

    const { idx } = column;
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
    else if (key === 'Delete') {
      preventDefault(event);
      return handleDel();
    }

  };

  const getRow = () => {
    const selectedKey = selectedRows.size && Array.from(selectedRows)[0];
    if(selectedKey) {
      return rows.find(({key}) => key === selectedKey);
    }
  };

  const handleDel = () => {
    const row = getRow();
    if(row) {
      setSelectedRows(new Set());
      row.row.unloadEditor();
      obj.production.del(row.row.calc_order_row);
      rows.splice(rows.indexOf(row), 1);
      rows.some((srow, index) => {
        if(srow.row === row.row) {
          rows.splice(index, 1);
          return true;
        }
      });
      for(const tmp of rows) {
        tmp.key = tmp.row.row;
      }
      setRows([...rows]);
    }
    else {
      setSnack('Укажите строку табчасти для удаления');
    }
  };

  const handleOpen = () => {

  };

  return <div style={style}>
    <Toolbar
      obj={obj}
      rows={rows}
      handleAdd={handleAdd}
      handleDel={handleDel}
      getRow={getRow}
      setRows={setRows}
      setBackdrop={setBackdrop}
      setModified={setModified}
      selectedRowsChange={selectedRowsChange}
    />
    <SelectedContext.Provider value={selectedContext}>
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
    </SelectedContext.Provider>
  </div>;
}
