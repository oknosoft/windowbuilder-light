import React from 'react';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {HtmlTooltip} from '../../../components/App/styled';

function params(obj) {
  const res = {
    products: [],
    scraps: [],
    options: {}
  };
  for(const row of obj.cuts) {
    if(row.record_kind.empty()) {
      row.record_kind = 'debit';
    }
    if(!row.stick) {
      row.stick = obj.cuts.aggregate([], ['stick'], 'max') + 1;
    }
    if(row.record_kind.is('debit') && row.width && row.len && row.quantity) {
      res.scraps.push({stick: row.stick, length: row.len, height: row.width, quantity: row.quantity});
    }
  }
  for(const row of obj.cutting) {
    if(row.width && row.len) {
      res.products.push({id: row.row, length: row.len, height: row.width, quantity: 1, info: row.row});
    }
  }
  return res;
}

function setSticks(obj, data) {
  if(data.error) {
    throw data;
  }
  const sticks = new Set();
  for(const row of data.scrapsIn) {
    let docRow = obj.cuts.find({stick: row.stick});
    if(!docRow) {
      throw new Error(`Нет заготовки №${row.stick}`);
    }
    if(sticks.has(docRow)) {
      docRow = obj.cuts.add(docRow);
      docRow.stick = row.id;
      docRow.quantity = row.quantity;
    }
    sticks.add(docRow);
    docRow.dop = {svg: row.svg};
  }
  for(const row of data.scrapsOut) {

  }
  for(const row of data.products) {
    const docRow = obj.cutting.get(row.id-1);
    if(!docRow) {
      throw new Error(`Нет отрезка №${row.id}`);
    }
    docRow.stick = row.stick;
    docRow.rotated = row.rotate;
    docRow.x = row.x;
    docRow.y = row.y;
  }
}

function resetSticks(obj) {
  for(const row of obj.cutting) {
    row.stick = 0;
    row.pair = 0;
  }
}

export default function Optimize2D({setBackdrop, obj}) {

  const run = () => Promise.resolve(params(obj))
    .then((params) => {
      setBackdrop(true);
      return $p.adapters.pouch.fetch('/adm/api/cut', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    })
    .then((res) => res.json())
    .then((data) => setSticks(obj, data))
    .then(() => setBackdrop(false))
    .catch((err) => {
      setBackdrop(false);
      alert(err?.message || err);
    });

  return <>
    <HtmlTooltip title="Оптимизировать раскрой 2D">
      <IconButton onClick={run}><FilterListIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Удалить данные оптимизации раскроя">
      <IconButton onClick={() => resetSticks(obj)}><FilterListOffIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
