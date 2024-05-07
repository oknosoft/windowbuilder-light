import React from 'react';
import IconButton from '@mui/material/IconButton';
import SegmentIcon from '@mui/icons-material/Segment';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import {HtmlTooltip} from '../../../components/App/styled';
import CuttingReport from './CuttingReport';
import CuttingProgress1D from './CuttingProgress1D';

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

export function run1D(obj, setBackdrop, setExt, state) {

  if(!state) {
    state = {statuses: []};
  }
  // вызывается из раскроя
  const onStep = (status) => {
    const {nom, characteristic} = status.cut_row;
    const statuses = utils._clone(state.statuses);
    let row;
    if(!statuses.some((elm) => {
      if(elm.nom === nom && elm.characteristic === characteristic) {
        row = elm;
        return true;
      }
    })) {
      row = {nom, characteristic};
      statuses.push(row);
    }
    Object.assign(row, status);
    Object.assign(state, {statuses});
    
    setExt(<CuttingProgress1D statuses={statuses}/>);
  };

  return () => {
    setBackdrop(true);
    setExt(<CuttingProgress1D statuses={state.statuses}/>);
    obj.reset_sticks('1D');
    return (classes.Cutting ? Promise.resolve() : import('wb-cutting')
      .then((module) => classes.Cutting = module.default))
      .then(() => obj.optimize({onStep, state}))
      .then((res) => {
        setBackdrop(false);
        setExt(null);
        return res;
      })
      .catch((err) => {
        setBackdrop(false);
        setExt(null);
        dialogs.alert({
          title: 'Раскрой 2D',
          text: err?.message || err,
        });
      });
  };
}

export function run2D(obj, setBackdrop) {
  obj.reset_sticks('2D');
  return () => Promise.resolve(obj.fragments2D())
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
}

export default function OptimizeCut({obj, setBackdrop, ext, setExt}) {

  const state = React.useMemo(() => ({statuses: []}), [obj]);

  const report = () => {
    if(ext) {
      setExt(null);
    }
    else {
      setExt(<CuttingReport obj={obj} />);
    }
  };

  return <>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Оптимизировать раскрой профиля">
      <IconButton onClick={run1D(obj, setBackdrop, setExt, state)}><SegmentIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Оптимизировать раскрой 2D">
      <IconButton onClick={run2D(obj, setBackdrop, setExt)}><ViewQuiltIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Удалить данные оптимизации раскроя">
      <IconButton onClick={() => obj.reset_sticks()}><PlaylistRemoveIcon/></IconButton>
    </HtmlTooltip>
    <Box sx={{flex: 1}}/>
    <HtmlTooltip title="Статистика раскроя">
      <IconButton onClick={report}><AssessmentOutlinedIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
