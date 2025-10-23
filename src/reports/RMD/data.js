import {OrderFormatter, PKFormatter, renderSummaryDate, colSpan, renderSummaryObj, renderSummaryPower, renderSummaryTask} from './Formatters';
import {SelectColumn} from 'react-data-grid';

const {
  CatCharacteristics,
  cat: {scheme_settings, planning_keys, characteristics},
  doc: {calc_order, work_centers_task},
  rep, utils, wsql, adapters, md} = $p;

function rx_columns(attr) {
  const {mode, fields, _mgr, target} = attr;
  const hide = ['calc_order', 'obj'];
  const columns = this.constructor.prototype.rx_columns.call(this, attr)
    .filter((column) => {
      return dp.phase.is('plan') ? !hide.includes(column.key) : true;
    });

  for(const column of columns) {
    if(column.key === 'date' && columns.length > 3) {
      column.colSpan = colSpan;
      if(target === 'task') {
        column.renderSummaryCell = renderSummaryTask;
      }
      else {
        column.renderSummaryCell = renderSummaryDate;
      }
    }
    if(column.key === 'calc_order') {
      column.renderCell = OrderFormatter;
      delete column.width;
    }
    else if(column.key === 'obj') {
      column.renderCell = PKFormatter;
      if(target !== 'task') {
        column.renderSummaryCell = renderSummaryObj;
      }
      delete column.width;
    }
    else if(column.key === 'power' && target !== 'task') {
      column.renderSummaryCell = renderSummaryPower;
    }
  }
  if(!dp.phase.is('plan')) {
    columns.unshift({...SelectColumn, headerCellClass: 'cell-select', cellClass: 'cell-select'});
  }
  return columns;
}

export const title = 'РМД';
export const dp = rep.planning.create({phase: 'run'});
export const schemas = scheme_settings
  .find_schemas('rep.planning.data', true)
  .filter(v => !v.user)
  .sort(utils.sort('order'))
  .map((scheme) => {
    if(scheme.date_till < moment().add(1, 'day').toDate()) {
      scheme.date_till = moment(scheme.date_till).add(1, 'week').toDate();
    }
    if(scheme.hasOwnProperty('rx_columns')) {
      delete scheme.rx_columns;
    }
    Object.defineProperty(scheme, 'rx_columns', {value: rx_columns});
    return scheme;
  });

const schemeKey = 'rmd.scheme';
const userScheme = wsql.get_user_param(schemeKey);
export const initScheme = (userScheme && schemas.find(v => v.ref === userScheme)) ? userScheme : schemas[0]?.ref;
export const setScheme = (handleIfaceState, rmd, ref) => {
  wsql.set_user_param(schemeKey, ref);
  handleIfaceState({rmd: Object.assign({}, rmd, {scheme: scheme_settings.get(ref)})});
};


export const setTgt = (handleIfaceState, rmd, tgt, setBackdrop) => {
  handleIfaceState({rmd: Object.assign({}, rmd, {tgt})});
  rmd.tgt = tgt;
  const scheme = rmd.scheme || schemas[0];
  if(tgt.is_new()) {
    return setBackdrop?.(false);
  }

  let {date} = tgt;
  for(const row of tgt.set) {
    if(row.date < date) {
      date = row.date;
    }
  }
  if(scheme.date_from > date) {
    scheme.date_from = date;
  }
  query({rmd, scheme, handleIfaceState})
    .then(() => setBackdrop?.(false))
    .catch(err => {
      setBackdrop?.(false);
      console.error(err);
    });
};

export const checkTgt = (handleIfaceState, rmd, setBackdrop) => {
  const prms = utils.prm();
  if(prms.ref) {
    const task = work_centers_task.get(prms.ref);
    if(task.is_new()) {
      task.load()
        .then(() => task.load_keys())
        .then(() => task.load_linked_refs())
        .then(() => setTgt(handleIfaceState, rmd, task, setBackdrop));
    }
    else {
      setTgt(handleIfaceState, rmd, task, setBackdrop);
    }
  }
  else if(!rmd?.tgt) {
    setTgt(handleIfaceState, rmd, work_centers_task.create({date: new Date()}, false, true), setBackdrop);
  }
};

