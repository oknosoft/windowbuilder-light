import React from 'react';
import ObjGlassesDetail from './ObjGlassesDetail';
import ProductFormatter from './ProductFormatter';

import {NumberCell, NumberFormatter} from '../../../../packages/ui/DataField/Number';
// доступные типы вставок
import {itypes, ioptions, ilist, RowProxy} from './RowProxy';

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
          className="rdg-text-editor tlmcuo07-0-0-beta-41"
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
    {key: 'quantity', name: 'Колич.', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
    {key: 'price_internal', name: 'Цена', width: 88, renderEditCell: NumberCell, renderCell: NumberFormatter},
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

  const {job_prm, utils, doc: {calc_order}} = $p;

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

  const del = async () => {
    const row = getRow();
    if(row) {
      await selectedRowsChange(new Set(), true);
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
      setBackdrop(false);
    }
    else {
      setSnack('Укажите строку табчасти для удаления');
    }
  };

  const clear = async () => {
    obj.production.clear();
    await selectedRowsChange(new Set(), true);
    setRows([]);
    setBackdrop(false);
  };

  const open = () => {

  };

  const load = async (text) => {
    const irows = [];
    const regex = /-|\*|х|Х|X|x/g;
    for(const row of text.split('\n')) {
      const values = row.split('\t');
      let strings = 0;
      let numbers = 0;
      let newRow;
      for(const raw of values) {
        const formula = regex.test(raw) ? raw.replace(regex, 'x') : '';
        const n = formula ? NaN : parseFloat(raw.replace(/\s/, ''));
        if(isNaN(n)) {
          if(!strings && !newRow) {
            newRow = {formula, note: []};
          }
          if(strings && raw) {
            newRow.note.push(raw);
          }
          strings++;
        }
        else if(newRow) {
          if(!numbers) {
            newRow.len = n;
          }
          else if(numbers === 1) {
            newRow.height = n;
          }
          else if(!newRow.quantity) {
            newRow.quantity = n;
          }
          numbers++;
        }
      }
      if(newRow?.formula && newRow.height) {
        if(!newRow.quantity) {
          newRow.quantity = 1;
        }
        newRow.formula = newRow.formula.toLowerCase();
        newRow.note = newRow.note.join('\xA0');
        irows.push(newRow);
      }
    }
    if(irows.length) {
      await selectedRowsChange(new Set(), true);
      setBackdrop(true);
      const newRows = [];
      const problems = new Set();
      for(const {formula, len, height, quantity, note} of irows) {
        const candidates = [];
        for(const inset of ilist) {
          const article = inset.article.replace(regex, 'x').toLowerCase();
          const name = inset.name.replace(regex, 'x').toLowerCase();
          if(article === formula) {
            candidates.push({inset, weight: 10});
          }
          else if(name === formula) {
            candidates.push({inset, weight: 9});
          }
          else if(article.startsWith(formula)) {
            candidates.push({inset, weight: 6 - (article.length - formula.length)});
          }
          else if(name.startsWith(formula)) {
            candidates.push({inset, weight: 5 - (name.length - formula.length)});
          }
        }
        if(candidates.length) {
          candidates.sort((a, b) => b.weight - a.weight);
          const row = new RowProxy(await obj.create_product_row({create: true}));
          newRows.push({type: 'MASTER', expanded: false, row, key: row.row});
          const tmp = utils._clone(job_prm.builder.glasses_template.toJSON());
          utils._mixin(row.characteristic._set_loaded(), tmp, null, 'ref,name,calc_order,timestamp,_rev,specification,class_name'.split(','), true);
          await row.createEditor();
          const {editor: {project, eve}, glassRow} = row;
          const glass = row.editor.elm(glassRow.elm);
          glass.set_inset(candidates[0].inset, false, true);
          const {bottom, right} = project.l_dimensions;
          right.sizes_wnd({wnd: right, size: height, name: 'auto'});
          bottom.sizes_wnd({wnd: bottom, size: len, name: 'auto'});
          while (eve._async?.move_points?.timer) {
            await utils.sleep(20);
          }
          row.quantity = project._dp.quantity = quantity;
          row.note = project._dp.note = project.ox.note = note;
          project.redraw();
          await project.save_coordinates({});
          row.characteristic._modified = true;
        }
        else {
          problems.add(formula);
        }
      }
      setRows([...rows, ...newRows]);
      await obj.save();
      setBackdrop(false);
      if(problems.size) {
        const formulas = Array.from(problems).join('\n');
        $p.record_log({class: 'formulas', obj: formulas});
        alert(`Не найдено соответствия для формул:\n ${formulas}`);
      }
    }
    else {
      alert('Не найдено подходящих строк для импорта');
    }
  };

  return {create, clone, open, del, clear, add, load};

}

