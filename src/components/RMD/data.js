
const {cat, rep, utils, wsql, adapters} = $p;

export const title = 'РМД';
export const dp = rep.planning.create();
export const schemas = cat.scheme_settings
  .find_schemas('rep.planning.data', true)
  .sort(utils.sort('order'));

export const initScheme = wsql.get_user_param('rmd.scheme') || schemas[0]?.ref;
export const setScheme = (handleIfaceState, rmd) => {
  wsql.set_user_param('rmd.scheme', rmd.scheme.ref);
  handleIfaceState({rmd});
};

// перезаполняет табчасть при изменении основного отбора
export const query = utils.debounce(async () => {

});

// фильтрует табчасть при изменении второстепенного отбора
export const filter = () => {

};

