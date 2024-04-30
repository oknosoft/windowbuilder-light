import React from 'react';
import IconButton from '@mui/material/IconButton';
import SegmentIcon from '@mui/icons-material/Segment';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import {HtmlTooltip} from '../../../components/App/styled';

const {adapters: {pouch}, ui: {dialogs}, utils, classes} = $p;

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

export function run1D(obj, setBackdrop) {
  return () => {
    setBackdrop(true);
    return (classes.Cutting ? Promise.resolve() : import('wb-cutting')
      .then((module) => classes.Cutting = module.default))
      .then(() => obj.optimize({}))
      .then((res) => {
        setBackdrop(false);
        return res;
      })
      .catch((err) => {
        setBackdrop(false);
        dialogs.alert({
          title: 'Раскрой 2D',
          text: err?.message || err,
        });
      });
  };
}

export default function Optimize2D({setBackdrop, obj}) {

  const run2D = () => Promise.resolve(obj.fragments2D())
    .then((params) => {
      if(!params.products.length || !params.scraps.length) {
        throw new Error('В задании нет изделий или заготовок для раскроя 2D');
      }
      setBackdrop(true);
      return pouch.fetch('/adm/api/cut', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    })
    .then((res) => res.json())
    .then((data) => setSticks(obj, data))
    .then(() => setBackdrop(false))
    .catch((err) => {
      setBackdrop(false);
      dialogs.alert({
        title: 'Раскрой 2D',
        text: err?.message || err,
      });
    });

  return <>
    <HtmlTooltip title="Оптимизировать раскрой профиля">
      <IconButton onClick={run1D(obj, setBackdrop)}><SegmentIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Оптимизировать раскрой 2D">
      <IconButton onClick={run2D}><ViewQuiltIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Удалить данные оптимизации раскроя">
      <IconButton onClick={() => resetSticks(obj)}><PlaylistRemoveIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
