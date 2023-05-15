import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ObjGlassesDetail from './ObjGlassesDetail';
import ProductFormatter from './ProductFormatter';

import {NumberCell, NumberFormatter} from '../../../../packages/ui/DataField/Number';
// доступные типы вставок
import {itypes, ioptions, RowProxy} from './RowProxy';

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
  for(const prow of obj.production) {
    const row = new RowProxy(prow);
    glasses.push({
      type: 'MASTER',
      expanded: false,
      row: row,
      key: row.row,
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
    {key: 'key', name: '№', width: 30,},
    {
      key: 'inset',
      name: 'Продукт',
      formatter: ProductFormatter,
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
    glasses,
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

export async function handleAdd({obj, setRows}) {
  const row = new RowProxy(await obj.create_product_row({create: true}));
  setRows((rows) => [...rows, {
    type: 'MASTER',
    expanded: false,
    row: row,
    key: row.row,
  }]);
}
