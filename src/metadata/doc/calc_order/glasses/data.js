import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import ObjGlassesDetail from './ObjGlassesDetail';

const {cat: {inserts: {ItemData}}, enm: {inserts_types}, dp: {buyers_order}, utils: {blank}}  = $p;
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

function fill_data(obj, items) {

  const dp = buyers_order.create();
  dp.calc_order = obj;
  const components = new Map();
  items.forEach(v => components.set(v, new ItemData(v, ObjGlassesDetail)));

  const {production, product_params} = dp;

  // фильтруем по пустой ведущей продукции
  dp._data._loading = true;
  for(const row of dp.calc_order.production) {
    const {characteristic} = row;
    const {origin} = characteristic;
    if(items.includes(origin.insert_type)) {
      // добавляем параметры
      const elm = production.count() + 1;
      characteristic.params.forEach(({region, inset, param, value}) => {
        product_params.add({elm, region, inset, param, value});
      });
      // добавляем строку продукции
      production.add({
        characteristic,
        inset: origin,
        clr: characteristic.clr,
        len: row.len,
        height: row.width,
        quantity: row.quantity,
        note: row.note,
      }, false);
    }
  }
  dp._data._loading = false;
  return dp;
}

export function createGlasses({obj, classes}){
  const glasses = [];
  const {composite, glass} = inserts_types;
  const items = [composite, glass, inserts_types.get()];
  const dp = fill_data(obj, items);
  for(const row of dp.production) {
    glasses.push({
      type: 'MASTER',
      expanded: false,
      row: row,
      key: row.row,
      inset: row.characteristic.origin,
      len: row.len,
      height: row.height,
    });
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
    {key: 'key', name: '№', width: 31,},
    {
      key: 'inset', name: 'Продукт', formatter({row}) {
        return row.inset.name;
      }
    },
    {key: 'len', name: 'Ширина', width: 88},
    {key: 'height', name: 'Высота', width: 88},
  ],
    glasses, dp,
  ];
}

export function handleAdd({dp, setRows}) {

}
