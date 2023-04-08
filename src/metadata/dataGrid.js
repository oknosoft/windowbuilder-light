
export function rowKeyGetter(row) {
  return row.ref;
}

export function preventDefault(event) {
  event.preventGridDefault();
  event.preventDefault();
}

export function cellClick({selectedRows, setSelectedRows}) {
  return ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.ref) {
      setSelectedRows(new Set([row.ref]));
    }
  };
}

export function cellKeyDown({rows, columns, onDoubleClick, setSelectedRows}) {
  return ({ mode, row, column, rowIdx, selectCell }, event) => {
    if (mode === 'EDIT' || !rows.length) return;
    const { idx } = column;
    const { key, shiftKey } = event;

    if(key === 'Enter') {
      onDoubleClick({row, column, selectCell});
    }
    else if (key === 'ArrowDown') {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx});
        setSelectedRows(new Set([rows[rowIdx + 1].ref]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx: 0});
        setSelectedRows(new Set([rows[rowIdx + 1].ref]));
      }
      preventDefault(event);
    }
    else if (key === 'ArrowUp') {
      if(rowIdx > 0) {
        selectCell({rowIdx: rowIdx - 1, idx});
        setSelectedRows(new Set([rows[rowIdx - 1].ref]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
      if(rowIdx > 0) {
        selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
        setSelectedRows(new Set([rows[rowIdx - 1].ref]));
      }
      preventDefault(event);
    }
  };
}
