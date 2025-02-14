
/**
 * ### При установке параметров сеанса
 * Процедура устанавливает параметры работы программы при старте веб-приложения
 *
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 */

const isNode = typeof process === "undefined" ? false : process.versions?.node;
const lsPrefix = 'wb_';

function settings(prm = {}) {

  Object.assign(prm, {

    isNode,

    // разделитель для localStorage
    lsPrefix,

    // расположение couchdb для nodejs
    couch_local: (isNode && process.env.COUCHLOCAL) || `http://cou221:5984/${lsPrefix}`,

    // расположение couchdb для браузера
    get couch_path() {
      return isNode ? this.couch_local : `/couchdb/${lsPrefix}`;
    },

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

  }, isNode && {
    userNode: {
      username: process.env.DBUSER || 'admin',
      password: process.env.DBPWD || 'admin',
      secret: process.env.COUCHSECRET,
    },
  });

  // по умолчанию, обращаемся к зоне 1
  if(!prm.get('zone')) {
    prm.set('zone', 92);
  }

}
module.exports = settings;
