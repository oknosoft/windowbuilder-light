import React from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SegmentIcon from '@mui/icons-material/Segment';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SwipeLeftOutlinedIcon from '@mui/icons-material/SwipeLeftOutlined';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import Loading from '../../../aggregate/App/Loading';
import CuttingReport from './Report';
import CuttingProgress1D from './Progress1D';
import Repartition from '../Repartition';
import Cut2DMenu from './Cut2DMenu';
import ExcludeMenu from './ExcludeMenu';
import CutsMenu from './CutsMenu';
import ResetSticksMenu from './ResetSticksMenu';
const Manual2DCutting = React.lazy(() => import('./Manual2DCutting'));
const Manual2DCuts = React.lazy(() => import('./Manual2DCuts'));

const {adapters: {pouch}, ui: {dialogs}, enm: {debit_credit_kinds}, utils, classes} = $p;

function setSticks({obj, data, record}) {
  if(data.error) {
    return record(data.message);
  }
  const sticks = new Set();
  const sticksMap = new Map();
  const refresh = new Set();
  for(const row of data.scrapsIn) {
    let docRow = obj.cuts.find({stick: row.stick, record_kind: 'Приход'});
    if(!docRow) {
      throw new Error(`Нет заготовки №${row.stick}`);
    }
    if(sticks.has(docRow)) {
      docRow = obj.cuts.add(docRow);
      docRow.quantity = row.quantity;
      sticksMap.set(row.id, docRow.stick);
    }
    else {
      sticksMap.set(row.id, row.stick);
      refresh.add(docRow);
    }
    sticks.add(docRow);
    docRow.dop = {
      svg: row.svg,
      rez: data.rez.find(v => v[0] === docRow.stick)
        ?.filter((v) => Array.isArray(v))
        .map(([dir, x1, y1, x2, y2]) => ({dir, x1, y1, x2, y2})),
    };
    // обрезь
    obj.cuts.clear({stick: docRow.stick, record_kind: 'Расход'});
    for(const scrap of row.scraps) {
      const scrapRow = obj.cuts.add({
        stick: docRow.stick,
        record_kind: 'Расход',
        nom: docRow.nom,
        characteristic: docRow.characteristic,
        quantity: row.quantity,
        x: scrap.x,
        y: scrap.y,
        len: scrap.length,
        width: scrap.height,
      });
    }
  }
  for(const row of data.products) {
    const docRow = obj.cutting.get(row.id-1);
    if(!docRow) {
      throw new Error(`Нет отрезка №${row.id}`);
    }
    docRow.stick = sticksMap.get(row.stick);
    if(row.length === row.height) {
      docRow.rotated = false;
    }
    else if(docRow.width === row.height && docRow.len === row.length) {
      docRow.rotated = true;
    }
    else {
      docRow.rotated = false;
    }

    docRow.x = row.x;
    docRow.y = row.y;
  }
  for(const row of refresh) {
    obj._manager.emit('update', row, {indicator: true});
  }
  return utils.sleep(1000);
}

