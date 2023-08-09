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

export const rowHeight = ({row, type}) => {
  if(type === 'DETAIL') {
    let {length} = row.inset.used_params();
    if(length < 6) {
      length = 6;
    }
    return length * 33 + 16;
  }
  return 33;
};

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
        return args.type === 'ROW' && args.row.type === 'DETAIL' ? 9 : undefined;
      },
      cellClass(row) {
        return row.type === 'DETAIL' ? classes.padding : undefined;
      },
      renderCell: ObjGlassesDetail,
    },
    {key: 'key', name: '№', width: 30,},
    {
      key: 'inset',
      name: 'Продукт',
      renderCell: ProductFormatter,
      renderEditCell(props) {
        const {row, onRowChange} = props;
        return <select
          autoFocus
          className="rdg-text-editor tlmcuo07-0-0-beta-36"
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
    {key: 'len', name: 'Ширина', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
    {key: 'height', name: 'Высота', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
    {key: 'price_internal', name: 'Цена', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
    {key: 'quantity', name: 'Колич.', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
    {key: 'discount_percent_internal', name: 'Скидка', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
    {key: 'amount_internal', name: 'Сумма', width: 88, renderCell: NumberFormatter},
  ],
    glasses,
    {skey: 0, rows: []}
  ];
}

export async function recalcRow({row, setBackdrop, setModified, noSave}) {
  const {characteristic} = row.row;
  if(characteristic._modified) {
    setBackdrop(true);
    const {project} = row.row.editor;
    project.redraw();
    await project.save_coordinates({save: !noSave});
    !noSave && setModified(false);
  }
}

export async function handleAdd({obj, proto, rows, setRows, setBackdrop, setModified, selectedRowsChange}) {
  const {job_prm, utils} = $p;
  setBackdrop(true);
  const row = new RowProxy(await obj.create_product_row({create: true}));
  if(!proto) {
    proto = job_prm.builder.glasses_template;
  }
  const tmp = utils._clone(proto.toJSON());
  utils._mixin(row.characteristic, tmp, null, 'ref,name,calc_order,timestamp,_rev,specification,class_name'.split(','), true);
  const newRow = {
    type: 'MASTER',
    expanded: false,
    row: row,
    key: row.row,
  };
  setRows([...rows, newRow]);

  await selectedRowsChange(new Set([newRow.key]), true);
  await recalcRow({row: newRow, setBackdrop, setModified});
  setBackdrop(false);
}
