import React from 'react';
import ObjGlassesDetail from './ObjGlassesDetail';
import ProductFormatter from './ProductFormatter';

import {NumberCell, NumberFormatter} from '../../../../packages/ui/DataField/Number';
// доступные типы вставок
import {itypes, ioptions, RowProxy} from './RowProxy';

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

export function createGlasses({obj}){
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
        return row.type === 'DETAIL' ? 'glass-padding' : undefined;
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
          className="rdg-text-editor tlmcuo07-0-0-beta-39"
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

export function handlers({obj, rows, setRows, getRow, setBackdrop, setModified, setSnack, selectedRowsChange}) {

  const {job_prm, utils} = $p;

  const add = async (proto, noBackdrop) => {
    !noBackdrop && setBackdrop(true);
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
    !noBackdrop && await recalcRow({row: newRow, setBackdrop, setModified});
    !noBackdrop && setBackdrop(false);
    return newRow;
  };

  const create = () => add();

  const clone = () => add(getRow());

  const del = () => {
    const row = getRow();
    if(row) {
      selectedRowsChange(new Set(), true);
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

  const clear = () => {
    obj.production.clear();
    setRows([]);
  };

  const open = () => {

  };

  const load = async (text) => {
    const rows = [];
    for(const row of text.split('\n')) {
      const values = row.split('\t');
      let strings = 0;
      let numbers = 0;
      let newRow;
      for(const v of values) {
        if(v) {
          const n = parseFloat(v);
          if(isNaN(n)) {
            if(!strings && !newRow) {
              newRow = {inset: v};
            }
            strings++;
          }
          else if(newRow) {
            if(!numbers) {
              newRow.len = n;
            }
            else if(numbers === 1) {
              newRow.width = n;
            }
            else {
              newRow.quantity = n;
            }
            numbers++;
          }
        }
      }
      if(newRow?.inset && newRow.width) {
        if(!newRow.quantity) {
          newRow.quantity = 1;
        }
        rows.push(newRow);
      }
    }
    if(rows.length) {
      for(const {inset, len, width, quantity} of rows) {
        setBackdrop(true);
        const row = await add(null, true);
        //row.row.inset = inset;
        setBackdrop(true);
      }
    }
  };

  return {create, clone, open, del, clear, add, load};

}

