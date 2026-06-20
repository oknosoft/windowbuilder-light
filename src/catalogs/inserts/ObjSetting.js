
export const key = 'cat.inserts.form.obj';
export const setting = $p.wsql.get_user_param(key, 'object') || {};
if(!Object.keys(setting).length) {
  setting.tabs = [];
  setting.tab = 1;
}
setting.iconMap = {};

