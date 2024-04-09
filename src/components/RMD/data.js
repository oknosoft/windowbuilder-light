import {OrderFormatter, PKFormatter} from './Formatters';
import {SelectColumn} from 'react-data-grid';

const {
  CatCharacteristics,
  cat: {scheme_settings, planning_keys, characteristics},
  doc: {calc_order, work_centers_task},
  rep, utils, wsql, adapters} = $p;

function rx_columns(attr) {
  const {mode, fields, _mgr} = attr;
  const hide = ['calc_order', 'obj'];
  const columns = this.constructor.prototype.rx_columns.call(this, attr)
    .filter((column) => {
      return dp.phase.is('plan') ? !hide.includes(column.key) : true;
    });

  for(const column of columns) {
    if(column.key === 'calc_order') {
      column.renderCell = OrderFormatter;
    }
    else if(column.key === 'obj') {
      column.renderCell = PKFormatter;
      delete column.width;
    }
  }
  if(!dp.phase.is('plan')) {
    columns.unshift({...SelectColumn, headerCellClass: 'cell-select', cellClass: 'cell-select'});
  }
  return columns;
}

export const title = 'РМД';
export const dp = rep.planning.create({phase: 'run'});
export let tgt = work_centers_task.create({date: new Date()}, false, true);
export const schemas = scheme_settings
  .find_schemas('rep.planning.data', true)
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

export const initScheme = wsql.get_user_param('rmd.scheme') || schemas[0]?.ref;
export const setScheme = (handleIfaceState, rmd, ref) => {
  wsql.set_user_param('rmd.scheme', ref);
  handleIfaceState({rmd: Object.assign({}, rmd, {scheme: scheme_settings.get(ref)})});
};
export const setTgt = (handleIfaceState, rmd, doc) => {
  tgt = doc;
  handleIfaceState({rmd: Object.assign({}, rmd, {tgt})});
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
  for(const {ref, obj, specimen, elm, type, barcode, ...raw} of rows) {
    if(ref) {
      create({ref, obj, specimen, elm, type, id: Number(barcode)});
      raw.obj = ref;
      raw.phase = dp.phase;
      if(!calc_order.by_ref[raw.calc_order]) {
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
  const rows = [], tgtrows = [];
  for(const row of dp.data) {
    const {obj, work_center, work_shift, date} = row;
    const tgtrow = tgt.set.find({
      record_kind: -1,
      phase: dp.phase,
      obj: obj.valueOf(),
      work_center: work_center.valueOf(),
      work_shift: work_shift.valueOf(),
      date: date,
    });
    if(tgtrow) {
      tgtrows.push(tgtrow);
    }
    else {
      // TODO: фильтр
      rows.push(row);
    }
  }
  handleIfaceState({rmd: Object.assign({}, rmd, {rows, tgtrows})});
};

