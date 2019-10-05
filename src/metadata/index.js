
// конструктор metadata.js
import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import plugin_ui from 'metadata-abstract-ui';
import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars';
import plugin_react from 'metadata-react/plugin';
import proxy_login from 'metadata-superlogin/proxy';
import adapter_memory from 'pouchdb-adapter-memory';

// функция установки параметров сеанса
import settings from '../../config/app.settings';

// читаем скрипт инициализации метаданных, полученный в результате выполнения meta:prebuild
import meta_init from 'windowbuilder/public/dist/init';
import modifiers from './modifiers';
import {load_ram, load_common} from './common/load_ram';

// генераторы действий и middleware для redux
//import {combineReducers} from 'redux';
import {addMiddleware} from 'redux-dynamic-middlewares';
import {metaActions, metaMiddleware} from 'metadata-redux';

// подключаем плагины к MetaEngine
MetaEngine
  .plugin(plugin_pouchdb)     // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_ui)          // подключаем общие методы интерфейса пользователя
  .plugin(plugin_ui_tabulars) // подключаем методы экспорта табличной части
  .plugin(plugin_react);      // подключаем react-специфичные модификаторы к scheme_settings

// создаём экземпляр MetaEngine и экспортируем его глобально
const $p = global.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(settings);

// со скрипом инициализации метаданных, так же - не затягиваем
meta_init($p);

// скрипт инициализации в привязке к store приложения
export function init(store) {

  try{
    const {dispatch} = store;

    // подключаем metaMiddleware
    addMiddleware(metaMiddleware($p));

    // сообщяем адаптерам пути, суффиксы и префиксы
    const {wsql, job_prm, classes, adapters: {pouch}} = $p;
    if(wsql.get_user_param('couch_path') !== job_prm.couch_path && process.env.NODE_ENV !== 'development') {
      wsql.set_user_param('couch_path', job_prm.couch_path);
    }
    classes.PouchDB
      //.plugin(adapter_memory)
      .plugin(proxy_login());

    pouch.init(wsql, job_prm);
    if(!pouch.props._auth_provider) {
      pouch.props._auth_provider = wsql.get_user_param('auth_provider') || 'couchdb';
    }
    const opts = {auto_compaction: true, revs_limit: 3, owner: pouch};
    pouch.remote.ram = new classes.PouchDB(pouch.dbpath('ram'), opts);

    // выполняем модификаторы
    modifiers($p, dispatch);

    // информируем хранилище о готовности MetaEngine
    dispatch(metaActions.META_LOADED($p));

    pouch.on({
      on_log_in() {
        return load_ram($p);
      },
      pouch_doc_ram_loaded() {
        //pouch.emit('pouch_complete_loaded');
      },
    });

    // читаем общие данные в ОЗУ
    return load_common($p);

  }
  catch(err) {
    $p.record_log(err);
  }

}

export default $p;
