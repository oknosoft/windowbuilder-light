import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import ObjGlassesDetail from './ObjGlassesDetail';

export const useStyles = makeStyles(({spacing}) => ({
  padding: {
    padding: spacing(),
    lineHeight: 'initial',
    outline: 'none',
  },
}));

export function rowKeyGetter(row) {
  return row.key;
}

export function createGlasses({obj, classes}){
  const glasses = [];
  for(const row of obj.production) {
    if(row.characteristic.origin.insert_type.is('glass') || row.characteristic.origin.insert_type.empty()) {
      glasses.push({
        type: 'MASTER',
        expanded: false,
        row: row,
        key: row.row,
        inset: row.characteristic.origin,
        x: row.characteristic.x,
        y: row.characteristic.y,
      });
    }
  }
  return [[
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
    { key: 'key', name: '№', width: 31, },
    { key: 'inset', name: 'Продукт', formatter() {return '?';} },
    { key: 'x', name: 'Ширина', width: 88},
    { key: 'y', name: 'Высота', width: 88},
  ],
    glasses,
  ];
}
