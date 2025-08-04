
import {preventDefault} from '../../../aggregate/AppLoad/dataGrid';

const keys = {
  get(key) {
    if(!this.inited) {
      for(const name of 'nom,property_values'.split(',')) {
        const mgr = $p.cat[name];
        for(const elm of mgr.find_rows({shortcut: {ne: ""}})) {
          this[elm.shortcut] = elm;
        }
      }
      this.inited = true;
    }
    return this[key];
  }
};

const flip_yx = $p.job_prm.builder;


export function shortcuts({mode, row, rows, column, rowIdx, selectCell, onClose, event, gridRef, selectedRowsChange, methods}) {
  const { key, shiftKey, altKey } = event;
  const { idx } = column;
  if(mode === 'EDIT') {
    if(flip_yx && key === 'Enter') {
      preventDefault(event);
      onClose(true);
      if(idx < 5) {
        setTimeout(() => {
          gridRef.current?.selectCell({rowIdx, idx: idx + 1}, true);
        }, 60);
      }
      else if(idx === 5 && rowIdx < rows.length - 1) {
        setTimeout(() => {
          rowIdx += 1;
          gridRef.current?.selectCell({rowIdx, idx: 3}, true);
          selectedRowsChange(new Set([rows[rowIdx].key]));
        }, 60);
      }
    }
    return true;
  }
  else if(altKey) {
    preventDefault(event);
    const elm = keys.get(key);
    if(elm) {
      const {characteristic, inset, glassRow, editor} = row.row;
      let changed;

      function updateProw(prow) {
        if(prow.param.type.types.includes(elm.class_name)) {
          if(elm.owner === prow.param) {
            if(prow.value === elm) {
              prow.value = null;
            }
            else {
              prow.value = elm;
            }
            changed = true;
          }
          else if(inset) {
            const def = inset.product_params.find({param: prow.param});
            if(def.list && JSON.parse(def.list).find(v => v == elm)) {
              if(prow.value === elm) {
                prow.value = null;
              }
              else {
                prow.value = elm;
              }
              changed = true;
            }
          }
        }
      }

      // параметры изделия
      characteristic.params.find_rows({cnstr: 0, region: 0}, updateProw);
      // параметры вставки
      characteristic.params.find_rows({cnstr: -glassRow.elm, region: 0}, updateProw);
      // параметры рёбер
      const rrows = [];
      characteristic.coordinates.find_rows({cnstr: glassRow.cnstr, elm_type: 'Рама'}, (rrow) => rrows.push(rrow));
      characteristic.params.find_rows({cnstr: {in: rrows.map((v) => -v.elm)}, region: 0}, updateProw);

      if(changed) {
        methods.recalc();
      }
    }
  }
}
