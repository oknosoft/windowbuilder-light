
import {disablePermanent, drawerWidth} from '../styles/muiTheme';

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

export function mgrCreate({mgr, navigate, selectedRows, backdrop}) {

  const create = () => {
    backdrop
      .setBackdrop(true)
      .then(() => mgr.create())
      .then(({ref}) => navigate(ref));
  };

  const clone = () => {
    if(selectedRows.size) {
      backdrop
        .setBackdrop(true)
        .then(async () => {
          const proto = mgr.get(Array.from(selectedRows)[0]);
          if(proto.is_new()) {
            await proto.load();
          }
          return proto;
        })
        .then((proto) => mgr.clone(proto.toJSON()))
        .then(({ref}) => navigate(ref));
    }
    else {
      //dialogs.alert({title: 'Форма объекта', text: 'Не указана текущая строка'});
    }
  };

  const open = () => {
    if(selectedRows.size) {
      backdrop
        .setBackdrop(true)
        .then(() => navigate(Array.from(selectedRows)[0], {relative: 'path'}));
    }
    else {
      //dialogs.alert({title: 'Форма объекта', text: 'Не указана текущая строка'});
    }
  };

  return [create, clone, open];
}

export function tabularCreate({tabular, setRows, selectedRows, setSelectedRows}) {

  const getRow = () => {
    const selectedKey = selectedRows.size && Array.from(selectedRows)[0];
    if(selectedKey) {
      return tabular.get(selectedKey-1);
    }
  };

  const add = (proto) => {
    const selected = new Set();
    const row = tabular.add(proto).row;
    selected.add(row);
    setRows(Array.from(tabular));
    setSelectedRows(selected);
    return row;
  };

  const create = () => add();

  const clone = () => add(getRow?.());

  const clear = () => {
    tabular.clear();
    setSelectedRows(new Set());
    setRows(Array.from(tabular));
  };

  const remove = () => {
    const row = getRow();
    if(row) {
      tabular.del(row);
      setSelectedRows(new Set());
      setRows(Array.from(tabular));
    }
  };

  return {getRow, create, clone, remove, clear};
}

export function cellKeyDown({rows, columns, create, clone, open, remove, keyField = 'ref', setSelectedRows}) {
  return ({ mode, row, column, rowIdx, selectCell }, event) => {
    if (mode === 'EDIT' || !rows.length) return;
    const { idx } = column;
    const { key, shiftKey } = event;

    if(key === 'Enter') {
      open?.();
    }
    else if(key === 'Delete') {
      remove?.();
    }
    else if(key === 'Insert') {
      create();
    }
    else if(key === 'F9') {
      clone();
    }
    else if (key === 'ArrowDown') {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx});
        setSelectedRows(new Set([rows[rowIdx + 1][keyField]]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx: 0});
        setSelectedRows(new Set([rows[rowIdx + 1][keyField]]));
      }
      preventDefault(event);
    }
    else if (key === 'ArrowUp') {
      if(rowIdx > 0) {
        selectCell({rowIdx: rowIdx - 1, idx});
        setSelectedRows(new Set([rows[rowIdx - 1][keyField]]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
      if(rowIdx > 0) {
        selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
        setSelectedRows(new Set([rows[rowIdx - 1][keyField]]));
      }
      preventDefault(event);
    }
  };
}

export function isAtBottom({ currentTarget }) {
  return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
}

export function tabularStyle(tabRef, {ifaceState: {menu_open}}) {
  const style = {minHeight: 420, width: window.innerWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = window.innerHeight - top;
    if(style.height < style.minHeight) {
      style.minHeight = style.height;
    }
    //style.height = `calc(100vh - ${top}px)`;
  }
  return style;
}
