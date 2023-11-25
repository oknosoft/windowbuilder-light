
// конструктор metadata.js
import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import plugin_mime from 'metadata-core/lib/mime.min';
import plugin_scheme_settings from './cat/scheme_settings/plugin';
import proxy_login, {load_common} from '../packages/superlogin-proxy';

// функция установки параметров сеанса
import settings from '../../config/app.settings';

// читаем скрипт инициализации метаданных, полученный в результате выполнения meta:prebuild
import init_meta from 'wb-core/dist/init_meta';
import init_sql from 'wb-core/dist/init_sql';
import init_classes from 'wb-core/dist/init';
import modifiers from './modifiers';

// подключаем плагины к MetaEngine
MetaEngine
  .plugin(plugin_pouchdb)           // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_mime)              // подключаем mime-types
  .plugin(plugin_scheme_settings);

// создаём экземпляр MetaEngine и экспортируем его глобально
const $p = global.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(settings.prm(settings));
settings.cnn($p);

// со скрипом инициализации метаданных, так же - не затягиваем
init_meta($p);
init_sql($p);
init_classes($p);

// скрипт инициализации в привязке к store приложения
export function init(handleIfaceState) {

  try{

    // сообщяем адаптерам пути, суффиксы и префиксы
    const {wsql, job_prm, classes, adapters: {pouch}} = $p;
    if(wsql.get_user_param('couch_path') !== job_prm.couch_path && process.env.NODE_ENV !== 'development') {
      wsql.set_user_param('couch_path', job_prm.couch_path);
    }
    if(!wsql.get_user_param('auth_provider')) {
      wsql.set_user_param('auth_provider', 'couchdb');
    }

    classes.PouchDB.plugin(proxy_login());
    pouch.init(wsql, job_prm);

    // выполняем модификаторы
    modifiers($p);

    // информируем хранилище о готовности MetaEngine
    handleIfaceState({meta_loaded: true});

    // читаем общие данные в ОЗУ
    return load_common($p);

  }
  catch(err) {
    $p.record_log(err);
  }

}

export default $p;
