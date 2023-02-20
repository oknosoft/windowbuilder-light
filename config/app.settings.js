
/**
 * ### При установке параметров сеанса
 * Процедура устанавливает параметры работы программы при старте веб-приложения
 *
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 */

const is_node = typeof process !== 'undefined' && process.versions && process.versions.node;
const local_storage_prefix = 'wb_';

module.exports = function settings(prm = {}) {

  Object.defineProperties(prm, {
    use_google_geo: {
      get() {
        return '';
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
    couch_local: process.env.COUCHLOCAL || `http://cou221:5984/${local_storage_prefix}`,

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

    // разрешаем сохранение пароля
    enable_save_pwd: true,

    // геокодер может пригодиться
    use_ip_geo: true,

    //
    keys: {
      geonames: 'oknosoft',
    },

  });

};
