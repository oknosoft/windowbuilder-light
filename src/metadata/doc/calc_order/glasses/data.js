import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ObjGlassesDetail from './ObjGlassesDetail';

import {NumberCell, NumberFormatter} from '../../../../packages/ui/DataField/Number';

const {cat: {inserts}, enm: {inserts_types}, dp: {buyers_order}, utils: {blank}}  = $p;
const {ItemData} = inserts;
const ioptions = [];
inserts.find_rows({insert_type: inserts_types.glass, available: true}, (o) => {
  ioptions.push(o);
});

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
  const items = [composite, glass];
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
      key: 'inset',
      name: 'Продукт',
      formatter({row}) {
        return row.row.inset.name;
      },
      editor(props) {
        const {row, onRowChange} = props;
        return <select
          autoFocus
          className="rdg-text-editor tlmcuo07-0-0-beta-29"
          value={row.row.inset}
          onChange={({target}) => {
            row.row.inset = target.value;
            onRowChange({ ...row}, true);
          }}
        >
          {ioptions.map((inset) => (
            <option key={inset.ref} value={inset}>{inset.name}</option>
          ))}
        </select>;
      }
    },
    {key: 'len', name: 'Ширина', width: 88, editor: NumberCell, formatter: NumberFormatter},
    {key: 'height', name: 'Высота', width: 88, editor: NumberCell, formatter: NumberFormatter},
  ],
    glasses, dp,
  ];
}

function defaultValue(inset, param) {
  const drow = inset.product_params.find({param});
  let value;
  if(drow) {
    value = drow.value;
    if((value?.empty?.() || !value?.empty) && drow.list.length) {
      try{
        value = JSON.parse(drow.list)[0];
      }
      catch (e) {}
    }
  }
  return param.fetch_type(value);
}

export function handleAdd({dp, setRows}) {
  const {production, product_params} = dp;
  const inset = inserts.find({insert_type: inserts_types.glass, available: true, priority: 10});
  const row = dp.production.add({inset});
  const params = inset.used_params();
  let rib;
  for(const rrow of inset.inserts) {
    if(rrow.by_default && rrow.inset.insert_glass_type.is('Ребро')) {
      rib = rrow.inset;
      break;
    }
  }
  // параметры вставки
  for(const param of params) {
    if(param.is_calculated) {
      continue;
    }
    product_params.add({elm: row.row, inset, param, value: defaultValue(inset, param)});
  }
  // параметры рёбер
  if(rib) {
    const params = rib.used_params();
    for(let i=1; i<5; i++) {
      for(const param of params) {
        if(param.is_calculated) {
          continue;
        }
        product_params.add({elm: row.row, region: 10 + i, inset: rib, param, value: defaultValue(rib, param)});
      }
    }
  }
  setRows((rows) => [...rows, {
    type: 'MASTER',
    expanded: false,
    row: row,
    key: row.row,
    len: 0,
    height: 0,
  }]);
}
