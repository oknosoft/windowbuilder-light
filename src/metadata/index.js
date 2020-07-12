
// конструктор metadata.js
import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import plugin_ui from 'metadata-abstract-ui';
import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars';
import plugin_mime from 'metadata-core/lib/mime.min';
import plugin_react from 'metadata-react/plugin';
import proxy_login, {load_ram, load_common} from 'metadata-superlogin/proxy';

// функция установки параметров сеанса
import settings from '../../config/app.settings';
// принудительный редирект и установка зоны для абонентов с выделенными серверами
import {patch_prm, patch_cnn} from '../../config/patch_cnn';

// читаем скрипт инициализации метаданных, полученный в результате выполнения meta:prebuild
import meta_init from 'windowbuilder/dist/init';
import modifiers from './modifiers';

// конструкторы ui
import {lazy} from '../components/App/lazy';
import {user_log_in, user_log_out} from '../components/App/tune_menu';

// генераторы действий и middleware для redux
//import {combineReducers} from 'redux';
import {addMiddleware} from 'redux-dynamic-middlewares';
import {metaActions, metaMiddleware} from 'metadata-redux';

// подключаем плагины к MetaEngine
MetaEngine
  .plugin(plugin_pouchdb)     // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_ui)          // подключаем общие методы интерфейса пользователя
  .plugin(plugin_mime)        // подключаем mime-types
  .plugin(plugin_ui_tabulars) // подключаем методы экспорта табличной части
  .plugin(plugin_react);      // подключаем react-специфичные модификаторы к scheme_settings

// создаём экземпляр MetaEngine и экспортируем его глобально
const $p = global.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(patch_prm(settings));
patch_cnn();

// со скрипом инициализации метаданных, так же - не затягиваем
meta_init($p);

// сумма прописью
import('metadata-abstract-ui/rubles');

// скрипт инициализации в привязке к store приложения
export function init(store) {

  try{
    const {dispatch} = store;

    // подключаем metaMiddleware
    addMiddleware(metaMiddleware($p));

    // сообщяем адаптерам пути, суффиксы и префиксы
    const {wsql, job_prm, classes, adapters: {pouch}, md, ui} = $p;
    if(wsql.get_user_param('couch_path') !== job_prm.couch_path && process.env.NODE_ENV !== 'development') {
      wsql.set_user_param('couch_path', job_prm.couch_path);
    }
    classes.PouchDB.plugin(proxy_login());
    pouch.init(wsql, job_prm);

    pouch.remote.ram = new classes.PouchDB(pouch.dbpath('ram'), {skip_setup: true, owner: pouch, fetch: pouch.fetch});

    // выполняем модификаторы
    modifiers($p, dispatch);

    // информируем хранилище о готовности MetaEngine
    dispatch(metaActions.META_LOADED($p));

    import('../redux')
      .then(({handleIfaceState: {handleIfaceState}}) => ui.dialogs.init({handleIfaceState, lazy}));

    pouch.on({
      on_log_in() {
        return load_ram($p)
          .then(user_log_in);
      },
      user_log_out,
    });
    md.once('predefined_elmnts_inited', () => pouch.emit('pouch_complete_loaded'));


    // читаем общие данные в ОЗУ
    return load_common($p);

  }
  catch(err) {
    $p.record_log(err);
  }

}

export default $p;
