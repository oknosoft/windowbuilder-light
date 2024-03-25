
const {cat, rep, utils, wsql, adapters} = $p;

export const title = 'РМД';
export const dp = rep.planning.create({phase: 'plan'});
export const schemas = cat.scheme_settings
  .find_schemas('rep.planning.data', true)
  .sort(utils.sort('order'));

export const initScheme = wsql.get_user_param('rmd.scheme') || schemas[0]?.ref;
export const setScheme = (handleIfaceState, rmd) => {
  wsql.set_user_param('rmd.scheme', rmd.scheme.ref);
  handleIfaceState({rmd});
};

// перезаполняет табчасть при изменении основного отбора
export const query = async ({rmd, scheme, handleIfaceState}) => {
  // запрос к облаку
  const rows = await adapters.pouch
    .fetch(`/adm/api/dates/reminder?from=${scheme.date_from.toJSON().substring(0,10)}&till=${scheme.date_till.toJSON().substring(0,10)}&phase=${dp.phase.ref}`)
    .then(res => res.json());
  dp.data.clear();

  // недостающие ключи, подтянем отдельным запросом
  const {by_ref} = cat.planning_keys;
  function create(attr) {
    let key = by_ref[attr.ref];
    if(!key) {
      key = cat.planning_keys.obj_constructor('', [attr, cat.planning_keys, true, true]);
      key._set_loaded();
    }
    return key;
  }
  for(const {ref, obj, specimen, elm, type, barcode, ...row} of rows) {
    if(ref) {
      create({ref, obj, specimen, elm, type, id: Number(barcode)});
      row.obj = ref;
    }
    dp.data.add(row, true, null, true);
  }

  // фильтруем строки
  filter({rmd, scheme, handleIfaceState});
};

// фильтрует табчасть при изменении второстепенного отбора
export const filter = ({rmd, scheme, handleIfaceState}) => {
  const rows = [];
  for(const row of dp.data) {
    rows.push(row);
  }
  handleIfaceState({rmd: Object.assign({}, rmd, {rows})});
};

