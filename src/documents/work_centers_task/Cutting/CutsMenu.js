import React from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import {ToolbarMenu} from './Cut2DMenu';
import {materialSort} from '../print/CutsBalance'

const {adapters: {pouch}, utils, ui: {dialogs}, enm: {debit_credit_kinds}, cat: {nom: nomMgr}, job_prm: {planning: {use_biz_cuts}}} = $p;

function fill_cuts({obj, setBackdrop}) {
  if(use_biz_cuts) {
    const nom = new Set();
    for(const row of obj.cutting) {
      if(row.len && row.width) {
        nom.add(row.nom);
      }
    }
    if(nom.size) {
      setBackdrop(true);
      pouch.fetch('/adm/api/pgsql/cuts', {
        method: 'POST',
        body: JSON.stringify({
          nom: Array.from(nom).map(v => v.ref),
          ref: obj.ref,
          type: obj.class_name,
        }),
      })
        .then(res => res.json())
        .then(({rows}) => {
          obj.cuts.clear();
          const sorted = rows
            .map(({nom, len, width, ...other}) => ({
              nom: nomMgr.get(nom),
              len: parseFloat(len),
              width: parseFloat(width),
              ...other}))
            .sort(materialSort);
          for(const {nom, len, width, qty} of sorted) {
            obj.cuts.add({
              record_kind: debit_credit_kinds.debit,
              nom,
              len,
              width,
              quantity: qty,
            });
          }
        })
        .catch(() => null)
        .then(setBackdrop);
    }
    else {
      dialogs.alert({
        title: 'Раскрой 2D',
        text: 'Нет изделий к раскрою - нечего заполнять',
      });
    }
  }
  else {
    obj.fill_cuts();
  }
}

function unused({obj, setBackdrop}) {
  const rm = [];
  for(const row of obj.cuts) {
    if(row.record_kind === debit_credit_kinds.debit && !obj.cutting.find({stick: row.stick})) {
      rm.push(row);
    }
  }
  if(rm.length) {
    setBackdrop(true);
    obj._data._loading = true;
    utils.sleep(100).then(() => {
      for(const row of rm) {
        obj.cuts.del(row);
      }
    })
      .then(() => {
        obj._data._loading = false;
        obj._manager.emit('rows', obj, {cuts: true});
        requestAnimationFrame(() => {
          for(const row of obj.cuts) {
            if(row.record_kind === debit_credit_kinds.debit) {
              obj._manager.emit('update', row, {indicator: true});
            }
          }
        });
        setBackdrop(false);
      });
  }
}

export default function CutsMenu({obj, setBackdrop}) {

  return ToolbarMenu({
    title: 'Деловая обрезь',
    icon: <LayersIcon/>,
    items: [
      {
        text: `Заполнить ${use_biz_cuts ? 'по остаткам' : 'стандартными размерами'}`,
        action() {
          fill_cuts({obj, setBackdrop});
        },
      },
      {
        text: 'Исключить неиспользованные',
        action() {
          unused({obj, setBackdrop});
        }
      },
    ]
  });
}