// перезаполняет табчасть при изменении основного отбора
export const query = async ({rmd, scheme, handleIfaceState}) => {
  // запрос к облаку
  const rows = await adapters.pouch
    .fetch(`/adm/api/dates/reminder?from=${scheme.date_from.toJSON().substring(0,10)}&till=${scheme.date_till.toJSON().substring(0,10)}&phase=${dp.phase.ref}`)
    .then(res => res.json());
  dp.data.clear();

  // недостающие ключи, подтянем отдельным запросом
  const {by_ref} = planning_keys;
  function create(attr) {
    let key = by_ref[attr.ref];
    if(!key) {
      key = planning_keys.obj_constructor('', [attr, planning_keys, true, true]);
      key._set_loaded();
    }
    return key;
  }
  const keys = new Set();
  const orders = new Set();
  for(const {ref, obj, specimen, elm, type, barcode, shift, part_type, ...raw} of rows) {
    if(ref) {
      const mgr = md.mgr_by_class_name(part_type);
      if(mgr === calc_order) {
        const part = mgr.by_ref[raw.part] || mgr.create({ref: raw.part}, false, true);
        if(part.is_new()) {
          orders.add(`${mgr.class_name}|${raw.part}`);
        }
      }
      if(!calc_order.by_ref[raw.calc_order] || calc_order.by_ref[raw.calc_order].is_new()) {
        orders.add(`${calc_order.class_name}|${raw.calc_order}`);
      }
    }
  }
  if(orders.size) {
    await adapters.pouch.load_array(null, Array.from(orders), false, adapters.pouch.remote.doc);
  }

  for(const {ref, obj, specimen, elm, type, barcode, shift, part_type, ...raw} of rows) {
    if(ref) {
      const mgr = md.mgr_by_class_name(part_type);
      const part = mgr.by_ref[raw.part] || mgr.create({ref: raw.part}, false, true);
      if(part.is_new()) {
        keys.add(`${mgr.class_name}|${raw.part}`);
      }
      create({ref, obj, specimen, elm, type, id: Number(barcode), calc_order: raw.calc_order});
      raw.obj = ref;
      raw.phase = dp.phase;
      raw.work_shift = shift;
      if(!calc_order.by_ref[raw.calc_order] || calc_order.by_ref[raw.calc_order].is_new()) {
        keys.add(`${calc_order.class_name}|${raw.calc_order}`);
      }
      if(type !== 'order' && !characteristics.by_ref[obj]) {
        keys.add(`${characteristics.class_name}|${obj}`);
      }
    }
    const row = dp.data.add(raw, true, null, true);
  }

  if(keys.size) {
    await adapters.pouch.load_array(null, Array.from(keys), false, adapters.pouch.remote.doc);
  }

  // фильтруем строки
  filter({rmd, scheme, handleIfaceState});
};

// фильтрует табчасть при изменении второстепенного отбора
export const filter = ({rmd, scheme, handleIfaceState}) => {
  const {tgt} = rmd;
  const rows = [], tgtrows = [];
  const {quickFilter} = scheme;
  const quickKeys = quickFilter ? Object.keys(quickFilter) : [];
  for(const row of scheme.filter(dp.data)) {
    if(quickKeys.some(fld => row[fld]?.valueOf() !== quickFilter[fld]?.valueOf())) {
      continue;
    }
    const {obj, work_center, work_shift, part, date} = row;
    const tgtrow = tgt.set.find({
      record_kind: -1,
      phase: dp.phase,
      obj,
      work_center,
      work_shift,
      part,
    });
    if(tgtrow) {
      tgtrows.push(tgtrow);
    }
    else {
      // TODO: фильтр
      rows.push(row);
    }
  }
  if(tgt.posted) {
    for(const row of  tgt.set) {
      if(row.record_kind === -1 && row.phase === dp.phase) {
        tgtrows.push(row);
      }
    }
  }
  handleIfaceState({rmd: Object.assign({}, rmd, {rows, tgtrows})});
};

export function rowKeyGetter (row) {
  return row.row;
}

export const summary = (rows, selectedRows) => {
  const res = {
    top: {id: 'total_top', count: 0, area:0, power: 0},
    bottom: {id: 'total_bottom',count: 0, area:0, power: 0}
  };
  for(const {row, obj, power} of rows) {
    if(obj.obj) {
      const {s} = obj.obj;
      if(selectedRows.has(row)) {
        res.top.count += 1;
        res.top.area += s;
        res.top.power += power;
      }
      else {
        res.bottom.count += 1;
        res.bottom.area += s;
        res.bottom.power += power;
      }
    }
  }
  return res;
}

