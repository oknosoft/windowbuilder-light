
/**
 * ### При установке параметров сеанса
 * Процедура устанавливает параметры работы программы при старте веб-приложения
 *
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 */

const is_node = typeof process !== 'undefined' && process.versions && process.versions.node;

module.exports = function settings(prm = {}) {

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

    //base: process.env.NODE_ENV === 'production' ? '/light' : '',
    base: '',

    // разделитель для localStorage
    local_storage_prefix: 'wb_',

    // гостевые пользователи для демо-режима
    guests: [],

    // расположение couchdb для сайта
    couch_path: process.env.COUCHPATH || "/couchdb/wb_",

    // расположение couchdb для nodejs
    couch_local: process.env.COUCHLOCAL || 'http://cou221:5984/wb_',

    // расположение адаптера postgres
    pg_path: process.env.PGPATH || '/r/postgres/wb_',

    // расположение файлов руководства пользователя
    docs_root: 'https://raw.githubusercontent.com/oknosoft/windowbuilder/master/doc/',

    // по умолчанию, обращаемся к зоне 10
    zone: process.env.ZONE || 10,

    // объявляем номер демо-зоны
    zone_demo: 1,

    // традиционный ram не используем - тянем в озу через сервисворкер
    use_ram: false,

    // если use_meta === false, не используем базу meta в рантайме - см.: https://github.com/oknosoft/metadata.js/issues/255
    use_meta: false,

    // размер вложений 2Mb
    attachment_max_size: 2000000,

    // размер реплицируемых данных. если больше - включаем direct
    data_size_sync_limit: 160000000,

    // время до засыпания
    idle_timeout: 27 * 60 * 1000,

    // разрешаем сохранение пароля
    enable_save_pwd: true,

    // геокодер не используем
    use_ip_geo: false,

    // здесь можно перечислить имена параметров для включения в корень job_prm c подтягиванием значений из local_storage
    //additional_params: [],

    //
    keys: {
      geonames: 'oknosoft',
    },

  }, is_node && {
    // авторизация couchdb
    user_node: {
      username: process.env.DBUSER || 'admin',
      password: process.env.DBPWD || 'admin',
    },
  });

};
