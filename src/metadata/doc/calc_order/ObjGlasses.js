import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../components/Metadata';
import {disablePermanent, drawerWidth} from '../../../styles/muiTheme';
import ObjProductionToolbar from './ObjProductionToolbar';
import ObjGlassesDetail from './ObjGlassesDetail';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(({spacing}) => ({
  padding: {
    padding: spacing(),
    lineHeight: 'initial',
    outline: 'none',
  },
}));

function createGlasses(){
  const glasses = [];
  for (let i = 1; i < 6; i++) {
    glasses.push({
      type: 'MASTER',
      expanded: false,
      row: i,
      inset: 'Стекло',
      x: (1000 * (Math.random() + 0.4)).round(),
      y: (900 * (Math.random() + 0.2)).round(),
    });
  }
  return glasses;
}

function rowKeyGetter(row) {
  return row.row;
}

export default function ObjGlasses({tabRef, obj}) {
  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 420, width: window.offsetWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }

  const classes = useStyles();

  const columns = React.useMemo(() => {
    return [
      {
        key: 'expanded',
        name: '',
        minWidth: 28,
        width: 28,
        colSpan(args) {
          return args.type === 'ROW' && args.row.type === 'DETAIL' ? 5 : undefined;
        },
        cellClass(row) {
          return row.type === 'DETAIL' ? classes.padding : undefined;
        },
        formatter: ObjGlassesDetail,
      },
      { key: 'row', name: '№', width: 31, },
      { key: 'inset', name: 'Продукт' },
      { key: 'x', name: 'Ширина', width: 88},
      { key: 'y', name: 'Высота', width: 88},
    ];
  }, []);
  const [rows, setRows] = React.useState(createGlasses);

  function onRowsChange(rows, { indexes }) {
    const row = rows[indexes[0]];
    if (row.type === 'MASTER') {
      if (!row.expanded) {
        rows.splice(indexes[0] + 1, 1);
      } else {
        rows.splice(indexes[0] + 1, 0, {
          type: 'DETAIL',
          row: row.row + 1000,
          parentId: row.row
        });
      }
      setRows(rows);
    }
  }

  return <div style={style}>
    <ObjProductionToolbar obj={obj}/>
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