function noRow(title = 'Ручной раскрой 2D') {
  dialogs.alert({
    title,
    text: 'Не выбрана текущая строка',
  });
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

export function run2D(obj, setBackdrop, selected, mode) {
  if(mode !== 'all' && !selected?.row) {
    return dialogs.alert({
      title: 'Раскрой 2D',
      text: 'Укажите строку изделия или обрези',
    });
  }
  setBackdrop(true);
  let res = Promise.resolve();
  const errors = new Map();
  for(const [nom, params] of obj.fragments2D(mode !== 'all' && selected.row.nom, mode === 'currentScrap' && selected.row)) {
    const record = (msg) => {
      if(!errors.has(nom)) {
        errors.set(nom, []);
      }
      errors.get(nom).push(msg);
    };
    res = res.then(() => {
      if(!params.products.length || !params.scraps.length) {
        record('В задании нет изделий или заготовок для раскроя 2D');
        return {json() {
            return {
              scrapsIn: [],
              scrapsOut: [],
              products: [],
            }}};
      }
      if(!params.options) {
        params.options = {};
      }
      if(!params.options.edges) {
        const edgeBottom = nom._extra('edgeBottom');
        const edgeTop = nom._extra('edgeTop');
        const edgeLeft = nom._extra('edgeLeft');
        const edgeRight = nom._extra('edgeRight');
        params.options.edges = {
          dx: edgeLeft || edgeRight || 0,
          dy: edgeTop || edgeBottom || 0,
          dx1: edgeRight || 0,
          dy1: edgeBottom || 0,
        };
      }
      return pouch.fetch('/adm/api/cut', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    })
      .then((res) => res.json())
      .then((data) => setSticks({obj, data, record}));
  }
  return res
    .then(() => {
      setBackdrop(false);
      if(errors.size) {
        dialogs.alert({
          title: 'Ошибки раскроя',
          text: Array.from(errors)
            .map(([nom, errors], index) => <div key={index}>
              <Typography variant="h6">{nom.name}</Typography>
              {errors.map((err, ierr) => <Typography key={ierr}>{err}</Typography>)}
            </div>),
        });
      }
    })
    .catch((err) => {
      setBackdrop(false);
      dialogs.alert({
        title: 'Ошибки раскроя',
        text: err?.message || err,
      });
    });
}

export default function OptimizeCut({obj, setBackdrop, ext, setExt, selected, mode, divider = null}) {

  const state = React.useMemo(() => ({statuses: []}), [obj]);

  const report = () => {
    if(ext) {
      setExt(null);
    }
    else {
      setExt(<CuttingReport obj={obj} />);
    }
  };

  const malual = () => {
    if(ext) {
      setExt(null);
    }
    else {
      if(selected.rows?.size) {
        const Component = mode === 'cuts' ? Manual2DCuts : Manual2DCutting;
        const row = (mode === 'cuts' ? obj.cuts : obj.cutting).find({row: Array.from(selected.rows)[0]});
        setExt(<React.Suspense fallback={<Loading/>}>
          <Component obj={obj} row={row} setExt={setExt}/>
        </React.Suspense>);
      }
      else {
        noRow();
      }
    }
  };

  const reset_sticks = (what) => {
    const docRow = selected.rows && (mode === 'cuts' ? obj.cuts : obj.cutting).find({row: Array.from(selected.rows)[0]});
    if(!docRow && (what === 'currentNom' || what === 'currentScrap')) {
      return noRow('Очистка данных раскроя');
    }
    setBackdrop(true);
    obj._data._loading = mode === 'cuts';
    if(what === 'refill') {
      obj.cuts.clear();
      obj.fill_by_keys({c2d: true});
    }
    else {
      obj.reset_sticks('', what === 'currentNom' && docRow.nom, what === 'currentScrap' && docRow.stick);
    }
    Promise.resolve()
      .then(setBackdrop)
      .then(() => {
        if(obj._data._loading) {
          obj._data._loading = false;
          obj._manager.emit('rows', obj, {cuts: true, cutting: true});
          requestAnimationFrame(() => {
            for(const row of obj.cuts) {
              if(row.record_kind === debit_credit_kinds.debit) {
                obj._manager.emit('update', row, {indicator: true});
              }
            }
          });
        }
      });
  };

  const exclude = (what) => {
    if(selected.rows?.size) {
      const docRow = selected.rows && (mode === 'cuts' ? obj.cuts : obj.cutting).find({row: Array.from(selected.rows)[0]});
      let {nom, stick} = docRow;
      if(!stick) {
        stick = -1;
      }
      const rm = [], keys = [];
      for(const row of obj.cutting) {
        if(what === 'currentNom' ? row.nom === nom : row.stick === stick) {
          rm.push(row);
          if(!row.obj.empty()) {
            keys.push(row.obj);
          }
        }
      }
      for(const row of rm) {
        obj.cutting.del(row);
      }
      rm.length = 0;
      for(const row of obj.set) {
        if(keys.includes(row.obj)) {
          rm.push(row);
        }
      }
      for(const row of rm) {
        obj.set.del(row);
      }
      rm.length = 0;
      for(const row of obj.cuts) {
        if(what === 'currentNom' ? row.nom === nom : row.stick === stick) {
          rm.push(row);
        }
      }
      for(const row of rm) {
        obj.cuts.del(row);
      }
    }
    else {
      noRow('Исключение из задания');
    }
  };

  return <>
    {divider && <Divider orientation="vertical" flexItem sx={{m: 1}} />}
    <HtmlTooltip title="Оптимизировать раскрой профиля">
      <IconButton onClick={run1D(obj, setBackdrop, setExt, state)}><SegmentIcon/></IconButton>
    </HtmlTooltip>
    {<Cut2DMenu obj={obj} setBackdrop={setBackdrop} selected={selected} run2D={run2D}/>}
    <HtmlTooltip title="Разместить вручную">
      <IconButton onClick={malual}><SwipeLeftOutlinedIcon/></IconButton>
    </HtmlTooltip>
    {<ResetSticksMenu reset_sticks={reset_sticks} />}
    {<ExcludeMenu exclude={exclude}/>}

    {mode === 'cuts' ? null : <Repartition obj={obj} selected={selected} noRow={noRow} />}
    <Box sx={{flex: 1}}/>
    <HtmlTooltip title="Статистика раскроя">
      <IconButton onClick={report}><AssessmentOutlinedIcon/></IconButton>
    </HtmlTooltip>
  </>;
}

export function CutsInBtns({obj, setBackdrop, ext, setExt, selected, mode}) {
  return <>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <CutsMenu obj={obj} setBackdrop={setBackdrop}/>
    <OptimizeCut obj={obj} setBackdrop={setBackdrop} ext={ext} setExt={setExt} selected={selected} mode={mode}/>
  </>;
}
