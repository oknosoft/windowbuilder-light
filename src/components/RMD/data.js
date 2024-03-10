
const {cat, rep, utils, wsql} = $p;

export const title = 'РМД';
export const dp = $p.rep.planning.create();
export const schemas = cat.scheme_settings
  .find_schemas('rep.planning.data', true)
  .sort(utils.sort('order'));

export const initScheme = wsql.get_user_param('rmd.scheme') || schemas[0]?.ref;
export const setScheme = (handleIfaceState, rmd) => {
  wsql.set_user_param('rmd.scheme', rmd.scheme.ref);
  handleIfaceState({rmd});
};

