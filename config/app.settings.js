
/**
 * ### При установке параметров сеанса
 * Процедура устанавливает параметры работы программы при старте веб-приложения
 *
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 */

const is_node = typeof process !== 'undefined' && process.versions && process.versions.node;
const local_storage_prefix = 'wb_';

function settings(prm = {}) {

  Object.defineProperties(prm, {
    use_google_geo: {
      get() {
        return '';
      }
    },
    session_zone: {
      get() {
        return typeof sessionStorage === 'object' && sessionStorage.key('zone') ? sessionStorage.getItem('zone') : this.zone;
      }
    }
  });

  return Object.assign(prm, {

    is_node,

    // разделитель для localStorage
    local_storage_prefix,

    // гостевые пользователи для демо-режима
    guests: [],

    // расположение couchdb для nodejs
    couch_local: `http://cou221:5984/${local_storage_prefix}`,

    // расположение couchdb для браузера
    get couch_path() {
      return is_node ? this.couch_local : `/couchdb/${local_storage_prefix}`;
    },

    // по умолчанию, обращаемся к зоне 1
    zone: 0,

    // объявляем номер демо-зоны
    zone_demo: -1,

    // если use_meta === false, не используем базу meta в рантайме
    // см.: https://github.com/oknosoft/metadata.js/issues/255
    use_meta: false,
    use_ram: false,

    // размер вложений 5Mb
    attachment_max_size: 5000000,

    // расположение файлов руководства пользователя
    docs_root: 'https://raw.githubusercontent.com/oknosoft/windowbuilder/develop/doc/',

    // геокодер может пригодиться
    use_ip_geo: true,

    //
    keys: {
      geonames: 'oknosoft',
    },

  });

}
module.exports = settings;

// корректирует параметры до инициализации
settings.prm = (settings) =>{
  const {predefined} = _dynamic_patch_;
  return (prm) => {
    settings(prm);
    'zone,ram_indexer'.split(',').forEach((name) => {
      if(predefined.hasOwnProperty(name)) {
        prm[name] = predefined[name];
      }
    });
    return prm;
  };
};

// корректируем параметры после инициализации
settings.cnn = ({job_prm, wsql}) => {
  const {predefined} = _dynamic_patch_;
  predefined.zone && wsql.get_user_param('zone') != predefined.zone && wsql.set_user_param('zone', predefined.zone);
  'log_level,splash,keys'.split(',').forEach((name) => {
    if(predefined.hasOwnProperty(name)) {
      if(typeof job_prm[name] === 'object') {
        Object.assign(job_prm[name], predefined[name]);
      }
      else {
        job_prm[name] = predefined[name];
      }
    }
  });

  if(job_prm.use_ram) {
    wsql.set_user_param('use_ram', false);
    job_prm.use_ram = false;
  }
};
